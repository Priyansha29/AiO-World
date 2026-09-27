# AiO Library (`/learn/library`)

A real, data-driven digital library inside the Learn section: browse, search,
filter, read inside AiO (text demos + hosted files), open external books at
their legitimate source, track reading progress, bookmark, and curate a "My
Library". Everything runs client-side today — no backend, no accounts.

## Routes

- `/learn/library` — landing: hero, search, subject/source filters, sort, and
  home sections (Continue Reading, Featured, Popular Subjects, Recently Added,
  External Resources, Browse the Shelf).
- `/learn/library/book/:id` — the reader (one route, reused for every book).
- `/learn/library/my-library` — Currently Reading / Saved / Recently Opened /
  Completed.

## How it is organised

```
features/learn/library/
  domain/library-types.js      types + constants (categories, sources, sorts)
  data/books.js                the catalogue (one entry per book)
  data/demo-books.js           original AiO-authored demo chapters
  services/storage.js          Supabase storage seam (bucket -> public URL)
  services/reading-progress.js localStorage progress per book
  services/bookmarks.js        localStorage bookmark list
  services/library.js          search / filter / sort / shelf selectors
  components/                  cover, card, grid, shelf, search, filters, reader
  pages/                       LibraryPage, BookReaderPage, MyLibraryPage
  library.css                  all styles, scoped under .lib-page / .lib-reader
```

Routes are wired through the existing hash router (`'/learn'` added to
`ROUTES`; three branches in `App.jsx`). No shared component and no `/play`
code is touched.

## Adding a new book (the whole point)

Adding book #21..hundreds is **added data, never a new page**:

1. Add one record to `data/books.js`:
   - **External** book → `sourceType: "external"` + `externalUrl`
     (its legitimate official source). See any external row.
   - **Hosted, authorized file** → `sourceType: "hosted"`, `fileType: "pdf"`,
     `storagePath: "library/books/<subject>/<file>.pdf"`, then upload the file
     to the `library` bucket at that path.
   - **Hosted demo text** → `fileType: "text"` + `demoContentRef` pointing at
     new original chapters in `data/demo-books.js`.
2. The landing sections, filters, search, sort, reader and My Library all read
   `BOOKS` automatically — no component edits.

## Supabase storage (required for hosted PDFs)

AiO is **not wired to a Supabase project yet**. The frontend only ships the
abstraction, so nothing in a component knows a URL:

- `services/storage.js` reads `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
  (see `frontend/.env.example`) and turns a `storagePath` into a public URL.
- Without those env vars, `getPublicFileUrl` returns `null` and hosted books
  show an honest "file isn't uploaded yet" state — no fake links ever render.

When you provision Supabase:

- Create the bucket `library` (public read).
- Layout: `library/books/<subject>/<file>.pdf` — folders such as
  `computer-science/`, `programming/`, `mathematics/`, `cybersecurity/`,
  `ai/`, `networking/`.
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `frontend/.env.local`.
- Only upload files AiO has permission to host (public domain, open licence,
  author-authorized, or AiO-original). Everything else stays `external`.

## How books work

- **Hosted** — `storagePath` → `getPublicFileUrl()` → native PDF frame, or
  original demo text via the chapter reader. Progress is only recorded where
  it can be honest: text chapters report `chapter/total`; a cross-origin PDF
  viewer cannot, so PDFs get opened/completed only. No page numbers are faked.
- **External** — the reader explains "This book is available from an external
  source." and opens the legitimate URL in a new tab (target `_blank` +
  `rel=noopener`). AiO never downloads, mirrors or embeds external books.

## Reading progress & bookmarks

- `aioworld.library.progress` — `{ bookId: { chapterId?, chapterTitle?,
  progress, lastOpened, completed? } }`.
- `aioworld.library.bookmarks` — `["book-id-1", "…"]`.
- Both follow the existing localStorage pattern (cached reads, try/catch, a
  documented swap path to an authenticated backend later).

## Design

`library.css` is scoped under `.lib-page` / `.lib-reader`, uses only the
`index.css` tokens (BEM, `lib-*` prefix), no new libraries, and the reader
offers light/sepia/dark reading modes, a contents drawer, font-size zoom,
fullscreen, and a responsive layout (cards and reader work on mobile).

## Testing

```
cd frontend
npm run lint
npm run build
npm run dev   # then visit #/learn/library, open a text demo, external book, my-library
```