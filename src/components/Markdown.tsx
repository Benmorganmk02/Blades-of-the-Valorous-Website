import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** Renders editor-written Markdown in the site's style (tables, lists, headings). */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-rules text-silver-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => <div className="mb-4 overflow-x-auto"><table className="data-table">{children}</table></div>,
          h2: ({ children }) => <h2 className="mb-3 mt-8 text-2xl font-semibold">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-3 mt-6 text-xl font-semibold">{children}</h3>,
          a: ({ href, children }) => <a href={href} className="text-royal-300 underline-offset-4 hover:underline">{children}</a>,
          blockquote: ({ children }) => <blockquote className="mb-4 border-l-2 border-royal-400 pl-4 italic text-silver-200">{children}</blockquote>,
          em: ({ children }) => <em className="text-silver-200">{children}</em>,
          ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-6 marker:text-royal-400">{children}</ol>,
          hr: () => <div className="divider my-8"><span className="text-royal-400">✦</span></div>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
