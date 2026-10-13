import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import LoreIcon from '../components/LoreIcon';
import Markdown from '../components/Markdown';
import NotFound from './NotFound';
import { WORLDS } from '../content';

/** One world's landing page: its intro (from _world.md) and its chapters. */
export default function LoreWorld() {
  const { world: slug } = useParams();
  const world = WORLDS.find(w => w.slug === slug);
  if (!world) return <NotFound />;

  return (
    <>
      <PageHeader eyebrow={world.primary ? 'Primary setting' : 'A world of the Chronicle'} title={world.title}>
        {world.tagline || world.summary}
      </PageHeader>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {world.tagline && world.summary && (
          <p className="mx-auto -mt-4 mb-10 max-w-2xl text-center text-silver-300">{world.summary}</p>
        )}
        {world.body && (
          <article className="panel mx-auto mb-10 max-w-3xl p-6 sm:p-10">
            <Markdown>{world.body}</Markdown>
          </article>
        )}

        {world.chapters.length === 0 ? (
          <div className="panel mx-auto max-w-xl p-10 text-center">
            <LoreIcon name="hourglass" />
            <p className="mt-4 font-display uppercase tracking-[0.2em] text-silver-300">This chronicle is yet to be written</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {world.chapters.map(c => {
              const inner = (
                <>
                  <LoreIcon name={c.icon} />
                  <h2 className="mt-4 text-2xl font-semibold">{c.title}</h2>
                  {c.summary && <p className="mt-2 text-silver-300">{c.summary}</p>}
                  <span className="mt-5 inline-block font-display text-xs uppercase tracking-[0.2em] text-royal-300">
                    {c.body ? 'Read →' : 'Coming soon'}
                  </span>
                </>
              );
              return c.body ? (
                <Link key={c.slug} to={`/lore/${world.slug}/${c.slug}`} className="panel p-8 transition hover:border-royal-400/60 hover:shadow-glow">{inner}</Link>
              ) : (
                <article key={c.slug} className="panel p-8 opacity-80">{inner}</article>
              );
            })}
          </div>
        )}

        <p className="mt-10 text-center font-display text-sm uppercase tracking-[0.15em]">
          <Link to="/lore" className="text-silver-400 hover:text-white">← All Worlds</Link>
        </p>
      </div>
    </>
  );
}
