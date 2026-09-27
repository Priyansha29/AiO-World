/**
 * Bookmarks ("My Library" saved list) persistence.
 *
 * localStorage key `aioworld.library.bookmarks`:
 *
 *   ["book-id-1", "book-id-2"]
 *
 * Pure client-side until an account system exists — same pattern as
 * `sidequests-store`'s saved mirror, minus the server half.
 */

const STORAGE_KEY = 'aioworld.library.bookmarks'

/** @type {string[]|null} */
let cached = null
let loaded = false

function readBookmarks() {
  if (loaded) return cached
  loaded = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = JSON.parse(raw ?? '[]')
    cached = Array.isArray(parsed) ? parsed : []
  } catch {
    cached = []
  }
  return cached
}

function writeBookmarks() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cached))
  } catch {
    // Storage unavailable: keeps working for the session only.
  }
}

/** @returns {string[]} */
export function getBookmarks() {
  return [...readBookmarks()]
}

export function hasBookmark(bookId) {
  return readBookmarks().includes(bookId)
}

/**
 * Toggle a bookmark; returns the new state.
 *
 * @param {string} bookId
 * @returns {boolean} true when now saved
 */
export function toggleBookmark(bookId) {
  const list = readBookmarks()
  const index = list.indexOf(bookId)
  if (index === -1) list.push(bookId)
  else list.splice(index, 1)
  writeBookmarks()
  return index === -1
}