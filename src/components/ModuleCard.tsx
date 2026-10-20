import { Link } from 'react-router-dom';
import { Globe2, Hourglass } from 'lucide-react';
import type { Module } from '../content';

/** "Levels 1–3 · 3–5 players · One-shot" — whichever of those the module sets. */
export function moduleFacts(m: Module) {
  return [m.level && `Levels ${m.level}`, m.players && `${m.players} players`, m.length].filter(Boolean).join(' · ');
}

/** Small pills naming the world (and part of it) a module is set in. */
export function SettingTags({ m, link = false }: { m: Module; link?: boolean }) {
  if (!m.setting) return null;
  const { world, part } = m.setting;
  const pill = 'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-display text-[0.7rem] uppercase tracking-[0.15em]';
  const worldPill = <><Globe2 size={12} /> {world.title}</>;
  const partPill = part && <><Hourglass size={12} /> {part.label}</>;
  return (
    <div className="flex flex-wrap gap-2">
      {link ? (
        <Link to={`/lore/${world.slug}`} className={`${pill} border-royal-400/40 bg-royal-700/30 text-silver-100 hover:border-royal-300`}>{worldPill}</Link>
      ) : (
        <span className={`${pill} border-royal-400/40 bg-royal-700/30 text-silver-100`}>{worldPill}</span>
      )}
      {part && (link ? (
        <Link to={part.href} title={part.era} className={`${pill} border-silver-500/30 text-silver-300 hover:border-silver-300`}>{partPill}</Link>
      ) : (
        <span title={part.era} className={`${pill} border-silver-500/30 text-silver-300`}>{partPill}</span>
      ))}
    </div>
  );
}

export default function ModuleCard({ m }: { m: Module }) {
  const facts = moduleFacts(m);
  return (
    <Link to={`/modules/${m.slug}`} className="panel group flex flex-col p-7 transition hover:border-royal-400/60 hover:shadow-glow">
      <SettingTags m={m} />
      <h3 className="mt-4 text-2xl font-semibold group-hover:text-white">{m.title}</h3>
      {m.summary && <p className="mt-2 flex-1 text-silver-300">{m.summary}</p>}
      {facts && <p className="mt-4 text-sm text-silver-400">{facts}</p>}
      <span className="mt-4 inline-block font-display text-xs uppercase tracking-[0.2em] text-royal-300">
        {m.body || m.parts.some(p => p.body || p.items.length) ? 'Open module →' : 'Details →'}
      </span>
    </Link>
  );
}

/** "Modules set here" block for world and period pages; renders nothing if there are none. */
export function ModulesHere({ modules, title }: { modules: Module[]; title: string }) {
  if (modules.length === 0) return null;
  return (
    <section className="mx-auto mt-16 max-w-5xl">
      <h2 className="mb-8 text-center text-3xl font-semibold">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {modules.map(m => <ModuleCard key={m.slug} m={m} />)}
      </div>
    </section>
  );
}
