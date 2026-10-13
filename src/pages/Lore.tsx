import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import LoreIcon from '../components/LoreIcon';
import { LORE } from '../content';

export default function Lore() {
  return (
    <>
      <PageHeader eyebrow="The Chronicle" title="Lore">
        The world, its peoples, its orders, and the ages that shaped them.
      </PageHeader>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:grid-cols-2 sm:px-6">
        {LORE.map(c => {
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
            <Link key={c.slug} to={`/lore/${c.slug}`} className="panel p-8 transition hover:border-royal-400/60 hover:shadow-glow">{inner}</Link>
          ) : (
            <article key={c.slug} className="panel p-8 opacity-80">{inner}</article>
          );
        })}
      </div>
    </>
  );
}
