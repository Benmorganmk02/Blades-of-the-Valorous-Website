import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Markdown from '../components/Markdown';
import NotFound from './NotFound';
import { WORLDS } from '../content';

export default function LoreChapter() {
  const { world: worldSlug, chapter: slug } = useParams();
  const world = WORLDS.find(w => w.slug === worldSlug);
  const chapter = world?.chapters.find(c => c.slug === slug && c.body);
  if (!world || !chapter) return <NotFound />;

  const readable = world.chapters.filter(c => c.body);
  const pos = readable.indexOf(chapter);
  const prev = readable[pos - 1];
  const next = readable[pos + 1];
  const base = `/lore/${world.slug}`;

  return (
    <>
      <PageHeader eyebrow={world.title} title={chapter.title}>
        {chapter.summary}
      </PageHeader>
      <article className="panel mx-4 max-w-3xl p-6 sm:mx-auto sm:p-10">
        <Markdown>{chapter.body}</Markdown>
      </article>
      <nav className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-between gap-4 px-4 font-display text-sm uppercase tracking-[0.15em] sm:px-0">
        {prev ? <Link to={`${base}/${prev.slug}`} className="text-royal-300 hover:text-white">← {prev.title}</Link> : <span />}
        <Link to={base} className="text-silver-400 hover:text-white">{world.title}</Link>
        {next ? <Link to={`${base}/${next.slug}`} className="text-royal-300 hover:text-white">{next.title} →</Link> : <span />}
      </nav>
    </>
  );
}
