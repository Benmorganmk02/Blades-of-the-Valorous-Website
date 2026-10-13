// Loads the Markdown files in /content at build time. Each file starts with a
// small "frontmatter" header between --- lines (title, order, etc.).
//
// Lore is grouped by world: content/lore/<world>/_world.md describes the world
// itself, and every other .md file in that folder is one of its chapters.

export interface Entry {
  slug: string;
  title: string;
  order: number;
  summary: string;
  icon: string;
  body: string;
  meta: Record<string, string>;
}

export interface World extends Entry {
  tagline: string;
  primary: boolean;
  chapters: Entry[];
}

const rulesFiles = import.meta.glob('/content/rules/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const loreFiles = import.meta.glob('/content/lore/*/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

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

/** "01-the-medieval-age.md" -> "the-medieval-age" */
const fileSlug = (path: string) => path.split('/').pop()!.replace(/\.md$/, '').replace(/^\d+-/, '');

const byOrder = (a: Entry, b: Entry) => a.order - b.order || a.title.localeCompare(b.title);

export const RULES = Object.entries(rulesFiles).map(([p, raw]) => parse(fileSlug(p), raw)).sort(byOrder);

function loadWorlds(): World[] {
  const worlds = new Map<string, { info?: Entry; chapters: Entry[] }>();
  for (const [path, raw] of Object.entries(loreFiles)) {
    const [, , , folder, file] = path.split('/'); // "", "content", "lore", <world>, <file>
    const w = worlds.get(folder) ?? { chapters: [] };
    if (file === '_world.md') w.info = parse(folder, raw);
    else w.chapters.push(parse(fileSlug(path), raw));
    worlds.set(folder, w);
  }
  return [...worlds.entries()]
    .map(([folder, { info, chapters }]) => {
      const base = info ?? parse(folder, '');
      return {
        ...base,
        tagline: base.meta.tagline || '',
        primary: base.meta.primary === 'true',
        chapters: chapters.sort(byOrder),
      };
    })
    .sort((a, b) => Number(b.primary) - Number(a.primary) || byOrder(a, b));
}

export const WORLDS = loadWorlds();
