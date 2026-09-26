/**
 * The opening statement.
 *
 * Copy is the brief's, near-verbatim, because it is the section's thesis:
 * "THE OTHER SIDE OF STUDENT LIFE" as a wide-tracked eyebrow, "Got a life
 * outside college?" as the headline, and the two ways in beneath it.
 *
 * "Explore my interests" is a real anchor into the interest picker further down
 * the page — not a scroll-to-top or a dead button. "Surprise me" pulls a single
 * card from the discovery endpoint and hands it to `onSurprise`, which scrolls
 * to that section, so the button does the one thing the label promises.
 *
 * The four blocks below the headline each arrive on a short fade-and-rise. They
 * are transform and opacity only, so `MotionConfig reducedMotion="user"` on the
 * page removes them for anyone who asked for less motion and the copy is simply
 * there from the first frame.
 */
import { motion } from 'framer-motion'
import { Glyph } from './Glyph'

const ease = [0.25, 0.1, 0.25, 1]

/** Kept as one string so the headline can never drift out of sync with itself. */
const TITLE = 'Got a life outside college?'

/** The five shelves, as the legend under the buttons. */
const SHELVES = [
  { icon: 'run', label: 'Move' },
  { icon: 'guitar', label: 'Create' },
  { icon: 'compass', label: 'Explore' },
  { icon: 'bowl', label: 'Unwind' },
  { icon: 'flag', label: 'Discover' },
]

/**
 * @param {{ onSurprise?: () => void, surpriseBusy?: boolean }} props
 */
export default function SidequestsHero({ onSurprise, surpriseBusy = false }) {
  return (
    <header className="sq-hero" id="top">
      <motion.p
        className="sq-hero__eyebrow"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        The other side of student life
      </motion.p>

      <h1 className="sq-hero__title">{TITLE}</h1>

      <motion.p
        className="sq-hero__sub"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.2 }}
      >
        No syllabus. No deadlines. Just the things you would do anyway, if
        somebody ever handed you the time.
      </motion.p>

      <motion.div
        className="sq-hero__actions"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.28 }}
      >
        <a className="sq-btn sq-btn--primary" href="#your-interests">
          Explore my interests
        </a>
        <button
          type="button"
          className="sq-btn sq-btn--ghost sq-btn--surprise"
          onClick={onSurprise}
          disabled={surpriseBusy}
        >
          <Glyph name="sparkle" size={16} />
          <span>{surpriseBusy ? 'Finding one…' : 'Surprise me'}</span>
        </button>
      </motion.div>

      {/* A quiet strip of the five shelves. Decorative: it names the categories,
          and the picker below is the thing you can actually use. */}
      <motion.ul
        className="sq-hero__shelves"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease, delay: 0.36 }}
        aria-label="What lives here"
      >
        {SHELVES.map((shelf) => (
          <li key={shelf.icon}>
            <Glyph name={shelf.icon} size={17} />
            <span>{shelf.label}</span>
          </li>
        ))}
      </motion.ul>
    </header>
  )
}
