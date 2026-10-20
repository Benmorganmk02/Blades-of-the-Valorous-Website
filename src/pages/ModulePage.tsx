import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Markdown from '../components/Markdown';
import { SettingTags, moduleFacts } from '../components/ModuleCard';
import NotFound from './NotFound';
import { MODULES } from '../content';

export default function ModulePage() {
  const { module: slug } = useParams();
  const m = MODULES.find(x => x.slug === slug);
  if (!m) return <NotFound />;
  const facts = moduleFacts(m);

  return (
    <>
      <PageHeader eyebrow="Module" title={m.title}>
        {m.summary}
      </PageHeader>

      <div className="mx-auto max-w-3xl px-4 sm:px-0">
        {(m.setting || facts) && (
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <SettingTags m={m} link />
            {m.setting?.part?.era && <p className="text-sm text-silver-400">{m.setting.part.era}</p>}
            {facts && <p className="font-display text-sm uppercase tracking-[0.15em] text-silver-300">{facts}</p>}
          </div>
        )}
        <article className="panel p-6 sm:p-10">
          {m.body ? (
            <Markdown>{m.body}</Markdown>
          ) : (
            <p className="text-center font-display uppercase tracking-[0.2em] text-silver-300">The full module is coming soon</p>
          )}
        </article>
        <p className="mt-8 text-center font-display text-sm uppercase tracking-[0.15em]">
          <Link to="/modules" className="text-silver-400 hover:text-white">← All Modules</Link>
        </p>
      </div>
    </>
  );
}
