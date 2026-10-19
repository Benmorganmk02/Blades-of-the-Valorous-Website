import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import LoreIcon from '../components/LoreIcon';
import EntryCard from '../components/EntryCard';
import Markdown from '../components/Markdown';
import NotFound from './NotFound';
import { WORLDS } from '../content';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** One world's landing page: its intro, its timeline of periods, and its general chapters. */
export default function LoreWorld() {
  const { world: slug } = useParams();
  const world = WORLDS.find(w => w.slug === slug);
  if (!world) return <NotFound />;
  const base = `/lore/${world.slug}`;

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

        {world.periods.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-8 text-center text-3xl font-semibold">The {world.periodLabel}</h2>
            <ol className="relative mx-auto max-w-3xl space-y-6 border-l border-royal-400/30 pl-10 sm:pl-14">
              {world.periods.map((p, i) => (
                <li key={p.slug} className="relative">
                  <span className="absolute -left-[3.6rem] top-6 flex h-11 w-11 items-center justify-center rounded-full border border-royal-400/60 bg-abyss font-display text-sm font-bold text-silver-100 shadow-glow sm:-left-[4.6rem] sm:h-12 sm:w-12">
                    {ROMAN[i] ?? i + 1}
                  </span>
                  <Link to={`${base}/${p.slug}`} className="panel group block p-6 transition hover:border-royal-400/60 hover:shadow-glow sm:p-7">
                    {p.era && <p className="eyebrow">{p.era}</p>}
                    <div className="mt-2 flex items-center gap-3">
                      <LoreIcon name={p.icon} size={24} />
                      <h3 className="text-2xl font-semibold group-hover:text-white">{p.title}</h3>
                    </div>
                    {p.summary && <p className="mt-3 text-silver-300">{p.summary}</p>}
                    <span className="mt-4 inline-block font-display text-xs uppercase tracking-[0.2em] text-royal-300">
                      {p.sections.length > 0 ? `${p.sections.length} section${p.sections.length === 1 ? '' : 's'} →` : 'Explore →'}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        {world.chapters.length > 0 && (
          <section>
            {world.periods.length > 0 && <h2 className="mb-8 text-center text-3xl font-semibold">Compendium</h2>}
            <div className="grid gap-6 sm:grid-cols-2">
              {world.chapters.map(c => <EntryCard key={c.slug} entry={c} to={`${base}/${c.slug}`} />)}
            </div>
          </section>
        )}

        {world.periods.length === 0 && world.chapters.length === 0 && (
          <div className="panel mx-auto max-w-xl p-10 text-center">
            <LoreIcon name="hourglass" />
            <p className="mt-4 font-display uppercase tracking-[0.2em] text-silver-300">This chronicle is yet to be written</p>
          </div>
        )}

        <p className="mt-10 text-center font-display text-sm uppercase tracking-[0.15em]">
          <Link to="/lore" className="text-silver-400 hover:text-white">← All Worlds</Link>
        </p>
      </div>
    </>
  );
}
