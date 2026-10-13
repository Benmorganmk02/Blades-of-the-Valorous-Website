// Loads the Markdown files in /content at build time. Each file starts with a
// small "frontmatter" header between --- lines (title, order, etc.).

export interface Entry {
  slug: string;
  title: string;
  order: number;
  summary: string;
  icon: string;
  body: string;
}

const rulesFiles = import.meta.glob('/content/rules/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const loreFiles = import.meta.glob('/content/lore/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function parse(path: string, raw: string): Entry {
  const file = path.split('/').pop()!.replace(/\.md$/, '');
  const slug = file.replace(/^\d+-/, '');
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
  };
}

function load(files: Record<string, string>): Entry[] {
  return Object.entries(files)
    .map(([p, raw]) => parse(p, raw))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export const RULES = load(rulesFiles);
export const LORE = load(loreFiles);
