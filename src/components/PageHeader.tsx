import type { ReactNode } from 'react';

export default function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="text-silver-sheen mt-3 text-4xl font-bold sm:text-5xl">{title}</h1>
      <div className="divider mx-auto mt-6 max-w-xs">
        <span className="text-royal-400">✦</span>
      </div>
      {children && <div className="mx-auto mt-6 max-w-2xl text-lg text-silver-300 sm:text-xl">{children}</div>}
    </section>
  );
}
