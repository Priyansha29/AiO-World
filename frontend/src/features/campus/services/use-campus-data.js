/**
 * Data hooks for the Campus Hub feature.
 *
 * Components stay presentation-only: loading / error / data fetching live here.
 */
import { useEffect, useState } from 'react'
import { getCampusInformation, searchColleges } from './campuses-service'

/**
 * College catalogue search with debounce.
 * @param {string} query
 * @param {{ debounceMs?: number }} [options]
 */
export function useCollegeSearch(query, { debounceMs = 260 } = {}) {
  const [state, setState] = useState({ colleges: [], loading: false, error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    const timer = setTimeout(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const result = await searchColleges(query)
        if (!cancelled) {
          setState({ colleges: result.colleges, loading: false, error: null })
        }
      } catch (error) {
        if (!cancelled) {
          setState({ colleges: [], loading: false, error: error.message })
        }
      }
    }, debounceMs)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, debounceMs, attempt])

  const retry = () => setAttempt((n) => n + 1)
  return { ...state, retry }
}

/**
 * Campus information for the selected college.
 * @param {string|null} collegeId
 * @param {{ category?: string, query?: string, status?: string }} [filters]
 */
export function useCampusInformation(collegeId, filters = {}) {
  const { category, query, status } = filters
  const [state, setState] = useState({
    college: null,
    items: [],
    loading: Boolean(collegeId),
    error: null,
  })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!collegeId) return undefined

    let cancelled = false

    const timer = setTimeout(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const result = await getCampusInformation(collegeId, { category, query, status })
        if (!cancelled) {
          setState({
            college: result.college,
            items: result.items,
            loading: false,
            error: null,
          })
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            college: null,
            items: [],
            loading: false,
            error: error.message,
          })
        }
      }
    }, 0)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [collegeId, attempt, category, query, status])

  const retry = () => setAttempt((n) => n + 1)
  return { ...state, retry }
}