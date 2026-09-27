/**
 * AiO Library — domain types and shared vocabulary.
 *
 * This file only defines shapes and constants. Book records live in
 * `data/books.js`, the demo text content in `data/demo-books.js`, and the
 * selectors (search/filter/sort) in `services/library.js`. Adding a book is
 * adding data, never another component or page.
 *
 * A book is either:
 *
 *   HOSTED   — AiO hosts an authorized file. `storagePath` points into the
 *              `library` Supabase bucket; URLs are built only through
 *              `services/storage.js`. Demo texts instead carry
 *              `demoContentRef` (original AiO-authored content).
 *   EXTERNAL — AiO stores only metadata + the legitimate source URL.
 */

/**
 * @typedef {'hosted'|'external'} SourceType
 * @typedef {'pdf'|'text'} FileType
 * @typedef {0|1} ProgressValue  // 0..1 reading progress where calculable
 *
 * @typedef {{
 *   id: string,
 *   title: string,
 *   author: string,
 *   description: string,
 *   category: string,          // one of CATEGORY_KEYS
 *   subjects: string[],        // subset of CATEGORY_KEYS
 *   tags: string[],
 *   format: string,            // human label, e.g. "PDF", "EPUB", "Web"
 *   sourceType: SourceType,
 *   coverUrl?: string|null,
 *   license?: string,
 *   demo?: boolean,
 *   featured?: boolean,
 *   addedAt: string,           // ISO date, drives "Recently added"
 *   fileType?: FileType,       // hosted only
 *   storagePath?: string,      // hosted only
 *   demoContentRef?: string,   // hosted text demos only -> data/demo-books.js
 *   externalUrl?: string,      // external only
 * }} Book
 *
 * @typedef {{
 *   chapterId?: string,
 *   chapterTitle?: string,
 *   progress: number,          // 0..1 (integer multiples only where calculable)
 *   lastOpened: string,        // ISO timestamp
 *   completed?: boolean,
 * }} ReadingProgress
 */

export const SOURCE_TYPES = {
  HOSTED: 'hosted',
  EXTERNAL: 'external',
}

export const SOURCE_LABELS = {
  [SOURCE_TYPES.HOSTED]: 'Hosted by AiO',
  [SOURCE_TYPES.EXTERNAL]: 'External',
}

// The 16 browse subjects. Each maps to a filter chip and, with a count, to a
// "Popular subjects" card. `all` is the virtual "show everything" state.
export const CATEGORIES = [
  { key: 'computer-science', title: 'Computer Science' },
  { key: 'programming', title: 'Programming' },
  { key: 'dsa', title: 'Data Structures & Algorithms' },
  { key: 'ai', title: 'Artificial Intelligence' },
  { key: 'cybersecurity', title: 'Cybersecurity' },
  { key: 'mathematics', title: 'Mathematics' },
  { key: 'networking', title: 'Computer Networks' },
  { key: 'os', title: 'Operating Systems' },
  { key: 'databases', title: 'Databases' },
  { key: 'software-engineering', title: 'Software Engineering' },
  { key: 'web', title: 'Web Development' },
  { key: 'cloud', title: 'Cloud & DevOps' },
  { key: 'embedded', title: 'Electronics & Embedded' },
  { key: 'business', title: 'Business & Entrepreneurship' },
  { key: 'design', title: 'Design' },
  { key: 'career', title: 'Career & Interviews' },
]

export const CATEGORY_KEYS = CATEGORIES.map((category) => category.key)

export function categoryTitle(key) {
  return CATEGORIES.find((category) => category.key === key)?.title ?? key
}

export const SOURCE_FILTERS = [
  { key: 'all', label: 'All sources' },
  { key: SOURCE_TYPES.HOSTED, label: 'Hosted' },
  { key: SOURCE_TYPES.EXTERNAL, label: 'External' },
]

export const SORTS = [
  { key: 'recent', label: 'Recently added' },
  { key: 'title', label: 'Title A–Z' },
  { key: 'author', label: 'Author A–Z' },
]

// Reader display modes. The rest of AiO is a fixed light cream theme; the
// reader offers its own in-book light/sepia/dark modes so text stays readable
// at night without implying the whole site has a dark variant.
export const READING_MODES = [
  { key: 'light', label: 'Light' },
  { key: 'sepia', label: 'Sepia' },
  { key: 'dark', label: 'Dark' },
]