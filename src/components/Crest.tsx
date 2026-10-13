/** The game's sigil: an upright silver blade over a violet ring. */
export default function Crest({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={className} aria-hidden>
      <defs>
        <linearGradient id="crest-blade" x1="0" x2="1">
          <stop offset="0" stopColor="#9aa0b0" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#9aa0b0" />
        </linearGradient>
        <linearGradient id="crest-guard" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c3b3ff" />
          <stop offset="1" stopColor="#5a3399" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="72" r="44" fill="none" stroke="#7c5cd6" strokeOpacity="0.55" strokeWidth="1.5" />
      <circle cx="60" cy="72" r="38" fill="none" stroke="#c3c8d4" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M60 6 L66 104 L60 114 L54 104 Z" fill="url(#crest-blade)" />
      <path d="M60 14 L60 104" stroke="#6f7486" strokeWidth="0.8" />
      <path d="M30 104 Q60 96 90 104 L86 112 Q60 106 34 112 Z" fill="url(#crest-guard)" />
      <rect x="56" y="112" width="8" height="26" rx="2" fill="#6f7486" />
      <path d="M56 118 H64 M56 124 H64 M56 130 H64" stroke="#3b1f6e" strokeWidth="1.5" />
      <circle cx="60" cy="146" r="7" fill="url(#crest-guard)" stroke="#dfe2ea" strokeOpacity="0.6" />
    </svg>
  );
}
