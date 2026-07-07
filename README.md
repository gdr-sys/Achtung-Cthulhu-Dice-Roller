# Dice Roller - Achtung! Cthulhu 2d20
A mobile-first dice rolling web app for the **Achtung! Cthulhu 2d20** tabletop RPG system. Built with React, TypeScript, Vite, Tailwind CSS, and the `vite-plugin-singlefile` plugin so the entire app compiles into a **single self-contained HTML file** — perfect for hosting on GitHub Pages or any static file host.
## Features
- **Skill Tests** — Attribute + Skill + modifiers, with critical success (≤ Skill with Focus), complications (rolling high), and automatic momentum generation.
- **Combat Damage** — Challenge Die resolution with stress totals, soak/cover reduction, and special effect triggers.
- **Teamwork / Assist** — Roll an ally's dice; bonus successes become extra dice for your test (capped at 3 total).
- **Fortune Points** — Toggle automatic success on one die.
- **Opposed Tests** — One-click difficulty lock to 1.
- **Resource Trackers** — Momentum, Threat, and Fortune pools (persisted in `localStorage`).
- **Roll History** — The last 20 rolls are saved and viewable inline.
- **5 Languages** (IT, EN, FR, DE, ES) with official 2d20 terminology.
- **Light / Dark themes** (persisted in `localStorage`).
- **Quick Reference** — Collapsible rules summary in each language.
- **No backend / no build step needed at runtime** — everything is inlined into `dist/index.html`.
## Tech Stack
| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| vite-plugin-singlefile | Bundles everything into one HTML file |
## Project Structure
```
index.html              # Entry HTML (dev)
src/
├── main.tsx            # React root
├── App.tsx             # App shell + tab routing + roll history
├── index.css          # Tailwind + custom theme variables
├── context/
│   └── AppContext.tsx  # Theme, language, resources state
├── i18n/
│   └── translations.ts # All UI strings (5 languages)
├── utils/
│   └── diceRoller.ts   # Core 2d20 & combat die logic
└── components/
    ├── Header.tsx          # Language + theme controls
    ├── TitleBanner.tsx
    ├── TabBar.tsx
    ├── SkillTestPanel.tsx
    ├── DamagePanel.tsx
    ├── ResourceTrackers.tsx
    ├── QuickReference.tsx
    ├── RollHistory.tsx
    ├── Footer.tsx
    ├── dice/
    │   ├── D20Die.tsx
    │   └── CombatDie.tsx
    └── ui/
        ├── Card.tsx
        ├── NumberInput.tsx
        ├── OptionTile.tsx
        └── Button.tsx
```
## Getting Started (Development)
```bash
# Install dependencies
npm install
# Start the dev server
npm run dev
# Build the production single-file bundle
npm run build
```
The production build produces:
```
dist/index.html   (single self-contained file, ~268 KB / ~80 KB gzipped)
```
## Deploying to GitHub Pages
Because the app is bundled into a **single HTML file with no external dependencies**, deployment is trivial:
1. Run `npm run build`.
2. Take the generated `dist/index.html`.
3. Upload / commit it to your GitHub Pages repository (rename it to `index.html` if needed).
4. That's it — no `assets/` folder, no base-path configuration required.
The app works from any subdirectory or custom domain because all JS/CSS is inlined and there are no relative asset requests.
## Game Rules Implemented
### Skill Test (2d20)
- **Target Number (TN)** = Attribute + Skill + modifiers.
- Roll 2d20 (plus extra/assist dice). A die succeeds if it rolls **≤ TN**.
- **Critical** = roll ≤ 1 (or ≤ Skill if the character has **Focus**) grants **2 successes**.
- **Complication** = roll ≥ 20 (adjusted by injuries, −1 per injury) generates a GM Complication.
- **Momentum** = successes beyond the required difficulty (shared player resource).
### Combat (Challenge Dice)
- Each Combat Die face: `1` = 1 stress, `2` = 2 stress, `3–4` = blank, `5–6` = 1 stress + **special effect**.
- **Net Stress** = total stress − soak/cover.
- Special effects can be triggered by the GM for narrative consequences.
## Credits
Design and concept by **Noemi Marcolini**.
If you found this tool useful, you can [buy her a coffee on Ko-fi](https://ko-fi.com/noemimarcolini).
## License
This project is provided as-is for personal tabletop gaming use.
