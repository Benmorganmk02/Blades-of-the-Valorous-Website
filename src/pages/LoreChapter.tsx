import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Markdown from '../components/Markdown';
import EntryCard from '../components/EntryCard';
import NotFound from './NotFound';
import { WORLDS, type Entry, type Period, type World } from '../content';

/** Previous / up / next links under a lore page. */
function PageNav({ prev, next, up }: { prev?: [string, string]; next?: [string, string]; up: [string, string] }) {
  return (
    <nav className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-between gap-4 px-4 font-display text-sm uppercase tracking-[0.15em] sm:px-0">
      {prev ? <Link to={prev[0]} className="text-royal-300 hover:text-white">← {prev[1]}</Link> : <span />}
      <Link to={up[0]} className="text-silver-400 hover:text-white">{up[1]}</Link>
      {next ? <Link to={next[0]} className="text-royal-300 hover:text-white">{next[1]} →</Link> : <span />}
    </nav>
  );
}

/** Neighbours among the entries that have text (empty ones aren't pages yet). */
function neighbours<T extends Entry>(list: T[], current: T) {
  const readable = list.filter(e => e.body);
  const i = readable.indexOf(current);
  return { prev: readable[i - 1], next: readable[i + 1] };
}

function PeriodPage({ world, period }: { world: World; period: Period }) {
  const base = `/lore/${world.slug}`;
  const i = world.periods.indexOf(period);
  const prev = world.periods[i - 1];
  const next = world.periods[i + 1];
  return (
    <>
      <PageHeader eyebrow={period.era || world.title} title={period.title}>
        {period.summary}
      </PageHeader>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {period.body && (
          <article className="panel mx-auto mb-10 max-w-3xl p-6 sm:p-10">
            <Markdown>{period.body}</Markdown>
          </article>
        )}
        {period.sections.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {period.sections.map(s => <EntryCard key={s.slug} entry={s} to={`${base}/${period.slug}/${s.slug}`} icon={false} />)}
          </div>
        ) : (
          <div className="panel mx-auto max-w-xl p-10 text-center">
            <p className="font-display uppercase tracking-[0.2em] text-silver-300">The chronicle of this age is yet to be written</p>
          </div>
        )}
      </div>
      <PageNav
        prev={prev && [`${base}/${prev.slug}`, prev.title]}
        next={next && [`${base}/${next.slug}`, next.title]}
        up={[base, world.title]}
      />
    </>
  );
}

function ChapterPage({ world, chapter, period }: { world: World; chapter: Entry; period?: Period }) {
  const base = period ? `/lore/${world.slug}/${period.slug}` : `/lore/${world.slug}`;
  const { prev, next } = neighbours(period ? period.sections : world.chapters, chapter);
  const eyebrow = period ? [period.era, period.title].filter(Boolean).join(' · ') : world.title;
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={chapter.title}>
        {chapter.summary}
      </PageHeader>
      <article className="panel mx-4 max-w-3xl p-6 sm:mx-auto sm:p-10">
        <Markdown>{chapter.body}</Markdown>
      </article>
      <PageNav
        prev={prev && [`${base}/${prev.slug}`, prev.title]}
        next={next && [`${base}/${next.slug}`, next.title]}
        up={[base, period ? period.title : world.title]}
      />
    </>
  );
}

/**
 * /lore/:world/:slug is either a period (e.g. an Aeontide) or a general chapter;
 * /lore/:world/:period/:section is a section within a period.
 */
export default function LoreChapter() {
  const { world: worldSlug, chapter: slug, section: sectionSlug } = useParams();
  const world = WORLDS.find(w => w.slug === worldSlug);
  if (!world) return <NotFound />;

  const period = world.periods.find(p => p.slug === slug);
  if (period && !sectionSlug) return <PeriodPage world={world} period={period} />;
  if (period && sectionSlug) {
    const section = period.sections.find(s => s.slug === sectionSlug && s.body);
    return section ? <ChapterPage world={world} chapter={section} period={period} /> : <NotFound />;
  }
  const chapter = !sectionSlug && world.chapters.find(c => c.slug === slug && c.body);
  return chapter ? <ChapterPage world={world} chapter={chapter} /> : <NotFound />;
}
