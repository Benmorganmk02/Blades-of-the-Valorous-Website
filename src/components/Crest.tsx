import logoUrl from '../assets/logo.webp';

/** The game's emblem: shield, sword and bow. Swap src/assets/logo.webp to change it (the build fingerprints it, so browsers never show a stale copy). */
export default function Crest({ className = '' }: { className?: string }) {
  return <img src={logoUrl} alt="" aria-hidden width={512} height={512} className={`object-contain ${className}`} />;
}
