/**
 * Profile persistence for the selected college.
 *
 * Today this is localStorage — a reasonable temporary mechanism until real
 * authentication exists. Every accessor goes through this module so the swap
 * to an authenticated user profile (server-side) is a one-file change.
 *
 * The stored "profile" is intentionally minimal: the selected college id plus
 * a small display snapshot. No phone, email, location or contacts are ever
 * collected.
 */

const STORAGE_KEY = 'aioworld.profile'

/** @type {import('../domain/campus-types.js').College|null} */
let cachedProfile = null
let profileLoaded = false

function readProfile() {
  if (profileLoaded) return cachedProfile
  profileLoaded = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    cachedProfile = raw ? JSON.parse(raw) : null
  } catch {
    cachedProfile = null
  }
  return cachedProfile
}

/** @returns {import('../domain/campus-types.js').College|null} */
export function getSelectedCollege() {
  return readProfile()
}

export function hasSelectedCollege() {
  return Boolean(readProfile())
}

/**
 * @param {import('../domain/campus-types.js').College} college
 */
export function saveSelectedCollege(college) {
  const snapshot = {
    id: college.id,
    name: college.name,
    abbreviation: college.abbreviation,
    city: college.city,
    state: college.state,
  }
  cachedProfile = snapshot
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  } catch {
    // Storage unavailable (private mode, quota): the session still works.
  }
}

export function clearSelectedCollege() {
  cachedProfile = null
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}