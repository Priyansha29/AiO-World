/**
 * Interest circles — "find your people".
 *
 * A circle is a name, a description, an interest, a member count and a join
 * button. That is the entire model, and it is deliberate: there is no member
 * list, no message composer, no post feed, and no endpoint that could return
 * one. Adding chat would need authentication to attribute a message to, and a
 * member list without identity is exactly the leak the domain model warns about.
 * So the feature stops at "you are in a group that exists" and does not pretend
 * to be more.
 *
 * Circles the student has joined sort to the top, so a successful join is
 * visible without a refetch. The member count adjusts optimistically and rolls
 * back on failure.
 */
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { InterestIcon } from './Glyph'
import { CardSkeleton, EmptyState, ErrorState, InlineError } from './States'
import { useCircleMembership, useCircles } from '../services/use-sidequests'

const ease = [0.25, 0.1, 0.25, 1]

/**
 * @param {{
 *   visible: boolean,
 *   seedCircles: Array<object>,
 *   interestNameFor: (slug: string) => string,
 *   interestIconFor: (slug: string) => string,
 * }} props
 */
export default function InterestCircles({
  visible,
  seedCircles,
  interestNameFor,
  interestIconFor,
}) {
  const [filter, setFilter] = useState('all')
  const { data, loading, error, retry } = useCircles({ enabled: visible })
  const { resolve, toggle, retry: retryJoin, busyId, error: joinError } = useCircleMembership()

  const circles = useMemo(() => {
    const list = resolve(data?.circles ?? seedCircles)
    const filtered = filter === 'all' ? list : list.filter((c) => c.interestSlug === filter)
    return [...filtered].sort((a, b) => {
      if (a.joined !== b.joined) return a.joined ? -1 : 1
      return b.memberCount - a.memberCount
    })
  }, [data, seedCircles, resolve, filter])

  // Only offer filters for interests that actually have a circle.
  const options = useMemo(() => {
    const seen = new Map()
    for (const circle of data?.circles ?? seedCircles) {
      if (!seen.has(circle.interestSlug)) seen.set(circle.interestSlug, circle)
    }
    return [...seen.values()].sort((a, b) =>
      interestNameFor(a.interestSlug).localeCompare(interestNameFor(b.interestSlug)),
    )
  }, [data, seedCircles, interestNameFor])

  return (
    <div className="sq-circles">
      {options.length > 1 ? (
        <div className="sq-filters" role="group" aria-label="Filter circles by interest">
          <button
            type="button"
            className={`sq-filter${filter === 'all' ? ' sq-filter--on' : ''}`}
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
          >
            All
          </button>
          {options.map((circle) => (
            <button
              type="button"
              key={circle.id}
              className={`sq-filter${filter === circle.interestSlug ? ' sq-filter--on' : ''}`}
              onClick={() => setFilter(circle.interestSlug)}
              aria-pressed={filter === circle.interestSlug}
            >
              {interestNameFor(circle.interestSlug)}
            </button>
          ))}
        </div>
      ) : null}

      <p className="sq-circles__disclaimer">
        Demo circles. Joining one adds your anonymous id to a count — there is
        no member list, no messaging, and nothing to identify you by.
      </p>

      {error ? (
        <ErrorState onRetry={retry} what="circles" />
      ) : loading && !data && seedCircles.length === 0 ? (
        // The overview seeds a few circles, so before this section's own request
        // lands there is usually something real to show — and a skeleton would be
        // a worse answer than four circles you can already read. Only a section
        // with nothing at all waits.
        <CardSkeleton count={3} />
      ) : circles.length === 0 ? (
        <EmptyState
          title="No circle for that yet."
          hint="Clear the filter to see the rest."
        />
      ) : (
        <ul className="sq-circle-grid">
          {circles.map((circle, index) => (
            <motion.li
              className={`sq-circle${circle.joined ? ' sq-circle--joined' : ''}`}
              key={circle.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.42, ease, delay: Math.min(index, 6) * 0.05 }}
            >
              <p className="sq-circle__kicker">
                <InterestIcon icon={interestIconFor(circle.interestSlug)} size={14} />
                {interestNameFor(circle.interestSlug)}
                {circle.collegeId ? '' : ' · city-wide'}
              </p>
              <h3 className="sq-circle__name">{circle.name}</h3>
              <p className="sq-circle__desc">{circle.description}</p>
              <p className="sq-circle__count">
                {circle.memberCount} {circle.memberCount === 1 ? 'person' : 'people'}
              </p>
              <button
                type="button"
                className={`sq-btn sq-btn--sm ${circle.joined ? 'sq-btn--done' : 'sq-btn--outline'}`}
                onClick={() => toggle(circle, circle.memberCount)}
                disabled={busyId === circle.id}
                aria-pressed={circle.joined}
              >
                {busyId === circle.id ? 'Joining…' : circle.joined ? '✓ In the circle' : 'Join circle'}
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      {joinError ? (
        <InlineError>
          That did not work.{' '}
          <button type="button" onClick={retryJoin}>
            Try again.
          </button>
        </InlineError>
      ) : null}
    </div>
  )
}
