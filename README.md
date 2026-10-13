# Blades of the Valorous — Website

The public website for the Blades of the Valorous tabletop RPG.

---

## ✍️ Editing rules & lore (no coding needed)

All rules and lore live as plain text files in the **`content/`** folder:

```
content/
  rules/   ← one file per section of the Rules page
  lore/    ← one file per Lore chapter
```

Edit them right on GitHub: open the file, click the ✏️ pencil, make your changes, then **Commit changes**.
The live site updates by itself about a minute later.

### What a file looks like

```markdown
---
title: The World
order: 1
icon: globe
summary: The lands, seas and skies where your tales unfold.
---

## The Northern Reaches

Write your text here. Leave a blank line between paragraphs.
```

The part between the `---` lines is the **header**:

| Line       | What it does                                                            |
| ---------- | ----------------------------------------------------------------------- |
| `title`    | The heading shown on the site                                           |
| `order`    | Sort position (1 comes first)                                           |
| `summary`  | *(Lore only)* the one-line teaser on the Lore page                      |
| `icon`     | *(Lore only)* one of: globe, users, crown, hourglass, book, castle, flame, map, moon, scroll, shield, skull, sparkles, swords |

A lore chapter with nothing below the header shows as **"Coming soon"**. Once it has text, it becomes a readable page.

### Adding a new section or chapter

Create a new file in `content/rules/` or `content/lore/` (GitHub: **Add file → Create new file**), named like
`05-the-sunken-kingdom.md`. Copy the header from another file and change it. The filename becomes the web address,
for example `/lore/the-sunken-kingdom`.

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
