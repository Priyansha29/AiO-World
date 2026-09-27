/**
 * Reading progress persistence.
 *
 * localStorage key `aioworld.library.progress`, shaped as the brief specifies:
 *
 *   {
 *     "demo-how-to-learn": {
 *       "chapterId": "one-path",
 *       "chapterTitle": "Pick one path and go deep",
 *       "progress": 0.5,
 *       "lastOpened": "2026-09-27T10:00:00.000Z",
 *       "completed": false
 *     }
 *   }
 *
 * Progress is only ever written when it can be honestly calculated:
 *   - hosted TEXT demos track `chapterIndex/totalChapters`, plus the last
 *     chapter's title, and a user-pressed "completed" flag.
 *   - hosted PDF / external books get `lastOpened` on open and nothing else —
 *     a cross-origin viewer cannot report page numbers, so this module never
 *     pretends it can.
 *
 * Mirrors the campus/career localStorage pattern; swap to an authenticated
 * backend later is a one-file change.
 */

const STORAGE_KEY = 'aioworld.library.progress'

/** @type {Record<string, import('../domain/library-types.js').ReadingProgress>|null} */
let cachedProgress = null
let progressLoaded = false

function readProgress() {
  if (progressLoaded) return cachedProgress
  progressLoaded = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    cachedProgress = raw ? JSON.parse(raw) : {}
  } catch {
    cachedProgress = {}
  }
  return cachedProgress
}

function writeProgress() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedProgress))
  } catch {
    // Storage unavailable: progress just won't survive a reload.
  }
}

/**
 * @param {string} bookId
 * @returns {import('../domain/library-types.js').ReadingProgress|null}
 */
export function getBookProgress(bookId) {
  return readProgress()[bookId] ?? null
}

export function getAllProgress() {
  return readProgress()
}

/**
 * Record that a book was opened (updates lastOpened). Progress values left as
 * they are — opening is not progress.
 *
 * @param {string} bookId
 */
export function recordOpen(bookId) {
  const progress = readProgress()
  progress[bookId] = { ...(progress[bookId] ?? {}), lastOpened: new Date().toISOString() }
  writeProgress()
}

/**
 * Merge a patch into a book's progress record (e.g. chapter + fraction).
 *
 * @param {string} bookId
 * @param {Partial<import('../domain/library-types.js').ReadingProgress>} patch
 */
export function setBookProgress(bookId, patch) {
  const progress = readProgress()
  progress[bookId] = { ...(progress[bookId] ?? {}), ...patch }
  writeProgress()
}

export function markCompleted(bookId) {
  setBookProgress(bookId, { completed: true, progress: 1, lastOpened: new Date().toISOString() })
}

export function unmarkCompleted(bookId) {
  setBookProgress(bookId, { completed: false })
}

/** @returns {string[]} bookIds with any stored record (started, saved or completed). */
export function getStartedBookIds() {
  return Object.keys(readProgress()).filter((id) => readProgress()[id]?.lastOpened)
}