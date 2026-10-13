/** The game's emblem: shield, sword and bow. Swap public/logo.webp to change it. */
export default function Crest({ className = '' }: { className?: string }) {
  return <img src="/logo.webp" alt="" aria-hidden width={512} height={512} className={`object-contain ${className}`} />;
}
