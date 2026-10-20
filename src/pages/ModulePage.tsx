import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Markdown from '../components/Markdown';
import EntryCard from '../components/EntryCard';
import { SettingTags, moduleFacts } from '../components/ModuleCard';
import NotFound from './NotFound';
import { MODULES, type Module, type Entry } from '../content';

/** One sub-category of a module, e.g. its player character archetypes. */
function PartPage({ m, part }: { m: Module; part: Entry }) {
  const readable = m.parts.filter(p => p.body);
  const i = readable.indexOf(part);
  const prev = readable[i - 1];
  const next = readable[i + 1];
  const base = `/modules/${m.slug}`;
  return (
    <>
      <PageHeader eyebrow={m.title} title={part.title}>
        {part.summary}
      </PageHeader>
      <article className="panel mx-4 max-w-3xl p-6 sm:mx-auto sm:p-10">
        <Markdown>{part.body}</Markdown>
      </article>
      <nav className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-between gap-4 px-4 font-display text-sm uppercase tracking-[0.15em] sm:px-0">
        {prev ? <Link to={`${base}/${prev.slug}`} className="text-royal-300 hover:text-white">← {prev.title}</Link> : <span />}
        <Link to={base} className="text-silver-400 hover:text-white">{m.title}</Link>
        {next ? <Link to={`${base}/${next.slug}`} className="text-royal-300 hover:text-white">{next.title} →</Link> : <span />}
      </nav>
    </>
  );
}

export default function ModulePage() {
  const { module: slug, part: partSlug } = useParams();
  const m = MODULES.find(x => x.slug === slug);
  if (!m) return <NotFound />;
  if (partSlug) {
    const part = m.parts.find(p => p.slug === partSlug && p.body);
    return part ? <PartPage m={m} part={part} /> : <NotFound />;
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
            {m.parts.map(p => <EntryCard key={p.slug} entry={p} to={`/modules/${m.slug}/${p.slug}`} />)}
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
