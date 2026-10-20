import { Link } from 'react-router-dom';
import { User, BarChart3, Swords, Shield, HeartPulse, Backpack, Download, Eye, Printer } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import sheetPreview from '../assets/character-sheet-preview.webp';

/** The printable sheet. To update it, replace public/downloads/blades-of-the-valorous-character-sheet.pdf (same name). */
const SHEET_PDF = '/downloads/blades-of-the-valorous-character-sheet.pdf';

const PARTS = [
  { icon: User, title: 'Identity', text: 'Name, level, race, body type, age, and the traits that set a character apart.' },
  { icon: BarChart3, title: 'Attributes & Skills', text: 'Six attributes and eighteen skills, each with its own roll box and advantage tracker.' },
  { icon: Swords, title: 'Proficiencies & Abilities', text: 'Weapon and vocation training, abilities, and the points spent on each.' },
  { icon: HeartPulse, title: 'Health & Resources', text: 'Hit points, stamina, mana, reactions and destiny points.' },
  { icon: Shield, title: 'Armor & Injuries', text: 'Four armor layers on every location, plus internal and external injuries.' },
  { icon: Backpack, title: 'Gear & Loadouts', text: 'Equipment and notes, plus two loadouts for hands, back and hips.' },
];

export default function CharacterSheets() {
  return (
    <>
      <PageHeader eyebrow="The Ledger" title="Character Sheets">
        The official printable character sheet. Everything about your hero on a single page.
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="panel grid items-center gap-8 p-6 sm:p-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <a href={SHEET_PDF} target="_blank" rel="noreferrer" className="group block">
            <img
              src={sheetPreview}
              alt="Preview of the Blades of the Valorous character sheet"
              width={900}
              height={1274}
              loading="lazy"
              className="w-full rounded-md bg-white shadow-glow transition group-hover:scale-[1.02]"
            />
          </a>
          <div className="text-center md:text-left">
            <p className="eyebrow">Free download · PDF</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">The Character Sheet</h2>
            <p className="mt-4 text-silver-300">
              A one-page sheet for pen-and-paper play. Print it, fill it in at the table, and keep it with your dice.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
              <a href={SHEET_PDF} download className="btn-primary">
                <Download size={16} /> Download PDF
              </a>
              <a href={SHEET_PDF} target="_blank" rel="noreferrer" className="btn-ghost">
                <Eye size={16} /> View
              </a>
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 text-sm text-silver-400 md:justify-start">
              <Printer size={14} /> Prints on A4 or Letter. Choose "Fit to page" when printing.
            </p>
            <p className="mt-2 text-sm text-silver-400">
              Rather build your hero online? Try the{' '}
              <Link to="/builder" className="text-royal-300 underline-offset-4 hover:underline">Character Builder</Link>.
            </p>
          </div>
        </section>

        <h2 className="mb-6 mt-16 text-center text-3xl font-semibold">What's on the Sheet</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PARTS.map(p => (
            <div key={p.title} className="panel p-6">
              <p.icon className="text-royal-300" size={26} strokeWidth={1.5} />
              <h3 className="mt-3 text-xl font-semibold">{p.title}</h3>
              <p className="mt-1 text-silver-300">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
