/**
 * Data hooks for the Sidequests page.
 *
 * Same contract as `features/campus/services/use-campus-data.js`: components
 * receive `{ data, loading, error, retry }` and never fetch for themselves.
 *
 * Three additions this feature needs:
 *
 *   - **Lazy sections.** Only the first viewport loads on mount. Events, circles,
 *     people and saved each request their data when the student has scrolled
 *     near them, so the page never pulls the whole catalogue on load. Every read
 *     hook therefore takes an `enabled` flag; the page decides when, because the
 *     decision is about the page, not about the data.
 *   - **Mutations that fail loudly.** Saving, joining and picking interests
 *     update local state optimistically and roll back on failure, so a bookmark
 *     feels instant but a dead backend cannot leave the UI lying.
 *   - **Derived, not mirrored.** Nothing here copies a server response into state
 *     to keep it in step. Read results are stored with the key that produced
 *     them and mutations are a small overlay on top, so there is no
 *     synchronisation step that can drift and no effect that exists only to
 *     reconcile two copies of the same truth.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getSelectedCollege } from '../../campus/services/profile-store'
import {
  SidequestsError,
  addInterests as addInterestsRequest,
  completeWeekly as completeWeeklyRequest,
  fetchCircles,
  fetchDiscover,
  fetchEvents,
  fetchForYou,
  fetchOverview,
  fetchPeople,
  fetchSaved,
  fetchWeekly,
  joinCircle as joinCircleRequest,
  leaveCircle as leaveCircleRequest,
  removeInterest as removeInterestRequest,
  saveContent as saveContentRequest,
  uncompleteWeekly as uncompleteWeeklyRequest,
  unsaveContent as unsaveContentRequest,
} from './sidequests-api'
import { getSavedMirror, mirrorSaved, syncSavedMirror } from './sidequests-store'

/* ── Generic async state ─────────────────────────────────────────────────── */

/**
 * The shared loading/error/retry state machine behind every read hook.
 *
 * `fetcher` must be memoised by the caller and is passed the abort signal; the
 * hook cancels in flight on unmount and on dependency change, and ignores the
 * result of a request it has already abandoned so a slow response cannot
 * overwrite fresher state.
 *
 * **`loading` is derived, not stored.** Each result is remembered together with
 * the `key` that produced it, and the hook is loading exactly when the key it
 * has is not the key it wants. A caller passes a key describing its inputs
 * (`useEvents` passes its filters, `useForYou` its limit), so changing a filter
 * or a campus produces a new key and therefore a loading state — with no
 * `setState` at the top of the effect, which would start an extra render and
 * cost the component React Compiler optimisation. The retry counter is folded
 * into the key for the same reason.
 *
 * When `enabled` is false the hook reports **loading**, without touching state at
 * all. A read that has not been made is not an empty read: reporting idle would
 * let a section say "Nothing saved yet" or "Nothing matches those filters" about
 * data it had simply never asked for, which is a confident false claim rather
 * than a missing one. Callers that genuinely have something to show in the
 * meantime — a section seeded from the overview — decide for themselves; the
 * hook only declines to call it empty.
 */
function useAsyncData(fetcher, { enabled = true, key = '', initialData = null } = {}) {
  const [nonce, setNonce] = useState(0)
  const [result, setResult] = useState({ key: null, data: initialData, error: null })

  // `null` while disabled, so a disabled hook never looks like it is waiting for
  // an answer to a question it was not asked — only that it has none yet.
  const wanted = enabled ? `${key}|${nonce}` : null

  useEffect(() => {
    if (!enabled) return undefined

    const controller = new AbortController()
    let active = true
    // Read inside the effect, not from the render closure, so a slow response
    // is tagged with the request that is actually in flight.
    const requestKey = wanted

    fetcher({ signal: controller.signal })
      .then((data) => {
        if (active) setResult({ key: requestKey, data, error: null })
      })
      .catch((error) => {
        if (!active) return
        // A cancelled request is not a failure — it is us tidying up.
        if (error instanceof SidequestsError && error.code === 'cancelled') return
        setResult({ key: requestKey, data: initialData, error })
      })

    return () => {
      active = false
      controller.abort()
    }
    // `wanted` already encodes `key` and `nonce`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, enabled, wanted, initialData])

  const retry = useCallback(() => setNonce((n) => n + 1), [])

  if (!enabled) {
    return { data: initialData, loading: true, error: null, retry }
  }
  return {
    data: result.key === wanted ? result.data : initialData,
    loading: result.key !== wanted,
    error: result.key === wanted ? result.error : null,
    retry,
  }
}

/**
 * The selected college id, read during render.
 *
 * The Campus store caches its profile in a module variable, so this costs
 * nothing and — unlike a `useState` seeded by an effect — it is a genuine
 * dependency. Changing campus in another view and coming back re-reads the new
 * value and refetches everything college-aware.
 */
function useCollegeId() {
  return getSelectedCollege()?.id ?? null
}

/* ── Overview (the first viewport) ───────────────────────────────────────── */

/**
 * Interests, the personalised shelf, the weekly sidequest, a few circles and the
 * "people around you" counts — one request, fetched on mount.
 *
 * `revision` re-reads the overview. The shelf, the circles, the people counts and
 * the discovery preview are all a function of the interest selection, so a
 * change to that selection is a genuinely different question rather than a local
 * patch: the ranking lives on the server, and re-deriving it here would mean two
 * implementations of the same rules. The page owns the counter because the
 * selection hook and the overview hook each need the other; the page is where
 * that relationship belongs.
 */
export function useSidequestsOverview({ revision = 0 } = {}) {
  const collegeId = useCollegeId()

  const fetcher = useCallback(
    ({ signal }) => fetchOverview({ collegeId, signal }),
    // Circles, people counts and the shelf are all college-aware, so a different
    // campus is a different answer and must be a different request.
    [collegeId],
  )

  return useAsyncData(fetcher, { key: `${collegeId ?? 'none'}#${revision}` })
}

/* ── Interests ───────────────────────────────────────────────────────────── */

/**
 * The student's selected interests, plus add/remove.
 *
 * Seeded from the overview response, which carries the authoritative
 * `selectedInterests` list. The ranked shelf is deliberately *not* used to
 * infer the selection: a student who picked an interest with no content on the
 * shelf would watch it silently vanish from "Your sidequests". The server owns
 * the set, so every write updates local state from the server's response —
 * including any row it refused to add.
 */
export function useInterests(overview) {
  const [selected, setSelected] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const seededFor = useRef(null)

  useEffect(() => {
    const response = overview?.data
    if (!response || seededFor.current === response) return
    seededFor.current = response
    setSelected(response.selectedInterests ?? [])
  }, [overview])

  const catalogue = useMemo(() => overview?.data?.interests ?? [], [overview])

  const add = useCallback(async (interestIds) => {
    if (interestIds.length === 0) return []
    setBusy(true)
    setError(null)
    try {
      const response = await addInterestsRequest(interestIds)
      setSelected(response.interests ?? [])
      return response.interests ?? []
    } catch (caught) {
      setError(caught)
      throw caught
    } finally {
      setBusy(false)
    }
  }, [])

  const remove = useCallback(async (interestId) => {
    // Optimistic: the chip leaves immediately and returns if the write fails.
    // `previous` is captured inside the updater so it is the exact list that was
    // on screen, not a stale closure.
    let previous = []
    setSelected((current) => {
      previous = current
      return current.filter((interest) => interest.id !== interestId)
    })
    setBusy(true)
    setError(null)
    try {
      const response = await removeInterestRequest(interestId)
      setSelected(response.interests ?? [])
    } catch (caught) {
      setSelected(previous)
      setError(caught)
      throw caught
    } finally {
      setBusy(false)
    }
  }, [])

  const slugs = useMemo(() => selected.map((interest) => interest.slug), [selected])
  const selectedIds = useMemo(
    () => new Set(selected.map((interest) => interest.id)),
    [selected],
  )

  return { catalogue, selected, selectedIds, slugs, add, remove, busy, error }
}

/* ── For you ─────────────────────────────────────────────────────────────── */

/** The ranked shelf on its own, for "load more" beyond the overview's six. */
export function useForYou({ enabled = true, limit = 12 } = {}) {
  const fetcher = useCallback(({ signal }) => fetchForYou({ limit, signal }), [limit])
  return useAsyncData(fetcher, { enabled, key: String(limit) })
}

/* ── Discovery ───────────────────────────────────────────────────────────── */

/**
 * "Surprise me".
 *
 * `seed` is the same `{ item, band }` shape `/discover` returns, taken from the
 * overview so the section is never empty on arrival and so the band label is
 * right on the first paint rather than a guess. Every press is then a real
 * request.
 *
 * Three details worth stating:
 *
 *   - The seed is a *preview*. The server does not record it as seen, so loading
 *     the page cannot advance the student's discovery history.
 *   - Because of that, the id currently on screen is sent back as `exclude` on
 *     every press. Loading a page should not spend a turn, but pressing "Give me
 *     another" and being handed the same card looks like a broken button — so the
 *     preview is excluded from the next roll without being written to history.
 *   - `loading` is tracked separately from the card, so the replacement
 *     cross-fades while the next item is in flight instead of collapsing to a
 *     skeleton between presses.
 *
 * The hook lives in the page, not in the card, so the hero's "Surprise me" and
 * the section's "Give me another" are the same action against the same state —
 * a hero button that only scrolled to a card it did not change would be a lie
 * about what it did.
 */
export function useDiscover({ seed = null } = {}) {
  const [result, setResult] = useState(() => (seed ? { item: seed.item ?? null, band: seed.band ?? null } : null))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [presses, setPresses] = useState(0)
  const alive = useRef(true)
  /** The card on screen, for `exclude`. A ref so `shuffle` keeps a stable identity. */
  const shown = useRef(result?.item?.id ?? null)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const show = useCallback((next) => {
    shown.current = next?.item?.id ?? null
    setResult(next)
  }, [])

  // Adopt a seed that arrives after mount, but never clobber a card the student
  // has already shuffled to.
  const seededFrom = useRef(null)
  useEffect(() => {
    if (!seed || seededFrom.current || presses > 0) return
    seededFrom.current = seed
    show({ item: seed.item ?? null, band: seed.band ?? null })
  }, [seed, presses, show])

  const shuffle = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchDiscover({ exclude: shown.current ?? undefined })
      if (!alive.current) return
      show({ item: response?.item ?? null, band: response?.band ?? null })
      setPresses((n) => n + 1)
    } catch (caught) {
      if (!alive.current) return
      if (caught instanceof SidequestsError && caught.code === 'cancelled') return
      setError(caught)
    } finally {
      if (alive.current) setLoading(false)
    }
  }, [show])

  return { item: result?.item ?? null, band: result?.band ?? null, loading, error, presses, shuffle }
}

/* ── Events ──────────────────────────────────────────────────────────────── */

/**
 * Local events, with the filters the product asks for: my interests, category,
 * free, weekend, and a time window.
 */
export function useEvents({ enabled = true, interests = [], free = false, weekend = false, within = 60 } = {}) {
  const interestKey = interests.join(',')

  const fetcher = useCallback(
    ({ signal }) =>
      fetchEvents({
        interests: interestKey ? interestKey.split(',') : undefined,
        free,
        weekend,
        within,
        signal,
      }),
    [interestKey, free, weekend, within],
  )

  // The filters are the request's identity: flipping one is a genuinely
  // different question, and the key is what makes the shelf show as loading.
  return useAsyncData(fetcher, {
    enabled,
    key: `${interestKey}|${free ? 'f' : ''}${weekend ? 'w' : ''}${within}`,
  })
}

/* ── Circles ─────────────────────────────────────────────────────────────── */

export function useCircles({ enabled = true } = {}) {
  const collegeId = useCollegeId()
  const fetcher = useCallback(({ signal }) => fetchCircles({ collegeId, signal }), [collegeId])
  return useAsyncData(fetcher, { enabled, key: collegeId ?? 'none' })
}

/**
 * Joining and leaving a circle.
 *
 * The overview response carries a few circles for the first viewport and
 * `GET /circles` returns the full set once that section is reached, so this hook
 * does not own a second copy of the list. Instead it keeps a small overlay of
 * optimistic overrides and hands back a `resolve` function that layers them over
 * whatever list it was given — no mutation of a response object, and the change
 * re-renders properly.
 */
export function useCircleMembership() {
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState(null)
  // The circle the last failure happened on, so "Try again" can retry the right
  // request rather than guessing from an error message.
  const [failed, setFailed] = useState(null)
  const [overrides, setOverrides] = useState({})

  /** Layer the optimistic overrides over a base circle list. */
  const resolve = useCallback(
    (list = []) =>
      list.map((circle) =>
        overrides[circle.id] ? { ...circle, ...overrides[circle.id] } : circle,
      ),
    [overrides],
  )

  const setOverride = useCallback((circleId, patch) => {
    setOverrides((current) => ({ ...current, [circleId]: patch }))
  }, [])

  const toggle = useCallback(
    async (circle, currentMemberCount) => {
      const next = !circle.joined
      setBusyId(circle.id)
      setError(null)
      setFailed(null)
      setOverride(circle.id, {
        joined: next,
        memberCount: Math.max(0, currentMemberCount + (next ? 1 : -1)),
      })

      try {
        if (next) await joinCircleRequest(circle.id)
        else await leaveCircleRequest(circle.id)
        return next
      } catch (caught) {
        // Put the row back exactly as the server last reported it.
        setOverride(circle.id, { joined: circle.joined, memberCount: currentMemberCount })
        setError(caught)
        setFailed({ circle, memberCount: currentMemberCount })
        throw caught
      } finally {
        setBusyId(null)
      }
    },
    [setOverride],
  )

  /** Re-run the request that just failed, with the same arguments. */
  const retry = useCallback(() => {
    if (!failed) return
    toggle(failed.circle, failed.memberCount).catch(() => {})
  }, [failed, toggle])

  return { resolve, toggle, retry, busyId, error, failed }
}

/* ── People ──────────────────────────────────────────────────────────────── */

export function usePeople({ enabled = true } = {}) {
  const collegeId = useCollegeId()
  const fetcher = useCallback(({ signal }) => fetchPeople({ collegeId, signal }), [collegeId])
  return useAsyncData(fetcher, { enabled, key: collegeId ?? 'none' })
}

/* ── Weekly ──────────────────────────────────────────────────────────────── */

/**
 * The weekly sidequest and its completion state.
 *
 * Seeded from the overview so the section paints on the first frame, but backed
 * by its own request so it can recover on its own if it is the only thing that
 * failed. The server is the source of truth: when the answer lands it replaces
 * the seed, and when it disagrees with an optimistic toggle the server wins.
 *
 * The one guard is `busy`. A read that was issued *before* a write can land
 * while that write is still in flight, and applying it would briefly show a
 * value that is already out of date. Skipping it is safe, because the write's
 * own success or failure sets the final value either way.
 */
export function useWeekly({ seed = null } = {}) {
  const fetcher = useCallback(({ signal }) => fetchWeekly({ signal }), [])
  const read = useAsyncData(fetcher, { key: 'weekly' })

  const [completed, setCompleted] = useState(Boolean(seed?.completed))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const busyRef = useRef(false)

  // Synced in an effect rather than written during render. Declared before the
  // effect below so it is already current when that one runs.
  useEffect(() => {
    busyRef.current = busy
  }, [busy])

  const answer = read.data
  useEffect(() => {
    if (!answer || busyRef.current) return
    setCompleted(Boolean(answer.completed))
  }, [answer])

  const toggle = useCallback(
    async (contentId) => {
      const next = !completed
      setCompleted(next)
      setBusy(true)
      setError(null)
      try {
        if (next) await completeWeeklyRequest(contentId)
        else await uncompleteWeeklyRequest(contentId)
        return next
      } catch (caught) {
        setCompleted(!next)
        setError(caught)
        throw caught
      } finally {
        setBusy(false)
      }
    },
    [completed],
  )

  const sidequest = answer?.sidequest ?? seed?.sidequest ?? null
  // A failed read still shows the seeded card, so `error` is only surfaced when
  // there is nothing on screen to look at instead.
  const shownError = read.error && !sidequest ? read.error : error

  return {
    sidequest,
    completed,
    busy,
    error: shownError,
    toggle,
    retry: read.retry,
    loading: read.loading && !sidequest,
  }
}

/* ── Saved ───────────────────────────────────────────────────────────────── */

/** Frozen empty list, so the memos below keep a stable identity while loading. */
const NO_SAVED = []

/**
 * The saved list, with an optimistic bookmark toggle.
 *
 * `savedIds` is the shared truth every card reads, so a bookmark filled in on the
 * "Picked for you" shelf is also filled in "Save for later" without the two
 * sections knowing about each other.
 *
 * **Everything on the read side is derived, not stored.** The server's answer
 * plus a small overlay of this session's unconfirmed changes is all the state
 * there is:
 *
 *   - before the first read lands, `localStorage` is the answer, so a bookmark is
 *     already correct on the next visit without waiting for the network;
 *   - once it lands, the server's list is the answer and the overlay is layered
 *     on top, so a confirmed change needs no reconciliation and a rejected one is
 *     undone by deleting its overlay entry.
 *
 * The overlay is never cleared by hand — once the server's list includes a saved
 * id, merging it in changes nothing. A rollback simply removes the entry.
 *
 * `toggle` takes the whole content object, not just its id. The card is already
 * in memory — it was rendered from a response the server sent moments ago — so
 * an optimistic save can be shown as the real card rather than as a placeholder
 * waiting for a second round trip. It still gets replaced by the server's own row
 * when the list is next read, so nothing on screen is ever locally invented.
 */
export function useSavedSidequests({ enabled = true } = {}) {
  const fetcher = useCallback(
    ({ signal }) =>
      fetchSaved({ signal }).then((response) => {
        // Side effect belongs to the arrival of the answer, not to a render.
        syncSavedMirror((response?.saved ?? []).map((entry) => entry.content.id))
        return response
      }),
    [],
  )
  const read = useAsyncData(fetcher, { enabled, key: 'saved' })

  // contentId -> { saved, content? } for this session's unconfirmed changes.
  const [pending, setPending] = useState({})
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState(null)

  const [cached] = useState(() => new Set(getSavedMirror()))

  const remote = read.data?.saved ?? NO_SAVED
  const remoteIds = useMemo(() => new Set(remote.map((entry) => entry.content.id)), [remote])

  const savedIds = useMemo(() => {
    // The overlay applies to whichever base we have. Before the first read lands
    // that is the local mirror — and a bookmark pressed in that window still has
    // to show, which is the whole reason the mirror exists.
    const merged = new Set(read.data ? remoteIds : cached)
    for (const [contentId, change] of Object.entries(pending)) {
      if (change.saved) merged.add(contentId)
      else merged.delete(contentId)
    }
    return merged
  }, [remoteIds, pending, cached, read.data])

  const items = useMemo(() => {
    const rows = remote.filter((entry) => pending[entry.content.id]?.saved === false)
    const added = Object.values(pending)
      .filter((change) => change.saved && change.content && !remoteIds.has(change.content.id))
      .map((change) => ({ content: change.content, savedAt: new Date().toISOString() }))
    return added.length ? [...added, ...rows] : rows
  }, [remote, remoteIds, pending])

  const toggle = useCallback(
    async (content) => {
      const contentId = content?.id
      if (!contentId) return false
      const wasSaved = savedIds.has(contentId)

      // Optimistic in both places: the mirror survives a remount, the overlay
      // re-renders the shelf now.
      mirrorSaved(contentId, !wasSaved)
      setPending((current) => ({ ...current, [contentId]: { saved: !wasSaved, content } }))
      setBusyId(contentId)
      setError(null)

      try {
        if (wasSaved) await unsaveContentRequest(contentId)
        else await saveContentRequest(contentId)
        return !wasSaved
      } catch (caught) {
        // Put both back exactly as they were.
        mirrorSaved(contentId, wasSaved)
        setPending((current) => {
          const next = { ...current }
          delete next[contentId]
          return next
        })
        setError(caught)
        throw caught
      } finally {
        setBusyId(null)
      }
    },
    [savedIds],
  )

  return {
    savedIds,
    items,
    busyId,
    error: error ?? read.error,
    toggle,
    retry: read.retry,
    loading: read.loading,
  }
}
