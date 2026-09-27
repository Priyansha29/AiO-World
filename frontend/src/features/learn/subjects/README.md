# Learn · Subjects (`/learn/subjects`)

The Learn index of every subject. Reading straight from the shared taxonomy
(`src/shared/taxonomy.js`) — the single source of truth for subject IDs, the
six subject groups, the skill vocabulary (with aliases) and difficulty —
it renders through the generic catalogue shell (`src/shared/catalog/`). No
second subject list exists anywhere.

## Routes

- `/learn/subjects` — the index: hero, search, subject-group filter chips, and
  a card grid grouped under the six group headers from the taxonomy.
- `/learn/subjects/:subjectId` — one subject's detail page (e.g.
  `/learn/subjects/dsa`): title, description, subject group, related skills,
  live **study notes**, and honest empty states for the remaining resource
  types (practice, books, courses, certifications, roadmaps).

## Study notes (live, from Supabase Storage)

The detail page's "Learning resources" section renders a subject's notes as
open-in-new-tab PDF links, straight from the public **`Files`** bucket
(`Subjects/<Subject Name>/`). The bucket is public, so links work with only the
project URL and no API key or server config.

- `data/notes.js` — the small manifest of what is hosted: `SUBJECT_NOTES`
  keyed by subject ID, each with a `folder` (defaults to the taxonomy label)
  and the `files` in it. **Adding a note is one line here + an upload to the
  folder** — the page picks both up automatically.
- `services/notes.js` — the only place that knows about Supabase:
  `hasNotesConfigured()`, `getNoteUrl(folder, name)`, `getSubjectNotes(subject)`
  builds public URLs from `VITE_SUPABASE_URL` (see `.env.example`).
- Without `VITE_SUPABASE_URL`, or with no note listed, the section keeps its
  honest "no study notes yet" state — no fake or broken links ever render.

## How it is organised

```
features/learn/subjects/
  domain/subjects.js     taxonomy → catalogue adapter (records, filters, order)
  data/notes.js          manifest of hosted note PDFs per subject
  services/notes.js      Supabase storage seam → public note URLs
  pages/SubjectsPage.jsx       the index page
  pages/SubjectDetailPage.jsx  the detail page (composes CatalogDetail)
  subjects.css           all styles, scoped under .sbj-page
```

The index page composes `CatalogExplorer` (search + chips + grouped grid +
empty states) and the detail page composes `CatalogDetail`. Both components are
shared foundation code; this module is pure data-derivation and page wiring.

## Cross-linking contract (readiness)

Future modules attach resources to a subject by **subject ID — the `key` in
`SUBJECT_BY_KEY`** (e.g. `dsa`, `react`, `cybersecurity`). The intended shape
is a `subjectIds` array on every catalogue record:

```
course.subjectIds            practice/problem.subjectIds
book.subjectIds              project.subjectIds
certification.subjectIds     interviewQuestion.subjectIds
roadmap.subjectIds
```

When those modules land, the subject detail page's empty sections become real
lists without changing its structure — each section already maps to a field
above (Learning resources, Practice → problems, Books, Courses,
Certifications, Related career roadmaps). Until then the sections stay honest
and empty; no fake resources are rendered.

## Adding a subject (or group)

Edit `src/shared/taxonomy.js` only: add a `{ key, label, description }` entry
to `SUBJECTS` (and its group id to `SUBJECT_GROUPS.subjects` if new). The
index page, groups, filters and detail pages pick it up automatically.

## Rules

- Subjects, groups and skills come solely from `src/shared/taxonomy.js`.
- No fake courses/books/problems/certifications — empty states only.
- The only outside service is Supabase Storage for hosted note PDFs, reached
  exclusively through the `data/notes.js` manifest + `services/notes.js`
  (env var for the URL, no raw URLs or credentials in components). No backend,
  database, auth or scraping.
- Never touch the LOCKED `/play` section or shared `Navbar.jsx`.