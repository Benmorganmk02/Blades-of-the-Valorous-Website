import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Markdown from '../components/Markdown';
import NotFound from './NotFound';
import { LORE } from '../content';

export default function LoreChapter() {
  const { slug } = useParams();
  const i = LORE.findIndex(c => c.slug === slug && c.body);
  if (i < 0) return <NotFound />;
  const chapter = LORE[i];
  const readable = LORE.filter(c => c.body);
  const pos = readable.indexOf(chapter);
  const prev = readable[pos - 1];
  const next = readable[pos + 1];

  return (
    <>
      <PageHeader eyebrow="The Chronicle" title={chapter.title}>
        {chapter.summary}
      </PageHeader>
      <article className="panel mx-4 max-w-3xl p-6 sm:mx-auto sm:p-10">
        <Markdown>{chapter.body}</Markdown>
      </article>
      <nav className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-between gap-4 px-4 font-display text-sm uppercase tracking-[0.15em] sm:px-0">
        {prev ? <Link to={`/lore/${prev.slug}`} className="text-royal-300 hover:text-white">← {prev.title}</Link> : <span />}
        <Link to="/lore" className="text-silver-400 hover:text-white">All Lore</Link>
        {next ? <Link to={`/lore/${next.slug}`} className="text-royal-300 hover:text-white">{next.title} →</Link> : <span />}
      </nav>
    </>
  );
}
