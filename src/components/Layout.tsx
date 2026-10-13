import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Starfield from './Starfield';
import Crest from './Crest';
import { APP_URL, NAV_LINKS } from '../config';

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <Starfield />

      <header className="sticky top-0 z-30 border-b border-silver-500/15 bg-void/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <Crest className="h-9 w-7" />
            <span className="font-display text-base font-semibold uppercase tracking-[0.18em] text-silver-100 sm:text-lg">
              Blades <span className="text-royal-300">of the</span> Valorous
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 font-display text-xs font-semibold uppercase tracking-[0.16em] transition ${
                    isActive ? 'text-white bg-royal-600/40' : 'text-silver-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="rounded-md p-2 text-silver-200 hover:bg-white/5 md:hidden"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-silver-500/15 px-4 pb-4 pt-2 md:hidden">
            {NAV_LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-3 font-display text-sm uppercase tracking-[0.16em] ${
                    isActive ? 'text-white bg-royal-600/40' : 'text-silver-300'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-24 border-t border-silver-500/15 bg-void/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6">
          <Crest className="h-12 w-9 opacity-80" />
          <p className="font-display text-sm uppercase tracking-[0.25em] text-silver-300">Blades of the Valorous</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-base text-silver-400">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} className="hover:text-silver-100">{l.label}</Link>
            ))}
            {APP_URL && <a href={APP_URL} target="_blank" rel="noreferrer" className="hover:text-silver-100">Launch App</a>}
          </div>
          <p className="text-sm text-silver-500">© {new Date().getFullYear()} Blades of the Valorous. A tabletop roleplaying game.</p>
        </div>
      </footer>
    </div>
  );
}
