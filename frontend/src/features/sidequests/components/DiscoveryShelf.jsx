/**
 * "Discover something new" — the deliberately off-script section.
 *
 * One card at a time, because the point is not a shelf you browse but a
 * commitment you make: read this, or roll again. A grid here would turn it back
 * into a feed.
 *
 * The replacement cross-fades rather than collapsing to a skeleton between
 * presses, so the section does not blink every time somebody hits the button.
 * The outgoing card stays mounted while it leaves, which also means it is still
 * readable rather than vanishing.
 *
 * The band is surfaced. The server rolls 70% on-interest / 20% adjacent / 10%
 * unexpected, and saying which one you got is more interesting than pretending
 * every result is a coincidence — it teaches that the occasional left-field card
 * is deliberate.
 *
 * Presentational on purpose: `useDiscover` is called by the page, so the hero's
 * "Surprise me" and this section's "Give me another" are the same action against
 * the same state.
 */
import { AnimatePresence, motion } from 'framer-motion'
import ContentCard from './ContentCard'
import { InlineError } from './States'
import { Glyph } from './Glyph'

const ease = [0.25, 0.1, 0.25, 1]

const BAND_COPY = {
  onInterest: 'Close to what you picked',
  adjacent: 'One step sideways',
  unexpected: 'Completely off-script',
}

/**
 * @param {{
 *   item: object | null,
 *   band: string | null,
 *   loading: boolean,
 *   error: Error | null,
 *   presses: number,
 *   onShuffle: () => void,
 *   interestNameFor: (slug: string) => string,
 *   savedIds: Set<string>,
 *   onSave: (id: string) => void,
 *   saveBusyId?: string | null,
 * }} props
 */
export default function DiscoveryShelf({
  item,
  band,
  loading,
  error,
  presses,
  onShuffle,
  interestNameFor,
  savedIds,
  onSave,
  saveBusyId = null,
}) {
  return (
    <div className="sq-discover">
      <div className="sq-discover__stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item?.id ?? 'empty'}
            className="sq-discover__card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.36, ease }}
          >
            {item ? (
              <ContentCard
                item={item}
                size="lead"
                saved={savedIds.has(item.id)}
                saveBusy={saveBusyId === item.id}
                onSave={onSave}
                interestName={interestNameFor(item.interestSlug)}
              />
            ) : (
              <p className="sq-discover__waiting">
                Finding something you would not have picked…
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {loading ? (
          <div className="sq-discover__busy" role="status">
            <span className="sq-discover__spinner" aria-hidden="true" />
            <span className="sq-sr-only">Finding another one…</span>
          </div>
        ) : null}
      </div>

      <div className="sq-discover__foot">
        <p className="sq-discover__band">
          {band ? BAND_COPY[band] ?? BAND_COPY.adjacent : 'Mostly near your interests'}
          {presses > 0 ? (
            <span className="sq-discover__count"> · {presses + 1} so far</span>
          ) : null}
        </p>

        <button type="button" className="sq-btn sq-btn--primary" onClick={onShuffle} disabled={loading}>
          <Glyph name="sparkle" size={15} />
          <span>{loading ? 'Finding one…' : 'Give me another'}</span>
        </button>
      </div>

      {error ? (
        <InlineError>
          Could not fetch another one.{' '}
          <button type="button" onClick={onShuffle}>
            Try again.
          </button>
        </InlineError>
      ) : null}
    </div>
  )
}
