import { useSearchParams } from 'react-router-dom';
import { Compass } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ModuleCard from '../components/ModuleCard';
import { MODULES, WORLDS } from '../content';

/** All adventure modules, filterable by the world they're set in (?world=<slug>). */
export default function Modules() {
  const [params, setParams] = useSearchParams();
  const active = params.get('world') ?? '';
  const worlds = WORLDS.filter(w => MODULES.some(m => m.setting?.world.slug === w.slug));
  const unset = MODULES.some(m => !m.setting);
  const shown = MODULES.filter(m =>
    !active ? true : active === 'none' ? !m.setting : m.setting?.world.slug === active,
  );

  const chip = (value: string, label: string) => (
    <button
      key={value || 'all'}
      onClick={() => setParams(value ? { world: value } : {}, { replace: true })}
      className={`rounded-full border px-4 py-1.5 font-display text-xs uppercase tracking-[0.15em] transition ${
        active === value ? 'border-royal-300 bg-royal-600/50 text-white' : 'border-silver-500/30 text-silver-300 hover:border-silver-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <PageHeader eyebrow="The Adventures" title="Modules">
        Ready-to-run adventures, each set in a world and an age of its history.
      </PageHeader>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {MODULES.length === 0 ? (
          <div className="panel mx-auto max-w-xl p-10 text-center">
            <Compass className="mx-auto text-royal-300" size={30} strokeWidth={1.4} />
            <p className="mt-4 font-display uppercase tracking-[0.2em] text-silver-300">The first adventures are being written</p>
          </div>
        ) : (
          <>
            {(worlds.length > 1 || unset) && (
              <div className="mb-8 flex flex-wrap justify-center gap-2">
                {chip('', 'All')}
                {worlds.map(w => chip(w.slug, w.title))}
                {unset && chip('none', 'Any world')}
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2">
              {shown.map(m => <ModuleCard key={m.slug} m={m} />)}
            </div>
          </>
        )}
      </div>
    </>
  );
}
