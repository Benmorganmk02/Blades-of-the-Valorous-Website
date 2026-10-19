# Blades of the Valorous — Website

The public website for the Blades of the Valorous tabletop RPG.

---

## ✍️ Editing rules & lore (no coding needed)

All rules and lore live as plain text files in the **`content/`** folder:

```
content/
  rules/                 ← one file per section of the Rules page
  lore/
    aetherastra/         ← one folder per world
      _world.md          ← the world itself: name, tagline, intro
      01-overview.md     ← one file per chapter of that world
      02-the-medieval-age.md
    malconia/
      _world.md
```

Edit them right on GitHub: open the file, click the ✏️ pencil, make your changes, then **Commit changes**.
The live site updates by itself about a minute later.

### What a file looks like

```markdown
---
title: The Medieval Age
order: 2
icon: castle
summary: Steel, sorcery and kingdoms: the age where the story begins.
---

## The Northern Reaches

Write your text here. Leave a blank line between paragraphs.
```

The part between the `---` lines is the **header**:

| Line       | What it does                                                            |
| ---------- | ----------------------------------------------------------------------- |
| `title`    | The heading shown on the site                                           |
| `order`    | Sort position (1 comes first)                                           |
| `summary`  | *(Lore only)* the short teaser shown on the card                        |
| `icon`     | *(Lore only)* one of: globe, users, crown, hourglass, book, castle, flame, map, moon, scroll, shield, skull, sparkles, swords |
| `tagline`  | *(`_world.md` only)* a one-line motto under the world name               |
| `primary`  | *(`_world.md` only)* `true` makes it the big featured world at the top   |

A lore chapter with nothing below the header shows as **"Coming soon"**. Once it has text, it becomes a readable page.
Text written below the header of a `_world.md` appears as an introduction on that world's page.

### Adding a new rules section or lore chapter

Create a new file in `content/rules/` or in a world's folder (GitHub: **Add file → Create new file**), named like
`07-the-sunken-kingdom.md`. Copy the header from another file and change it. The filename becomes the web address,
for example `/lore/aetherastra/the-sunken-kingdom`.

### Adding or naming a world

Each world is a folder in `content/lore/` with a `_world.md` inside. To add a world, create
`content/lore/<name>/_world.md` (on GitHub, typing `<name>/_world.md` as the filename creates the folder).
The folder name becomes the web address (`/lore/<name>`).

The placeholder worlds (`world-three`, `world-four`) only need their `title` changed to be named.
To change their web address too, rename the folder (GitHub: open `_world.md`, ✏️, and edit the path above the editor).

### Formatting cheat-sheet

| You type                 | You get                     |
| ------------------------ | --------------------------- |
| `**bold**`               | **bold**                    |
| `*italic*`               | *italic*                    |
| `## Heading`             | a large sub-heading         |
| `### Smaller heading`    | a smaller sub-heading       |
| `- item`                 | a bullet list               |
| `1. item`                | a numbered list             |
| `> words`                | an indented quote           |
| `---`                    | a decorative divider        |
| `[text](https://...)`    | a link                      |

Tables use pipes. Copy one from an existing rules file and edit it.

---

## Other settings

- **Character app link:** set `APP_URL` in `src/config.ts`. Until it's set, the launch buttons say "Coming soon".
- **Home, Character Sheets and Builder page text** lives in `src/pages/*.tsx`.

## Developing locally

```bash
npm install
npm run dev      # http://localhost:5180
npm run build
```

Deploys on Vercel as a standard Vite project (`vercel.json` handles page routing).
