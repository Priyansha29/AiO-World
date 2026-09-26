/**
 * Sidequests API client.
 *
 * Real HTTP against the real backend — `GET /api/sidequests/…` — which the Vite
 * dev server proxies to Express on port 5000. This is the opposite of the
 * Campus feature, which resolves from a bundled dataset; the product spec asks
 * for a genuine API, and a feature whose data lives in a component is not one.
 *
 * Because the backend must be running, every function fails loudly and with a
 * readable message rather than silently degrading to seed data. A section that
 * cannot load shows "Something got lost somewhere." with a working retry — which
 * is the honest behaviour when a service is down.
 */
import { getSelectedCollege } from '../../campus/services/profile-store'
import { getUserId } from './sidequests-store'

/** How long any single request may take before it is treated as failed. */
const REQUEST_TIMEOUT_MS = 12_000

const BASE = '/api/sidequests'

/**
 * An error carrying the backend's own machine code, so a component can tell
 * "you already saved this" (409) apart from "that does not exist" (404) without
 * string-matching a message.
 */
export class SidequestsError extends Error {
  constructor(message, { code = 'unknown', status = 0 } = {}) {
    super(message)
    this.name = 'SidequestsError'
    this.code = code
    this.status = status
  }
}

/**
 * Headers every request carries.
 *
 * `x-aioworld-user` is the anonymous device id; `x-aioworld-college` is the
 * campus the student already chose, read from the Campus profile store. The
 * college travels as a header rather than a query parameter so a stale shared
 * link cannot pin somebody else's campus into a request.
 */
function headers(collegeId) {
  const base = { 'x-aioworld-user': getUserId() }
  // An explicit college wins; otherwise the one already chosen in Campus. Passing
  // it in keeps the caller's dependency real — the overview refetches when the
  // campus changes because the request genuinely changes, not because a hook
  // re-runs.
  const id = collegeId ?? getSelectedCollege()?.id
  if (id) base['x-aioworld-college'] = id
  return base
}

async function request(path, { method = 'GET', body, collegeId, signal } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  // Let a caller's signal (an unmounted section) cancel us, without leaking
  // listeners on the timeout.
  const onExternalAbort = () => controller.abort()
  signal?.addEventListener('abort', onExternalAbort)

  try {
    const response = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        ...headers(collegeId),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    const text = await response.text()
    let payload = null
    if (text) {
      try {
        payload = JSON.parse(text)
      } catch {
        throw new SidequestsError('The server sent something we did not understand.', {
          code: 'bad_response',
          status: response.status,
        })
      }
    }

    if (!response.ok) {
      throw new SidequestsError(
        payload?.message ?? 'Something got lost somewhere.',
        { code: payload?.error ?? 'request_failed', status: response.status },
      )
    }

    return payload
  } catch (error) {
    if (error instanceof SidequestsError) throw error
    if (error?.name === 'AbortError') {
      // Distinguish "we ran out of time" from "the caller cancelled", so a
      // section that unmounted mid-flight does not flash an error state.
      const cancelled = signal?.aborted === true
      throw new SidequestsError(
        cancelled ? 'Cancelled.' : 'The server took too long to answer.',
        { code: cancelled ? 'cancelled' : 'timeout' },
      )
    }
    // Network-level failure: backend not running, CORS, offline.
    throw new SidequestsError(
      'We could not reach Sidequests. Is the backend running?',
      { code: 'network_error' },
    )
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', onExternalAbort)
  }
}

/** Build a query string from defined values only. */
function qs(params) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    search.set(key, Array.isArray(value) ? value.join(',') : String(value))
  }
  const encoded = search.toString()
  return encoded ? `?${encoded}` : ''
}

/* ── Reads ───────────────────────────────────────────────────────────────── */

/**
 * The single request the first viewport needs: interests, the personalised
 * shelf, the weekly sidequest, a few circles and the "people around you"
 * counts. Roughly a fifth of the catalogue — the rest of the page loads its
 * own section when that section is reached.
 */
export function fetchOverview({ collegeId, signal } = {}) {
  return request('/overview', { collegeId, signal })
}

export function fetchForYou({ limit, collegeId, signal } = {}) {
  return request(`/for-you${qs({ limit })}`, { collegeId, signal })
}

/**
 * One surprise. The server records it as seen so it will not repeat.
 *
 * `exclude` is the id of the card currently on screen. The preview in the
 * overview is deliberately not recorded as seen — loading a page should not
 * spend a turn — which means without this the first press of "Give me another"
 * can legitimately return the same card. It is asking for another one.
 */
export function fetchDiscover({ exclude, collegeId, signal } = {}) {
  return request(`/discover${qs({ exclude })}`, { collegeId, signal })
}

export function fetchWeekly({ collegeId, signal } = {}) {
  return request('/weekly', { collegeId, signal })
}

export function fetchEvents({
  interests,
  category,
  free,
  weekend,
  within,
  collegeId,
  signal,
} = {}) {
  return request(
    `/events${qs({
      interests: interests?.length ? interests : undefined,
      category,
      free: free ? 'true' : undefined,
      weekend: weekend ? 'true' : undefined,
      within,
    })}`,
    { collegeId, signal },
  )
}

export function fetchCircles({ interest, collegeId, signal } = {}) {
  return request(`/circles${qs({ interest })}`, { collegeId, signal })
}

export function fetchPeople({ collegeId, signal } = {}) {
  return request('/people', { collegeId, signal })
}

export function fetchSaved({ collegeId, signal } = {}) {
  return request('/saved', { collegeId, signal })
}

export function fetchInterestDetail(slug, { signal } = {}) {
  return request(`/interests/${encodeURIComponent(slug)}`, { signal })
}

/* ── Writes ──────────────────────────────────────────────────────────────── */

export function addInterests(interestIds) {
  return request('/interests', { method: 'POST', body: { interestIds } })
}

export function removeInterest(interestId) {
  return request(`/interests/${encodeURIComponent(interestId)}`, { method: 'DELETE' })
}

export function saveContent(contentId) {
  return request(`/saved/${encodeURIComponent(contentId)}`, { method: 'POST' })
}

export function unsaveContent(contentId) {
  return request(`/saved/${encodeURIComponent(contentId)}`, { method: 'DELETE' })
}

export function joinCircle(circleId) {
  return request(`/circles/${encodeURIComponent(circleId)}/join`, { method: 'POST' })
}

export function leaveCircle(circleId) {
  return request(`/circles/${encodeURIComponent(circleId)}/leave`, { method: 'DELETE' })
}

export function completeWeekly(contentId) {
  return request(`/weekly/${encodeURIComponent(contentId)}/complete`, { method: 'POST' })
}

export function uncompleteWeekly(contentId) {
  return request(`/weekly/${encodeURIComponent(contentId)}/complete`, { method: 'DELETE' })
}
