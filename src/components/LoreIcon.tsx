import { BookOpen, Castle, Crown, Flame, Globe2, Hourglass, Map, Moon, Scroll, Shield, Skull, Sparkles, Swords, Users, type LucideIcon } from 'lucide-react';

// Names usable in a lore file's "icon:" line.
const ICONS: Record<string, LucideIcon> = {
  globe: Globe2, users: Users, crown: Crown, hourglass: Hourglass, book: BookOpen, castle: Castle,
  flame: Flame, map: Map, moon: Moon, scroll: Scroll, shield: Shield, skull: Skull, sparkles: Sparkles, swords: Swords,
};

export default function LoreIcon({ name, size = 30 }: { name: string; size?: number }) {
  const Icon = ICONS[name.toLowerCase()] ?? Scroll;
  return <Icon className="text-royal-300" size={size} strokeWidth={1.4} />;
}
