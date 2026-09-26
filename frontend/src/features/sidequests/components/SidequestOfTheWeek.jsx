/**
 * "Sidequest of the Week" — one thing, for the whole ISO week.
 *
 * The pick is chosen by hashing the week number, so everyone sees the same
 * sidequest until Monday and it does not reshuffle on refresh. That determinism
 * is the whole feature: a weekly recommendation that changes when you reload
 * stops being weekly.
 *
 * Completion is a real toggle against the server (`Take the sidequest` →
 * `✓ Completed`) and is optimistic, rolling back if the write fails. It is a
 * single flag with no streak, no counter and no reward — the moment this starts
 * tracking completion over time it becomes a habit tracker, and a habit tracker
 * is the productivity section this must not become.
 */
import { motion } from 'framer-motion'
import ContentVisual from './ContentVisual'
import { Glyph } from './Glyph'
import { InlineError, Skeleton } from './States'
import { contentTypeLabel, difficultyLabel, hasDifficulty } from '../domain/sidequest-types'

const ease = [0.25, 0.1, 0.25, 1]

/**
 * @param {{
 *   sidequest: object | null,
 *   completed: boolean,
 *   busy: boolean,
 *   error: Error | null,
 *   onToggle: (id: string) => void,
 *   loading?: boolean,
 * }} props
 */
export default function SidequestOfTheWeek({
  sidequest,
  completed,
  busy,
  error,
  onToggle,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="sq-week" aria-hidden="true">
        <Skeleton height="10rem" radius="var(--radius-lg)" />
        <Skeleton height="1.4rem" width="60%" />
        <Skeleton height="0.8rem" width="80%" />
      </div>
    )
  }

  if (!sidequest) {
    return (
      <div className="sq-week sq-week--empty" role="status">
        <p className="sq-week__absent">No sidequest this week. Enjoy the gap.</p>
      </div>
    )
  }

  return (
    <motion.div
      className={`sq-week${completed ? ' sq-week--done' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="sq-week__body">
        <p className="sq-week__kicker">
          <span className="sq-week__badge">This week</span>
          <span>{contentTypeLabel(sidequest.type)}</span>
        </p>

        <h3 className="sq-week__title">{sidequest.title}</h3>
        <p className="sq-week__desc">{sidequest.description}</p>

        {sidequest.pitch ? <p className="sq-week__pitch">{sidequest.pitch}</p> : null}

        <ul className="sq-week__facts">
          {hasDifficulty(sidequest) ? (
            <li>
              <Glyph name="flag" size={13} /> {difficultyLabel(sidequest.difficulty)}
            </li>
          ) : null}
          {sidequest.duration ? (
            <li>
              <Glyph name="controller" size={13} /> {sidequest.duration}
            </li>
          ) : null}
          {sidequest.sourceName ? (
            <li>
              <Glyph name="guide" size={13} /> {sidequest.sourceName}
            </li>
          ) : null}
        </ul>

        <div className="sq-week__foot">
          <button
            type="button"
            className={`sq-btn ${completed ? 'sq-btn--done' : 'sq-btn--primary'}`}
            onClick={() => onToggle(sidequest.id)}
            disabled={busy}
            aria-pressed={completed}
          >
            <Glyph name={completed ? 'sparkle' : 'flag'} size={15} />
            <span>{busy ? 'Saving…' : completed ? '✓ Completed' : 'Take the sidequest'}</span>
          </button>
          <p className="sq-week__note">Same pick for everyone, until Monday.</p>
        </div>

        {error ? <InlineError>Could not update that. Try again.</InlineError> : null}
      </div>

      <div className="sq-week__art" aria-hidden="true">
        <ContentVisual item={sidequest} size="lg" />
      </div>
    </motion.div>
  )
}
