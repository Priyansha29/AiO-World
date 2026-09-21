/**
 * Campus data services (API-shaped).
 *
 * This layer is the seam between the UI and the data. Today it resolves from
 * the bundled DEMO dataset; tomorrow these same functions can be re-pointed at
 * `GET /api/colleges`, `GET /api/colleges/search?q=`, etc. without touching
 * any component. Signatures deliberately mirror the backend endpoints.
 *
 * All functions are async (with a small simulated latency) so loading states
 * behave like they will against a real network.
 */
import { MOCK_COLLEGES } from '../data/mock-colleges'
import { MOCK_CAMPUS_INFORMATION } from '../data/mock-campus-info'
import { PRIORITY_RANK, CAMPUS_CATEGORIES } from '../domain/campus-types'

const SIMULATED_LATENCY_MS = 320

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/*
 * QA helper — appending `?campus_fail=1` to the URL makes the next campus
 * information request fail once, so the error state + "Try again" recovery can
 * be exercised (e.g. http://localhost:5173/?campus_fail=1#/campus).
 */
let queuedFailure = false
function consumeQueuedFailure() {
  if (
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('campus_fail') &&
    !queuedFailure
  ) {
    queuedFailure = true
    return true
  }
  return false
}

const COLLEGE_SEARCH_FIELDS = ['name', 'abbreviation', 'city', 'state', 'university']

function filterColleges(query) {
  const q = (query ?? '').trim().toLowerCase()
  if (!q) return MOCK_COLLEGES
  return MOCK_COLLEGES.filter((college) =>
    COLLEGE_SEARCH_FIELDS.some((field) => {
      const value = college[field]
      return typeof value === 'string' && value.toLowerCase().includes(q)
    }),
  )
}

/** Mirrors `GET /api/colleges` and `GET /api/colleges/search?q=` */
export async function searchColleges(query = '') {
  await delay(SIMULATED_LATENCY_MS)
  return { colleges: filterColleges(query), meta: { demo: true } }
}

/** Mirrors `GET /api/colleges/:id` */
export async function getCollegeById(id) {
  await delay(SIMULATED_LATENCY_MS / 2)
  const college = MOCK_COLLEGES.find((c) => c.id === id)
  if (!college) {
    const error = new Error('College not found.')
    error.code = 'college_not_found'
    throw error
  }
  return college
}

/**
 * Mirrors `GET /api/colleges/:id/campus-information?category=&q=&status=`.
 *
 * @param {string} collegeId
 * @param {{ category?: string, query?: string, status?: string }} [filter]
 */
export async function getCampusInformation(collegeId, filter = {}) {
  await delay(SIMULATED_LATENCY_MS + 80)
  if (consumeQueuedFailure()) {
    throw new Error('Couldn\u2019t load campus updates.')
  }

  const college = MOCK_COLLEGES.find((c) => c.id === collegeId)
  if (!college) {
    const error = new Error('College not found.')
    error.code = 'college_not_found'
    throw error
  }

  const status = filter.status ?? 'active'
  const category = filter.category
  const query = (filter.query ?? '').trim().toLowerCase()

  let items = MOCK_CAMPUS_INFORMATION.filter((item) => item.collegeId === collegeId)
  if (status !== 'all') items = items.filter((item) => item.status === status)
  if (category) items = items.filter((item) => item.category === category)
  if (query) {
    const q = query
    items = items.filter((item) =>
      `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(q),
    )
  }

  items = [...items].sort((a, b) => {
    const byPriority = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
    if (byPriority !== 0) return byPriority
    return b.updatedAt.localeCompare(a.updatedAt)
  })

  return {
    college,
    items,
    meta: {
      demo: true,
      category: category ?? null,
      query: filter.query ?? '',
      status,
      count: items.length,
      generatedAt: new Date().toISOString(),
    },
  }
}

export { CAMPUS_CATEGORIES as VALID_CAMPUS_CATEGORIES }