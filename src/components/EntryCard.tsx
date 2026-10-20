import { Link } from 'react-router-dom';
import LoreIcon from './LoreIcon';
import type { Entry } from '../content';

/**
 * A lore chapter/section card: links through once it has text, otherwise "Coming soon".
 * `open` overrides that (e.g. a sub-category with a list but no text of its own).
 * A `tags:` header line (comma-separated) shows as small pills.
 */
export default function EntryCard({ entry, to, icon = true, open }: { entry: Entry; to: string; icon?: boolean; open?: boolean }) {
  const linked = open ?? !!entry.body;
  const tags = (entry.meta.tags || '').split(',').map(t => t.trim()).filter(Boolean);
  const inner = (
    <>
      {icon && <LoreIcon name={entry.icon} />}
      <h3 className={`${icon ? 'mt-4' : ''} text-xl font-semibold sm:text-2xl`}>{entry.title}</h3>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map(t => (
            <span key={t} className="rounded-full border border-silver-500/30 px-2.5 py-0.5 font-display text-[0.65rem] uppercase tracking-[0.15em] text-silver-300">{t}</span>
          ))}
        </div>
      )}
      {entry.summary && <p className="mt-2 text-silver-300">{entry.summary}</p>}
      <span className="mt-4 inline-block font-display text-xs uppercase tracking-[0.2em] text-royal-300">
        {linked ? 'Read →' : 'Coming soon'}
      </span>
    </>
  );
  return linked ? (
    <Link to={to} className="panel block p-7 transition hover:border-royal-400/60 hover:shadow-glow">{inner}</Link>
  ) : (
    <article className="panel p-7 opacity-80">{inner}</article>
  );
}
