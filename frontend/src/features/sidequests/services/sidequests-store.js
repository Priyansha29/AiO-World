/**
 * Sidequests local identity and preference cache.
 *
 * Two jobs, both following the convention `features/campus/services/profile-store.js`
 * set: keep the awkward bits behind one interface so the swap is a one-file
 * change later.
 *
 *  1. **Identity.** There is no authentication in AiO World, so the backend
 *     needs an opaque id to key saved items, picked interests and circle joins.
 *     This mints one into `localStorage` and the API service sends it as
 *     `x-aioworld-user`. It is not a profile: no email, no name, nothing that
 *     identifies a person. When real auth exists this whole module is deleted
 *     and the id comes from the session instead.
 *
 *  2. **Mirror.** Every mutation is written to the server *and* cached here, so
 *     a bookmark's filled state is correct on the very next paint rather than
 *     after a round trip. The cache is a cache: the server is the source of
 *     truth, and the overview/saved responses overwrite it.
 */

const USER_ID_KEY = 'aioworld.sidequests.user'
const SAVED_KEY = 'aioworld.sidequests.saved'

/**
 * The id shape the backend validates (`/^[a-z0-9][a-z0-9_-]{7,63}$/`).
 * `crypto.randomUUID` contains hyphens and hex, so it fits — but it can
 * theoretically start with a digit, which the backend also allows. The prefix
 * keeps it recognisable in logs and guarantees the length floor.
 */
function mintUserId() {
  const random =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
      : Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 6)
  return `sq${random}`.toLowerCase().slice(0, 40)
}

/**
 * Read the anonymous device id, minting and persisting one on first use.
 *
 * Cached in a module variable as well as `localStorage` so a page with dozens
 * of components reading it does not re-parse storage each time, and so a
 * storage failure (private mode, quota) degrades to a per-session id instead of
 * throwing on every request.
 */
let cachedUserId = null

export function getUserId() {
  if (cachedUserId) return cachedUserId
  try {
    const stored = window.localStorage.getItem(USER_ID_KEY)
    if (stored && /^[a-z0-9][a-z0-9_-]{7,63}$/.test(stored)) {
      cachedUserId = stored
      return cachedUserId
    }
    const minted = mintUserId()
    window.localStorage.setItem(USER_ID_KEY, minted)
    cachedUserId = minted
  } catch {
    // Storage unavailable: fall back to a per-session id. Saves will not
    // survive a reload, which is honest, rather than throwing on every fetch.
    cachedUserId = cachedUserId ?? mintUserId()
  }
  return cachedUserId
}

/* ── Saved mirror ────────────────────────────────────────────────────────── */

let savedCache = null

/** @returns {Set<string>} ids currently believed to be saved. */
export function getSavedMirror() {
  if (savedCache) return savedCache
  try {
    const raw = window.localStorage.getItem(SAVED_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    savedCache = new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [])
  } catch {
    savedCache = new Set()
  }
  return savedCache
}

function persistSaved(set) {
  savedCache = set
  try {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify([...set]))
  } catch {
    // Non-fatal: the server still has the truth.
  }
}

/** Optimistically record a save so the button fills immediately. */
export function mirrorSaved(contentId, saved) {
  const next = new Set(getSavedMirror())
  if (saved) next.add(contentId)
  else next.delete(contentId)
  persistSaved(next)
  return next
}

/** Replace the mirror wholesale, from a `GET /saved` response. */
export function syncSavedMirror(contentIds) {
  persistSaved(new Set(contentIds))
  return savedCache
}

/** Forget everything about this device. Exposed for the page's reset control. */
export function resetLocalIdentity() {
  cachedUserId = null
  savedCache = null
  try {
    window.localStorage.removeItem(USER_ID_KEY)
    window.localStorage.removeItem(SAVED_KEY)
  } catch {
    // Nothing to clear.
  }
}
