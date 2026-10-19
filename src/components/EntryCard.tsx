import { Link } from 'react-router-dom';
import LoreIcon from './LoreIcon';
import type { Entry } from '../content';

/** A lore chapter/section card: links through once it has text, otherwise "Coming soon". */
export default function EntryCard({ entry, to, icon = true }: { entry: Entry; to: string; icon?: boolean }) {
  const inner = (
    <>
      {icon && <LoreIcon name={entry.icon} />}
      <h3 className={`${icon ? 'mt-4' : ''} text-xl font-semibold sm:text-2xl`}>{entry.title}</h3>
      {entry.summary && <p className="mt-2 text-silver-300">{entry.summary}</p>}
      <span className="mt-4 inline-block font-display text-xs uppercase tracking-[0.2em] text-royal-300">
        {entry.body ? 'Read →' : 'Coming soon'}
      </span>
    </>
  );
  return entry.body ? (
    <Link to={to} className="panel block p-7 transition hover:border-royal-400/60 hover:shadow-glow">{inner}</Link>
  ) : (
    <article className="panel p-7 opacity-80">{inner}</article>
  );
}
