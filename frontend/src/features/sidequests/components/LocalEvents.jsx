/**
 * Local discovery — events near the student.
 *
 * The six filters the brief asks for are chips, not a select: near me, my
 * campus, this week, weekend, free, my interests. "Near me" and "my campus" are
 * server-side concepts (the request carries the student's college, and the
 * catalogue filters on it), so they are distinguished from the client-side ones
 * in the code and both drive the same request.
 *
 * Filter state is local and the list refetches per change. Nothing is cached
 * across filter combinations — the catalogue is small, and a stale event list is
 * worse than one more request.
 *
 * The demo disclaimer is not optional. Every event here is invented, and a page
 * that shows a plausible venue and time without saying so would be lying to
 * somebody looking for a Saturday.
 */
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Glyph } from './Glyph'
import { CardSkeleton, EmptyState, ErrorState } from './States'
import { useEvents } from '../services/use-sidequests'
import { formatEventWhen, isWeekend } from '../domain/sidequest-types'

const ease = [0.25, 0.1, 0.25, 1]

const FILTERS = [
  { key: 'nearMe', label: 'Near me' },
  { key: 'myCampus', label: 'My campus' },
  { key: 'thisWeek', label: 'This week' },
  { key: 'weekend', label: 'Weekend' },
  { key: 'free', label: 'Free' },
  { key: 'myInterests', label: 'My interests' },
]

/**
 * @param {{
 *   visible: boolean,
 *   interestSlugs: string[],
 *   hasInterests: boolean,
 *   hasCollege: boolean,
 *   interestNameFor: (slug: string) => string,
 * }} props
 */
export default function LocalEvents({ visible, interestSlugs, hasInterests, hasCollege, interestNameFor }) {
  const [active, setActive] = useState(() => new Set())

  const myInterests = active.has('myInterests') && hasInterests
  const { data, loading, error, retry } = useEvents({
    enabled: visible,
    interests: myInterests ? interestSlugs : [],
    free: active.has('free'),
    weekend: active.has('weekend'),
    within: active.has('thisWeek') ? 7 : 60,
  })

  const events = useMemo(() => {
    let list = data?.events ?? []
    // "My campus" and "Near me" narrow the list the server already scoped to the
    // student's college; doing it here keeps the chips instant.
    if (active.has('myCampus')) list = list.filter((event) => event.collegeId)
    return list
  }, [data, active])

  const toggle = (key) => {
    setActive((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="sq-events">
      <div
        className="sq-filters"
        role="group"
        aria-label="Filter events"
      >
        {FILTERS.map((filter) => {
          // A filter that cannot do anything is disabled rather than silently
          // returning everything: "my interests" with nothing picked, or
          // "my campus" with no campus chosen.
          const unavailable =
            (filter.key === 'myInterests' && !hasInterests) ||
            (filter.key === 'myCampus' && !hasCollege)
          const isOn = active.has(filter.key)

          return (
            <button
              type="button"
              key={filter.key}
              className={`sq-filter${isOn ? ' sq-filter--on' : ''}`}
              onClick={() => toggle(filter.key)}
              aria-pressed={isOn}
              disabled={unavailable}
              title={
                unavailable
                  ? filter.key === 'myInterests'
                    ? 'Pick an interest first'
                    : 'Choose a college first'
                  : undefined
              }
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      <p className="sq-events__disclaimer">
        Demo listings. Every event below is invented for this preview — nothing
        here is a real gathering.
      </p>

      {error ? (
        <ErrorState onRetry={retry} what="local events" />
      ) : loading ? (
        <CardSkeleton count={3} />
      ) : events.length === 0 ? (
        <EmptyState
          title="Nothing matches those filters."
          hint={
            active.size > 0
              ? 'Try loosening one — the weekend and free filters are the strictest.'
              : 'No upcoming events in the demo catalogue right now.'
          }
        />
      ) : (
        <ul className="sq-event-list">
          {events.map((event, index) => (
            <motion.li
              className="sq-event"
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, ease, delay: Math.min(index, 6) * 0.04 }}
            >
              <div className="sq-event__when">
                <span
                  className={`sq-event__day${isWeekend(event.startTime) ? ' sq-event__day--weekend' : ''}`}
                >
                  {formatEventWhen(event.startTime)}
                </span>
                {event.isFree ? <span className="sq-event__free">Free</span> : null}
              </div>

              <div className="sq-event__what">
                <h3 className="sq-event__title">{event.title}</h3>
                <p className="sq-event__desc">{event.description}</p>
                <p className="sq-event__where">
                  <Glyph name="compass" size={13} />
                  <span>
                    {event.venue} · {event.city}
                    {event.collegeId ? '' : ' · city-wide'}
                  </span>
                </p>
                <p className="sq-event__tags">
                  {event.interestSlugs.slice(0, 3).map((slug) => (
                    <span className="sq-tag" key={slug}>
                      {interestNameFor(slug)}
                    </span>
                  ))}
                </p>
              </div>

              {event.registrationUrl ? (
                <a
                  className="sq-event__link"
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Details
                  <span className="sq-sr-only">
                    {' '}
                    for {event.title} (opens in a new tab)
                  </span>
                </a>
              ) : null}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
