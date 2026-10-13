import { ExternalLink, Hourglass } from 'lucide-react';
import { APP_URL } from '../config';

/** Opens the character app, or shows a disabled "Coming soon" until APP_URL is set. */
export default function LaunchButton({ label }: { label: string }) {
  if (!APP_URL) {
    return (
      <span className="btn-ghost cursor-not-allowed flex-col !gap-1 opacity-60" aria-disabled>
        <span>{label}</span>
        <span className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.25em] text-silver-400">
          <Hourglass size={12} /> Coming soon
        </span>
      </span>
    );
  }
  return (
    <a href={APP_URL} target="_blank" rel="noreferrer" className="btn-primary">
      {label} <ExternalLink size={16} />
    </a>
  );
}
