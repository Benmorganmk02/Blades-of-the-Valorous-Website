import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Markdown from '../components/Markdown';
import { RULES } from '../content';

export default function Rules() {
  const { hash } = useLocation();

  // Jump to a section when arriving via a link like /rules#advancement.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <>
      <PageHeader eyebrow="The Codex" title="Rules">
        The core rules of Blades of the Valorous, for players and game masters alike.
      </PageHeader>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[230px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="panel p-4">
            <p className="eyebrow mb-3">Contents</p>
            <ol className="space-y-1">
              {RULES.map((r, i) => (
                <li key={r.slug}>
                  <a href={`#${r.slug}`} className="flex gap-2 rounded px-2 py-1 text-base text-silver-300 hover:bg-white/5 hover:text-white">
                    <span className="font-display text-royal-400">{i + 1}.</span> {r.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="min-w-0 space-y-8">
          {RULES.map(r => (
            <section key={r.slug} id={r.slug} className="panel scroll-mt-24 p-6 sm:p-8">
              <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">{r.title}</h2>
              <Markdown>{r.body}</Markdown>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
