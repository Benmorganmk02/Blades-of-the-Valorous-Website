import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import LoreIcon from '../components/LoreIcon';
import { WORLDS } from '../content';

/** World picker: the primary world is featured, the rest sit below it. */
export default function Lore() {
  const featured = WORLDS.filter(w => w.primary);
  const others = WORLDS.filter(w => !w.primary);

  return (
    <>
      <PageHeader eyebrow="The Chronicle" title="Lore">
        Choose a world to explore its history, peoples and powers.
      </PageHeader>

      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        {featured.map(w => (
          <Link
            key={w.slug}
            to={`/lore/${w.slug}`}
            className="panel group relative block overflow-hidden p-8 transition hover:border-royal-400/60 hover:shadow-glow sm:p-12"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{ background: 'radial-gradient(ellipse 60% 80% at 85% 20%, rgba(124,92,214,0.28), transparent 70%)' }}
            />
            <div className="relative">
              <p className="eyebrow">Primary setting</p>
              <h2 className="text-silver-sheen mt-3 font-deco text-4xl sm:text-6xl">{w.title}</h2>
              {w.tagline && <p className="mt-3 font-display text-lg tracking-wide text-silver-200 sm:text-xl">{w.tagline}</p>}
              {w.summary && <p className="mt-4 max-w-2xl text-silver-300">{w.summary}</p>}
              <span className="mt-6 inline-block font-display text-xs uppercase tracking-[0.2em] text-royal-300">
                Enter {w.title} →
              </span>
            </div>
          </Link>
        ))}

        {others.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map(w => (
              <Link
                key={w.slug}
                to={`/lore/${w.slug}`}
                className="panel p-7 transition hover:border-royal-400/60 hover:shadow-glow"
              >
                <LoreIcon name={w.icon} />
                <h2 className="mt-4 text-2xl font-semibold">{w.title}</h2>
                {w.tagline && <p className="mt-1 font-display text-sm tracking-wide text-silver-200">{w.tagline}</p>}
                {w.summary && <p className="mt-2 text-silver-300">{w.summary}</p>}
                <span className="mt-5 inline-block font-display text-xs uppercase tracking-[0.2em] text-royal-300">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
