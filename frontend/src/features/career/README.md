# Career Roadmaps (`/career`)

A searchable library of student-oriented career roadmaps. Every roadmap takes
a student from **Learn → Practice → Build → Career** as lightweight stages
with individual checkable nodes. Node progress is saved to `localStorage`, so
nothing on this page needs a backend.

## Routes

- `/career` — the landing page: hero, goal cards, search + filters, the grid,
  coming-soon cards, and the Help-Me-Choose quiz.
- `/career/roadmaps/:id` — one roadmap, rendered lane-by-lane with
  clickable progress nodes (e.g. `/career/roadmaps/full-stack`).

## How it is organised

```
features/career/
  domain/roadmap-types.js      types + shared constants (PHASES, PROGRESS_STATES)
  data/roadmaps.js             the 15 live roadmap definitions
  data/catalog.js              categories, filters, goals, coming-soon, helpers
  services/progress-store.js   localStorage progress per roadmap/stage/node
  services/chooser.js          deterministic "help me choose" scoring
  components/                  card, renderer, progress bar, search, goals, quiz
  pages/                       CareerPage + RoadmapDetailPage
  career.css                   all styles, scoped under .career-page
```

## Adding roadmap 16 (and 17…100)

1. **Write the definition** in `data/roadmaps.js`:
   - `id` — lowercase kebab, also the URL segment.
   - `category` — one of the keys in `CATEGORIES` (software, ai, cloud,
     cybersecurity, engineering, design).
   - `tags` — at least `career-path`, plus category + optional
     `technology`/`ai`/`cybersecurity`/`cloud`/`engineering`/`design` so the
     filter chips pick it up.
   - `stages` — 4–8 stages. Each stage has a `phase` from
     `['learn','practice','build','career']` and a list of `nodes`
     (`{ id, title, type }`, type from `['skill','concept','tool','practice','project']`).
     Keep ~3–5 nodes per stage.
2. **Nothing else changes.** The landing grid, search, filters, category
   groups, Help-Me-Choose scoring and detail page all read `ROADMAPS`
   automatically.

If a desired path is not ready yet, add it to `COMING_SOON` in
`catalog.js` instead so students can see it planned.

## Progress

- Node states cycle **not-started → in-progress → completed → not-started**
  on click.
- Stored under `aioworld.career.progress` in `localStorage`, keyed
  `roadmapId → stageId → nodeId`. See `services/progress-store.js`; designed
  so a future authenticated backend is a one-file swap.
- Progress is per-browser: it follows the student, not the college.

## Rules

- No backend, database, auth, or scraping — `localStorage` only.
- All roadmap content is original to AiO World (no roadmap.sh text).
- Never touch the LOCKED `/play` section or shared `Navbar.jsx`.