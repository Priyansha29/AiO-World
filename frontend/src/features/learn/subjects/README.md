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
  and honest empty states for every resource type that will attach later.

## How it is organised

```
features/learn/subjects/
  domain/subjects.js     taxonomy → catalogue adapter (records, filters, order)
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
- No backend, database, auth or scraping.
- Never touch the LOCKED `/play` section or shared `Navbar.jsx`.