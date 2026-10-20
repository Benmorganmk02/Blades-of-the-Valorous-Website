// Loads the Markdown files in /content at build time. Each file starts with a
// small "frontmatter" header between --- lines (title, order, etc.).
//
// Lore is grouped by world: content/lore/<world>/_world.md describes the world
// itself, and every other .md file in that folder is one of its chapters.
// A world can also have time periods (e.g. Aetherastra's Aeontides): each is a
// sub-folder with a _period.md, and the other .md files inside are its sections.

export interface Entry {
  slug: string;
  title: string;
  order: number;
  summary: string;
  icon: string;
  body: string;
  meta: Record<string, string>;
}

export interface Period extends Entry {
  /** Small label above the title, e.g. "The First Aeontide". */
  era: string;
  sections: Entry[];
}

export interface World extends Entry {
  tagline: string;
  primary: boolean;
  /** What this world calls its time periods, e.g. "Aeontides". */
  periodLabel: string;
  periods: Period[];
  chapters: Entry[];
}

const rulesFiles = import.meta.glob('/content/rules/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const loreFiles = import.meta.glob(['/content/lore/*/*.md', '/content/lore/*/*/*.md'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function parse(slug: string, raw: string): Entry {
  const meta: Record<string, string> = {};
  let body = raw;
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
    }
    body = raw.slice(m[0].length);
  }
  return {
    slug,
    title: meta.title || slug.replace(/-/g, ' '),
    order: Number(meta.order) || 999,
    summary: meta.summary || '',
    icon: meta.icon || '',
    body: body.trim(),
    meta,
  };
}

/** "01-the-fall-of-the-forsaken.md" -> "the-fall-of-the-forsaken" (also works for folder names) */
const slugOf = (name: string) => name.replace(/\.md$/, '').replace(/^\d+-/, '');
const fileSlug = (path: string) => slugOf(path.split('/').pop()!);

const byOrder = (a: Entry, b: Entry) => a.order - b.order || a.title.localeCompare(b.title);

export const RULES = Object.entries(rulesFiles).map(([p, raw]) => parse(fileSlug(p), raw)).sort(byOrder);

function loadWorlds(): World[] {
  type Draft = { info?: Entry; chapters: Entry[]; periods: Map<string, { info?: Entry; sections: Entry[] }> };
  const worlds = new Map<string, Draft>();
  for (const [path, raw] of Object.entries(loreFiles)) {
    const parts = path.split('/').slice(3); // drop "", "content", "lore"
    const folder = parts[0];
    const w: Draft = worlds.get(folder) ?? { chapters: [], periods: new Map() };
    worlds.set(folder, w);
    if (parts.length === 2) {
      if (parts[1] === '_world.md') w.info = parse(folder, raw);
      else w.chapters.push(parse(fileSlug(path), raw));
    } else {
      const p: { info?: Entry; sections: Entry[] } = w.periods.get(parts[1]) ?? { sections: [] };
      w.periods.set(parts[1], p);
      if (parts[2] === '_period.md') p.info = parse(slugOf(parts[1]), raw);
      else p.sections.push(parse(fileSlug(path), raw));
    }
  }
  return [...worlds.entries()]
    .map(([folder, { info, chapters, periods }]) => {
      const base = info ?? parse(folder, '');
      return {
        ...base,
        tagline: base.meta.tagline || '',
        primary: base.meta.primary === 'true',
        periodLabel: base.meta.periods || 'Ages',
        periods: [...periods.entries()]
          .map(([dir, p]) => {
            const pb = p.info ?? parse(slugOf(dir), '');
            return { ...pb, era: pb.meta.era || '', sections: p.sections.sort(byOrder) };
          })
          .sort(byOrder),
        chapters: chapters.sort(byOrder),
      };
    })
    .sort((a, b) => Number(b.primary) - Number(a.primary) || byOrder(a, b));
}

export const WORLDS = loadWorlds();

// ── Modules ──────────────────────────────────────────────────────────────────
// One per adventure module: either a single file content/modules/<name>.md, or a
// folder content/modules/<name>/ with a _module.md (the module's own header and
// intro) plus one file per sub-category (e.g. player character archetypes).
// Files starting with "_" (like _template.md) are otherwise ignored. A module can be tied to a world and to a
// part of it with `world:` and `subsection:` — the subsection is a time period
// ("the-age-of-sovereignty"), a section inside one ("the-age-of-myth/the-creation")
// or a general chapter ("peoples").

export interface ModuleSetting {
  world: World;
  /** The linked part of the world, if `subsection:` named one that exists. */
  part?: { label: string; era: string; href: string; periodSlug?: string };
}

export interface Module extends Entry {
  setting?: ModuleSetting;
  /** Sub-categories, for modules that are folders. */
  parts: Entry[];
  level: string;
  players: string;
  length: string;
}

const moduleFiles = import.meta.glob(['/content/modules/*.md', '/content/modules/*/*.md'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function resolveSetting(worldSlug: string, sub: string, file: string): ModuleSetting | undefined {
  if (!worldSlug) return undefined;
  const world = WORLDS.find(w => w.slug === worldSlug);
  if (!world) {
    console.warn(`[modules] ${file}: no world called "${worldSlug}"`);
    return undefined;
  }
  if (!sub) return { world };
  const base = `/lore/${world.slug}`;
  const [first, second] = sub.split('/').map(s => s.trim());
  const period = world.periods.find(p => p.slug === first);
  if (period && second) {
    const section = period.sections.find(s => s.slug === second);
    if (section) return { world, part: { label: section.title, era: [period.era, period.title].filter(Boolean).join(' · '), href: `${base}/${period.slug}/${section.slug}`, periodSlug: period.slug } };
  } else if (period) {
    return { world, part: { label: period.title, era: period.era, href: `${base}/${period.slug}`, periodSlug: period.slug } };
  } else {
    const chapter = world.chapters.find(c => c.slug === first);
    if (chapter) return { world, part: { label: chapter.title, era: '', href: `${base}/${chapter.slug}` } };
  }
  console.warn(`[modules] ${file}: "${sub}" isn't a part of ${world.title}`);
  return { world };
}

function loadModules(): Module[] {
  const drafts = new Map<string, { info?: Entry; file: string; parts: Entry[] }>();
  for (const [path, raw] of Object.entries(moduleFiles)) {
    const parts = path.split('/').slice(3); // drop "", "content", "modules"
    if (parts.length === 1) {
      if (parts[0].startsWith('_')) continue;
      const slug = fileSlug(path);
      drafts.set(slug, { info: parse(slug, raw), file: path, parts: [] });
    } else {
      const slug = slugOf(parts[0]);
      const d = drafts.get(slug) ?? { file: path, parts: [] };
      drafts.set(slug, d);
      if (parts[1] === '_module.md') { d.info = parse(slug, raw); d.file = path; }
      else if (!parts[1].startsWith('_')) d.parts.push(parse(fileSlug(path), raw));
    }
  }
  return [...drafts.entries()]
    .map(([slug, d]) => {
      const e = d.info ?? parse(slug, '');
      return {
        ...e,
        setting: resolveSetting(e.meta.world || '', e.meta.subsection || '', d.file),
        parts: d.parts.sort(byOrder),
        level: e.meta.level || '',
        players: e.meta.players || '',
        length: e.meta.length || '',
      };
    })
    .sort(byOrder);
}

export const MODULES = loadModules();

/** Modules set in a world, optionally narrowed to one time period. */
export const modulesFor = (worldSlug: string, periodSlug?: string) =>
  MODULES.filter(m => m.setting?.world.slug === worldSlug && (!periodSlug || m.setting.part?.periodSlug === periodSlug));
