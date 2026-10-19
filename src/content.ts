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
