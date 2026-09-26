/**
 * SurpriseControls — what you can do once a surprise has landed.
 *
 * "Give me another" is the loud button on purpose: the whole point of the
 * feature is the second, third and fourth click. "I'm done" is deliberately
 * quieter and always present, because an experience that traps you is a bug
 * even if it is a fun one.
 */
import { motion } from 'framer-motion'
import { COPY_AGAIN, COPY_DONE, COPY_RETURNING } from '../data/surpriseCopy.js'

const EASE = [0.22, 0.61, 0.36, 1]

/** A hover lift. `MotionConfig reducedMotion="user"` drops transforms for us. */
const HOVER_LIFT = { y: -2 }

export default function SurpriseControls({ onAgain, onDone, runCount }) {
  return (
    <motion.div
      className="controls"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.45, ease: EASE }}
    >
      <motion.button
        type="button"
        className="controls__again"
        onClick={onAgain}
        whileHover={HOVER_LIFT}
        whileTap={{ scale: 0.97 }}
      >
        <span className="controls__again-label">{COPY_AGAIN}</span>
        {runCount > 0 && <span className="controls__again-sub">{COPY_RETURNING}</span>}
      </motion.button>

      <button type="button" className="controls__done" onClick={onDone}>
        {COPY_DONE}
      </button>
    </motion.div>
  )
}
