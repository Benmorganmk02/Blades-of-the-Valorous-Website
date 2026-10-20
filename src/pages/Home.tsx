import { Link } from 'react-router-dom';
import { BookOpen, Feather, ScrollText, Hammer, Dices, Shield, Sparkles, Compass } from 'lucide-react';
import Crest from '../components/Crest';
import ElementalAura from '../components/ElementalAura';

const SECTIONS = [
  { to: '/rules', icon: BookOpen, title: 'Rules', text: 'Dice pools, attributes, armor and the injury ladder. The full reference for players and game masters.' },
  { to: '/lore', icon: Feather, title: 'Lore', text: 'Explore the worlds of the game, starting with Aetherastra, whose story runs from the age of blades to the age of stars.' },
  { to: '/modules', icon: Compass, title: 'Modules', text: 'Ready-to-run adventures, each set in a world and an age of its history.' },
  { to: '/character-sheets', icon: ScrollText, title: 'Character Sheets', text: 'Download the printable sheet: stats and skills, armor and wounds, gear and loadouts, all on one page.' },
  { to: '/builder', icon: Hammer, title: 'Character Builder', text: 'Forge a new character step by step, from first point spent to first blade drawn.' },
];

const PILLARS = [
  { icon: Dices, title: 'Pools of d6', text: 'Build a fistful of six-siders from attribute, skill and training. Every die at 4+ is a success. Advantage and disadvantage move that target.' },
  { icon: Shield, title: 'Steel that matters', text: 'Four layers of armor across eight locations. Blows wear it down, and hard plate holds until a heavy strike breaks through.' },
  { icon: Sparkles, title: 'Sorcery & mastery', text: 'Ability trees for warriors and rangers. Five schools of magic whose spells you shape with extra mana.' },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col items-center justify-center overflow-x-clip px-4 pb-20 pt-32 text-center sm:pt-40 sm:px-6">
        <div className="relative h-56 w-56 sm:h-72 sm:w-72">
          <ElementalAura className="pointer-events-none absolute -inset-16 h-[calc(100%+8rem)] w-[calc(100%+8rem)] sm:-inset-28 sm:h-[calc(100%+14rem)] sm:w-[calc(100%+14rem)]" />
          <div className="emblem-float relative h-full w-full">
            <Crest className="emblem-glow h-full w-full" />
            <div aria-hidden className="emblem-gleam absolute inset-0" />
          </div>
        </div>
        <p className="eyebrow mt-20 sm:mt-28">A tabletop roleplaying game</p>
        <h1 className="text-silver-sheen mt-4 font-deco text-5xl leading-tight sm:text-7xl">
          Blades of the<br />Valorous
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-silver-300 sm:text-2xl">
          Steel, sorcery, and the oaths that bind them. Take up your blade beneath a sky of cold stars.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/builder" className="btn-primary">Forge a Hero</Link>
          <Link to="/rules" className="btn-ghost">Read the Rules</Link>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="divider mb-12">
          <span className="font-display text-sm uppercase tracking-[0.3em] text-silver-400">The Way of the Blade</span>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map(p => (
            <div key={p.title} className="panel p-7">
              <p.icon className="text-royal-300" size={28} strokeWidth={1.5} />
              <h3 className="mt-4 text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-silver-300">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sections */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="eyebrow">Explore</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Enter the Hall</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {SECTIONS.map((s, i) => (
            <Link
              key={s.to}
              to={s.to}
              className={`${i === SECTIONS.length - 1 && SECTIONS.length % 2 ? 'sm:col-span-2 ' : ''}panel group flex gap-5 p-7 transition hover:border-royal-400/60 hover:shadow-glow`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-royal-400/40 bg-royal-700/40">
                <s.icon className="text-silver-100" size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-semibold group-hover:text-white">{s.title}</h3>
                <p className="mt-1 text-silver-300">{s.text}</p>
                <span className="mt-3 inline-block font-display text-xs uppercase tracking-[0.2em] text-royal-300 group-hover:text-royal-300">
                  Enter →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
