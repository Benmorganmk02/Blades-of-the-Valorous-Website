import { User, BarChart3, Swords, Shield, HeartPulse, Backpack } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import LaunchButton from '../components/LaunchButton';

const PARTS = [
  { icon: User, title: 'Identity', text: 'Name, level, race, body type, age, and the traits that set a character apart.' },
  { icon: BarChart3, title: 'Attributes & Skills', text: 'Six attributes and eighteen skills, with dice pools worked out for you.' },
  { icon: Swords, title: 'Proficiencies & Abilities', text: 'Weapon and vocation training, archetype abilities, and known spells.' },
  { icon: HeartPulse, title: 'Health & Resources', text: 'Hit points, stamina, mana, reactions and destiny points, tracked as you play.' },
  { icon: Shield, title: 'Armor & Injuries', text: 'Four armor layers on every location, and each wound recorded where it landed.' },
  { icon: Backpack, title: 'Gear & Loadouts', text: 'Weapons, bows and inventory, plus two swappable loadouts for hands, back and hips.' },
];

export default function CharacterSheets() {
  return (
    <>
      <PageHeader eyebrow="The Ledger" title="Character Sheets">
        A character sheet holds everything about your hero. Keep yours digital, and share it with your campaign.
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PARTS.map(p => (
            <div key={p.title} className="panel p-6">
              <p.icon className="text-royal-300" size={26} strokeWidth={1.5} />
              <h2 className="mt-3 text-xl font-semibold">{p.title}</h2>
              <p className="mt-1 text-silver-300">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="panel mt-12 flex flex-col items-center gap-5 p-10 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Open Your Sheets</h2>
          <p className="max-w-xl text-silver-300">Sign in to view, edit and roll from your characters.</p>
          <LaunchButton label="Open Character Sheets" />
        </div>
      </div>
    </>
  );
}
