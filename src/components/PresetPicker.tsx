import { Link, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import type { Entry, Module, ModulePart } from '../content';

/**
 * Archetype → race → background picker for a module's player character presets.
 * Turned on by a `picker: races, backgrounds` line in the archetypes sub-category's
 * _part.md, naming the sibling sub-categories that hold the races and backgrounds.
 *
 * Who can take what is written in plain words in each file's header:
 *  - archetype `races:` and race `archetypes:` — a race shows only if both allow it
 *  - background `archetypes:` + `races:` (both must match), or `combos:`
 *    ("Ranger + Canideran, Druid + any") for exact archetype/race pairs
 * "all"/"any" (or leaving the line out) means no restriction. Names ignore case and accents.
 * The choice lives in the URL (?archetype=…&race=…&background=…) so a preset can be shared.
 */

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const isAny = (s: string) => ['', 'all', 'any', 'everyone'].includes(norm(s));
const names = (e: Entry) => [norm(e.title), norm(e.slug)];

/** Does a comma-separated header value (e.g. "Ranger, Rogue" or "all") include this entry? */
function listAllows(value: string | undefined, e: Entry) {
  if (value === undefined || isAny(value)) return true;
  return value.split(',').some(v => names(e).includes(norm(v)));
}

const one = (value: string, e: Entry) => isAny(value) || names(e).includes(norm(value));

export const raceAllowed = (arch: Entry, race: Entry) =>
  listAllows(arch.meta.races, race) && listAllows(race.meta.archetypes, arch);

export function backgroundAllowed(bg: Entry, arch: Entry, race: Entry) {
  const combos = bg.meta.combos;
  if (combos !== undefined && !isAny(combos)) {
    return combos.split(',').some(pair => {
      const [a = '', r = ''] = pair.split(/[+&/]/).map(x => x.trim());
      return one(a, arch) && one(r, race);
    });
  }
  return listAllows(bg.meta.archetypes, arch) && listAllows(bg.meta.races, race);
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section id={`preset-step-${n}`} className="mt-10 scroll-mt-24 first:mt-0">
      <h2 className="mb-5 flex items-center gap-3 text-2xl font-semibold">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-royal-400/60 bg-abyss font-display text-sm shadow-glow">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Choice({ e, selected, onPick }: { e: Entry; selected: boolean; onPick: () => void }) {
  const tags = (e.meta.tags || '').split(',').map(t => t.trim()).filter(Boolean);
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={selected}
      className={`panel relative flex flex-col p-4 text-left transition sm:p-5 ${
        selected ? 'border-royal-300 bg-royal-700/40 shadow-glow' : 'hover:border-royal-400/60'
      }`}
    >
      {selected && <Check className="absolute right-4 top-4 text-royal-300" size={18} />}
      <span className="pr-6 font-display text-base font-semibold text-silver-100 sm:text-lg">{e.title}</span>
      {tags.length > 0 && (
        <span className="mt-2 flex flex-wrap gap-1.5">
          {tags.map(t => (
            <span key={t} className="rounded-full border border-silver-500/30 px-2 py-0.5 font-display text-[0.6rem] uppercase tracking-[0.15em] text-silver-300">{t}</span>
          ))}
        </span>
      )}
      {e.summary && <span className="mt-2 text-base text-silver-300">{e.summary}</span>}
    </button>
  );
}

export default function PresetPicker({ m, part }: { m: Module; part: ModulePart }) {
  const [params, setParams] = useSearchParams();
  const [raceSlug = '', bgSlug = ''] = (part.meta.picker || '').split(',').map(s => s.trim());
  const racePart = m.parts.find(p => p.slug === raceSlug);
  const bgPart = m.parts.find(p => p.slug === bgSlug);

  const archetype = part.items.find(a => a.slug === params.get('archetype'));
  const races = archetype && racePart ? racePart.items.filter(r => raceAllowed(archetype, r)) : [];
  const race = races.find(r => r.slug === params.get('race'));
  const backgrounds = archetype && race && bgPart ? bgPart.items.filter(b => backgroundAllowed(b, archetype, race)) : [];
  const background = backgrounds.find(b => b.slug === params.get('background'));

  const pick = (key: 'archetype' | 'race' | 'background', slug: string) => {
    const next = new URLSearchParams(params);
    next.set(key, slug);
    // a new archetype/race can invalidate later choices; clear them and let the user re-pick
    if (key === 'archetype') { next.delete('race'); next.delete('background'); }
    if (key === 'race') next.delete('background');
    setParams(next, { replace: true });
    // bring the next step (or the finished hero) into view
    const target = key === 'archetype' ? 'preset-step-2' : key === 'race' ? 'preset-step-3' : 'preset-summary';
    setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  const linkTo = (p: ModulePart | undefined, e: Entry) =>
    p && e.body ? <Link to={`/modules/${m.slug}/${p.slug}/${e.slug}`} className="text-royal-300 hover:text-white">{e.title}</Link> : <span className="text-silver-100">{e.title}</span>;

  return (
    <div className="mx-auto max-w-5xl">
      <Step n={1} title="Choose an Archetype">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {part.items.map(a => <Choice key={a.slug} e={a} selected={a === archetype} onPick={() => pick('archetype', a.slug)} />)}
        </div>
      </Step>

      {archetype && racePart && (
        <Step n={2} title={`Choose a Race for the ${archetype.title}`}>
          {races.length ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {races.map(r => <Choice key={r.slug} e={r} selected={r === race} onPick={() => pick('race', r.slug)} />)}
            </div>
          ) : (
            <p className="panel p-5 text-silver-300">No races are open to this archetype yet.</p>
          )}
        </Step>
      )}

      {archetype && race && bgPart && (
        <Step n={3} title="Choose a Background">
          {backgrounds.length ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {backgrounds.map(b => <Choice key={b.slug} e={b} selected={b === background} onPick={() => pick('background', b.slug)} />)}
            </div>
          ) : (
            <p className="panel p-5 text-silver-300">No backgrounds fit a {race.title} {archetype.title} yet.</p>
          )}
        </Step>
      )}

      {archetype && race && background && (
        <section id="preset-summary" className="panel mt-12 scroll-mt-24 p-8 text-center shadow-glow">
          <p className="eyebrow">Your hero</p>
          <p className="mt-3 font-display text-2xl text-silver-100 sm:text-3xl">
            {race.title} {archetype.title}
          </p>
          <p className="mt-1 text-silver-300">with the {background.title} background</p>
          <p className="mx-auto mt-5 flex max-w-md flex-wrap justify-center gap-x-6 gap-y-1 text-base">
            {linkTo(part, archetype)}
            {linkTo(racePart, race)}
            {linkTo(bgPart, background)}
          </p>
          <p className="mt-6 text-sm text-silver-400">Want something else? Every hero can also be built fully custom.</p>
        </section>
      )}
    </div>
  );
}
