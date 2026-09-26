/**
 * Sidequests domain — the frontend mirror of
 * `backend/src/modules/sidequests/types/sidequests.ts`.
 *
 * The backend file is canonical. This one mirrors it and adds only what the UI
 * needs and the API does not serve: display labels, shelf copy, and the
 * formatting helpers. Nothing here fetches or stores anything.
 *
 * The project is plain `.jsx` with no TypeScript, so these are JSDoc typedefs —
 * the same information, without introducing a build-time type checker the rest
 * of the frontend does not have.
 */

/* ── Enumerations (kept in step with the backend) ────────────────────────── */

export const INTEREST_CATEGORIES = [
  'move',
  'create',
  'explore',
  'unwind',
  'discover',
]

export const CONTENT_TYPES = [
  'article',
  'guide',
  'workout',
  'recipe',
  'book',
  'podcast',
  'video',
  'challenge',
  'fact',
  'resource',
  'event_reference',
]

export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'any']

/* ── Shelf metadata ──────────────────────────────────────────────────────── */

/**
 * The five shelves, and the copy that makes each one feel like a different
 * mood rather than a different topic. Ordering here is the ordering the
 * selector and the chips use.
 */
export const CATEGORY_META = {
  move: {
    key: 'move',
    label: 'Move',
    blurb: 'Things that get your body somewhere.',
    accent: '#FF8383',
  },
  create: {
    key: 'create',
    label: 'Create',
    blurb: 'Make something with your hands and an afternoon.',
    accent: '#FFA270',
  },
  explore: {
    key: 'explore',
    label: 'Explore',
    blurb: 'Go and see what is out there.',
    accent: '#E6B26E',
  },
  unwind: {
    key: 'unwind',
    label: 'Unwind',
    blurb: 'The end-of-the-day shelf.',
    accent: '#C9A227',
  },
  discover: {
    key: 'discover',
    label: 'Discover',
    blurb: 'The ones nobody expects you to be into.',
    accent: '#B08968',
  },
}

/** Shelf order for rendering. */
export const CATEGORY_ORDER = INTEREST_CATEGORIES

/* ── Content type metadata ───────────────────────────────────────────────── */

const CONTENT_TYPE_META = {
  article: { label: 'Article', glyph: 'article' },
  guide: { label: 'Guide', glyph: 'guide' },
  workout: { label: 'Workout', glyph: 'workout' },
  recipe: { label: 'Recipe', glyph: 'recipe' },
  book: { label: 'Book', glyph: 'book' },
  podcast: { label: 'Podcast', glyph: 'podcast' },
  video: { label: 'Video', glyph: 'video' },
  challenge: { label: 'Challenge', glyph: 'challenge' },
  fact: { label: 'Fact', glyph: 'fact' },
  resource: { label: 'Resource', glyph: 'resource' },
  event_reference: { label: 'At an event', glyph: 'event_reference' },
}

/**
 * `event_reference` is the one type that is not really content — it points at
 * something happening in person, so it reads as a nudge rather than a thing to
 * read.
 */
const EVENT_REFERENCE_LABEL = 'Worth showing up for'

export function contentTypeLabel(type) {
  if (type === 'event_reference') return EVENT_REFERENCE_LABEL
  return CONTENT_TYPE_META[type]?.label ?? 'Sidequest'
}

export function contentTypeGlyph(type) {
  return CONTENT_TYPE_META[type]?.glyph ?? 'guide'
}

/** The brief's "difficulty if relevant" — `any` and absent both mean "no level". */
export function hasDifficulty(item) {
  return Boolean(item?.difficulty) && item.difficulty !== 'any'
}

export function difficultyLabel(difficulty) {
  if (!difficulty || difficulty === 'any') return ''
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
}

/* ── Typedefs ────────────────────────────────────────────────────────────── */

/**
 * @typedef {Object} Interest
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {string} icon        Key into the `InterestIcon` glyph set.
 * @property {string} category    One of INTEREST_CATEGORIES.
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} SidequestItem
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} description
 * @property {string} type
 * @property {string} category
 * @property {string} interestSlug
 * @property {string} [imageUrl]
 * @property {string} [sourceName]
 * @property {string} [sourceUrl]
 * @property {string} [duration]
 * @property {string} [difficulty]
 * @property {string[]} tags
 * @property {string} publishedAt
 * @property {boolean} isFeatured
 * @property {boolean} isActive
 * @property {string[]} [steps]
 * @property {string[]} [ingredients]
 * @property {string} [pitch]
 * @property {string[]} [reasons]  Present only on the ranked "for you" shelf.
 * @property {number} [score]      Present only on the ranked "for you" shelf.
 */

/**
 * @typedef {Object} SidequestEvent
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} venue
 * @property {string} city
 * @property {string|null} collegeId
 * @property {string} organizer
 * @property {string} [registrationUrl]
 * @property {boolean} isFree
 * @property {boolean} isActive
 * @property {string[]} interestSlugs
 */

/**
 * @typedef {Object} InterestCircle
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {string} interestSlug
 * @property {string|null} collegeId
 * @property {string|null} city
 * @property {number} memberCount
 * @property {boolean} isActive
 * @property {boolean} joined   Added by the service layer.
 */

/* ── Formatting ──────────────────────────────────────────────────────────── */

const DAY_MS = 86_400_000

/** Midnight today, so "this week" comparisons are not skewed by the hour. */
function startOfToday() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now.getTime()
}

/**
 * "Tonight", "Tomorrow", "Saturday", "12 Mar" — the shape a student actually
 * scans for when deciding whether to go.
 */
export function formatEventWhen(iso) {
  if (!iso) return ''
  const then = new Date(iso)
  const dayDelta = Math.round((then.getTime() - startOfToday()) / DAY_MS)
  const time = then.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

  if (dayDelta === 0) return `Tonight, ${time}`
  if (dayDelta === 1) return `Tomorrow, ${time}`
  if (dayDelta > 0 && dayDelta < 7) {
    return then.toLocaleDateString(undefined, { weekday: 'long' })
  }
  return then.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

export function isWeekend(iso) {
  const day = new Date(iso).getDay()
  return day === 0 || day === 6
}

/** "in 3 days" / "3 days ago", for the saved list. */
export function formatRelative(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diff / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  const months = Math.round(days / 30)
  return `${months} month${months === 1 ? '' : 's'} ago`
}

/**
 * A stable 0–1 value from any string, used to give each item a consistent
 * generated visual. Not a hash for correctness — just "same id, same gradient",
 * so a card does not change colour between renders.
 *
 * Tolerates a missing value. A card is the smallest thing on the page, and
 * throwing here would take the whole section down over a decorative gradient; a
 * fixed fallback is not worth a blank screen.
 */
export function stableFraction(value) {
  const text = typeof value === 'string' ? value : ''
  let hash = 0x811c9dc5
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return (hash >>> 0) / 0xffffffff
}
