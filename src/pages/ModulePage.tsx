import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Markdown from '../components/Markdown';
import EntryCard from '../components/EntryCard';
import { SettingTags, moduleFacts } from '../components/ModuleCard';
import NotFound from './NotFound';
import { MODULES, type Module, type ModulePart, type Entry } from '../content';

/** A sub-category is worth opening once it has text or anything in its list. */
const hasContent = (p: ModulePart) => !!p.body || p.items.length > 0;

/** Previous / up / next links under a page. */
function PageNav({ list, current, base, up }: { list: Entry[]; current: Entry; base: string; up: [string, string] }) {
  const i = list.indexOf(current);
  const prev = list[i - 1];
  const next = list[i + 1];
  return (
    <nav className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-between gap-4 px-4 font-display text-sm uppercase tracking-[0.15em] sm:px-0">
      {prev ? <Link to={`${base}/${prev.slug}`} className="text-royal-300 hover:text-white">← {prev.title}</Link> : <span />}
      <Link to={up[0]} className="text-silver-400 hover:text-white">{up[1]}</Link>
      {next ? <Link to={`${base}/${next.slug}`} className="text-royal-300 hover:text-white">{next.title} →</Link> : <span />}
    </nav>
  );
}

/** One sub-category of a module, e.g. its player character archetypes, with its list. */
function PartPage({ m, part }: { m: Module; part: ModulePart }) {
  const base = `/modules/${m.slug}`;
  return (
    <>
      <PageHeader eyebrow={m.title} title={part.title}>
        {part.summary}
      </PageHeader>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {part.body && (
          <article className="panel mx-auto mb-10 max-w-3xl p-6 sm:p-10">
            <Markdown>{part.body}</Markdown>
          </article>
        )}
        {part.items.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2">
            {part.items.map(it => <EntryCard key={it.slug} entry={it} to={`${base}/${part.slug}/${it.slug}`} icon={!!it.icon} />)}
          </div>
        )}
      </div>
      <PageNav list={m.parts.filter(hasContent)} current={part} base={base} up={[base, m.title]} />
    </>
  );
}

/** A single item from a sub-category's list, e.g. one archetype. */
function ItemPage({ m, part, item }: { m: Module; part: ModulePart; item: Entry }) {
  const base = `/modules/${m.slug}/${part.slug}`;
  const tags = (item.meta.tags || '').split(',').map(t => t.trim()).filter(Boolean);
  return (
    <>
      <PageHeader eyebrow={`${m.title} · ${part.title}`} title={item.title}>
        {item.summary}
      </PageHeader>
      {tags.length > 0 && (
        <div className="-mt-4 mb-8 flex flex-wrap justify-center gap-2 px-4">
          {tags.map(t => (
            <span key={t} className="rounded-full border border-silver-500/30 px-3 py-1 font-display text-[0.7rem] uppercase tracking-[0.15em] text-silver-300">{t}</span>
          ))}
        </div>
      )}
      <article className="panel mx-4 max-w-3xl p-6 sm:mx-auto sm:p-10">
        <Markdown>{item.body}</Markdown>
      </article>
      <PageNav list={part.items.filter(i => i.body)} current={item} base={base} up={[base, part.title]} />
    </>
  );
}

export default function ModulePage() {
  const { module: slug, part: partSlug, item: itemSlug } = useParams();
  const m = MODULES.find(x => x.slug === slug);
  if (!m) return <NotFound />;
  if (partSlug) {
    const part = m.parts.find(p => p.slug === partSlug && hasContent(p));
    if (!part) return <NotFound />;
    if (!itemSlug) return <PartPage m={m} part={part} />;
    const item = part.items.find(i => i.slug === itemSlug && i.body);
    return item ? <ItemPage m={m} part={part} item={item} /> : <NotFound />;
  }
  const facts = moduleFacts(m);

  return (
    <>
      <PageHeader eyebrow="Module" title={m.title}>
        {m.summary}
      </PageHeader>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {(m.setting || facts) && (
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <SettingTags m={m} link />
            {m.setting?.part?.era && <p className="text-sm text-silver-400">{m.setting.part.era}</p>}
            {facts && <p className="font-display text-sm uppercase tracking-[0.15em] text-silver-300">{facts}</p>}
          </div>
        )}

        {m.body && (
          <article className="panel mx-auto mb-10 max-w-3xl p-6 sm:p-10">
            <Markdown>{m.body}</Markdown>
          </article>
        )}

        {m.parts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2">
            {m.parts.map(p => <EntryCard key={p.slug} entry={p} to={`/modules/${m.slug}/${p.slug}`} open={hasContent(p)} />)}
          </div>
        )}

        {!m.body && m.parts.length === 0 && (
          <article className="panel mx-auto max-w-3xl p-6 sm:p-10">
            <p className="text-center font-display uppercase tracking-[0.2em] text-silver-300">The full module is coming soon</p>
          </article>
        )}

        <p className="mt-8 text-center font-display text-sm uppercase tracking-[0.15em]">
          <Link to="/modules" className="text-silver-400 hover:text-white">← All Modules</Link>
        </p>
      </div>
    </>
  );
}
