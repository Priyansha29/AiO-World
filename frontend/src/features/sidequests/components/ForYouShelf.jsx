/**
 * "Picked for you" — the ranked shelf.
 *
 * Laid out as a horizontal snap rail rather than a grid. It reads as a shelf
 * (which is what it is), it keeps the section from becoming another three-column
 * block, and on a phone a rail swipes where a grid requires two taps to reach
 * the fourth card. The rail is keyboard-reachable and labelled, and because
 * `overflow-x` alone is not focusable, the scroll position is also driven by the
 * arrow keys explicitly.
 *
 * With no interests picked the shelf does not show a random popular six. That
 * would be a lie: "picked for you" implies a reason, and the service's ranking
 * would be falling back to recency. It says what is true and points at the fix.
 */
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import ContentCard from './ContentCard'
import { EmptyState, CardSkeleton, ErrorState } from './States'
import { useForYou } from '../services/use-sidequests'

const ease = [0.25, 0.1, 0.25, 1]

/**
 * @param {{
 *   items: Array<object>,
 *   interestNameFor: (slug: string) => string,
 *   loading: boolean,
 *   error: Error | null,
 *   onRetry: () => void,
 *   hasInterests: boolean,
 *   savedIds: Set<string>,
 *   onSave: (id: string) => void,
 *   saveBusyId?: string | null,
 * }} props
 */
export default function ForYouShelf({
  items,
  interestNameFor,
  loading,
  error,
  onRetry,
  hasInterests,
  savedIds,
  onSave,
  saveBusyId = null,
}) {
  const [expanded, setExpanded] = useState(false)
  const railRef = useRef(null)
  const { data: everything, loading: moreLoading, error: moreError, retry: retryMore } =
    useForYou({ enabled: expanded, limit: 12 })

  /** Arrow-key scrolling, so the rail is usable without a pointer. */
  const onKeyDown = (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    const rail = railRef.current
    if (!rail) return
    event.preventDefault()
    const step = Math.round(rail.clientWidth * 0.8)
    rail.scrollBy({ left: event.key === 'ArrowRight' ? step : -step, behavior: 'smooth' })
  }

  const shown = expanded && everything?.items?.length ? everything.items : items

  return (
    <div className="sq-shelf">
      {error ? (
        <ErrorState onRetry={onRetry} what="your picks" />
      ) : loading ? (
        <CardSkeleton count={4} />
      ) : shown.length === 0 ? (
        hasInterests ? (
          <EmptyState
            title="Nothing here for those yet."
            hint="Try the section below — it is deliberately off-script."
          />
        ) : (
          <EmptyState
            title="Pick a couple of things first."
            hint="Then this shelf has something to be picked from."
          />
        )
      ) : (
        <>
          <div
            className="sq-rail"
            ref={railRef}
            onKeyDown={onKeyDown}
            tabIndex={0}
            role="group"
            aria-label="Picked for you, scrollable"
          >
            {shown.map((item, index) => (
              <motion.div
                className="sq-rail__item"
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.42, ease, delay: Math.min(index, 5) * 0.05 }}
              >
                <ContentCard
                  item={item}
                  saved={savedIds.has(item.id)}
                  saveBusy={saveBusyId === item.id}
                  onSave={onSave}
                  interestName={interestNameFor(item.interestSlug)}
                  showReasons
                />
              </motion.div>
            ))}
          </div>

          <div className="sq-shelf__foot">
            <p className="sq-shelf__note">
              Ranked by what you picked — not by what is trending.
            </p>
            <button
              type="button"
              className="sq-btn sq-btn--quiet"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
            >
              {expanded ? 'Show fewer' : 'Show more'}
            </button>
          </div>

          {expanded && moreError ? (
            <p className="sq-inline-error" role="alert">
              Could not load the rest. <button type="button" onClick={retryMore}>Try again.</button>
            </p>
          ) : null}
          {expanded && moreLoading && !everything ? (
            <CardSkeleton count={3} />
          ) : null}
        </>
      )}
    </div>
  )
}
