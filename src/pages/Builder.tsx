import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import LaunchButton from '../components/LaunchButton';

const STEPS = [
  { title: 'Concept', text: 'Choose a name, a people, and an idea of who your hero is and what drives them.' },
  { title: 'Attributes', text: 'Spend attribute points across STR, DEX, WIS, INT, CNG and CHA. Lower one below 0 to buy more elsewhere.' },
  { title: 'Skills', text: 'Spend skill points on the eighteen skills. Each one adds dice to rolls under its attribute.' },
  { title: 'Proficiencies', text: 'Train in weapons, bows or vocations. Pick the physical and mental attribute each one draws on.' },
  { title: 'Abilities & Spells', text: 'Spend ability points on archetype trees or schools of magic.' },
  { title: 'Gear', text: 'Arm and armor your hero, fill your pack, and set your loadouts.' },
];

export default function Builder() {
  return (
    <>
      <PageHeader eyebrow="The Forge" title="Character Builder">
        Every legend starts with a few points to spend. The builder tracks your costs and limits as you go.
      </PageHeader>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <ol className="relative space-y-6 border-l border-royal-400/30 pl-8 sm:pl-10">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative">
              <span className="absolute -left-[3.05rem] flex h-9 w-9 items-center justify-center rounded-full border border-royal-400/60 bg-abyss font-display text-sm font-bold text-silver-100 shadow-glow sm:-left-[3.55rem]">
                {i + 1}
              </span>
              <div className="panel p-5 sm:p-6">
                <h2 className="text-xl font-semibold">{s.title}</h2>
                <p className="mt-1 text-silver-300">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center text-silver-400">
          Point costs and formulas are in the <Link to="/rules#advancement" className="text-royal-300 underline-offset-4 hover:underline">Rules</Link>.
        </p>

        <div className="panel mt-10 flex flex-col items-center gap-5 p-10 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Begin Your Legend</h2>
          <LaunchButton label="Launch Character Builder" />
        </div>
      </div>
    </>
  );
}
