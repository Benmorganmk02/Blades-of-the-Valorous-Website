/**
 * Link to the character-sheet / builder app. Every "Launch" button on the site
 * opens this; if it's ever emptied, they show a disabled "Coming soon" instead.
 */
export const APP_URL = 'https://bot-f-generic-app.vercel.app';

export const NAV_LINKS = [
  { to: '/rules', label: 'Rules' },
  { to: '/lore', label: 'Lore' },
  { to: '/character-sheets', label: 'Character Sheets' },
  { to: '/builder', label: 'Character Builder' },
] as const;
