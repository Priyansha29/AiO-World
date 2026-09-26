/**
 * OrigamiFortuneTeller — the paper object at the centre of the experience.
 *
 * The choreography, in the order the player feels it:
 *
 *   closed  →  wiggle  →  folds spring open  →  (they choose)
 *          →  snaps shut  →  shakes twice  →  spins  →  folds open again
 *          →  a slip rises out of the middle  →  result
 *
 * All of it is CSS 3D transforms plus a handful of Framer Motion values. No
 * canvas, no shader, no GIF. The paper is a real stack of hinged faces: four
 * flaps around a core square, each rotating about the edge it shares with the
 * core, inside a perspective container.
 *
 * A note on the two nested wrappers:
 *   .origami__body  — every Framer-driven value (spin, shake, result scale)
 *   .origami__sway  — the idle wiggle, as a plain CSS animation
 * They are separate elements on purpose: a CSS keyframe animation and an
 * inline `transform` cannot share one element, and the wiggle has to survive
 * being composited with the rest of the motion.
 */
import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useSpring } from 'framer-motion'
import SurpriseChoices from './SurpriseChoices.jsx'
import { BOREDOM, isChoosing } from '../logic/boredomMachine.js'
import { COPY_KICKER, COPY_CORE_IDLE, COPY_CORE_PREVIEW, COPY_PAPER_LABEL } from '../data/surpriseCopy.js'

/** Folds rising open: a little bounce, then settle. */
const OPEN_MOTION = { type: 'spring', stiffness: 150, damping: 14, mass: 1 }
/** Folds snapping shut: fast and firm, like a card being flicked closed. */
const SNAP_MOTION = { type: 'spring', stiffness: 420, damping: 24, mass: 0.7 }

/** Two full turns. Reads as "spun" and lands visually identical to 0°. */
const SPIN_TURNS = 720

/** The shake decays across two oscillations rather than looping mechanically. */
const SHAKE_Z = [0, 1, -1, 0.7, -0.45, 0.2, 0]
const SHAKE_X = [0, -1.3, 1.3, -0.8, 0.5, -0.2, 0]

function OrigamiFortuneTeller({ phase, mood, item, timing, reducedMotion, onPick }) {
  const [hovered, setHovered] = useState(null)

  // 0 = shut, 1 = flat and open. One value drives all four flaps, which is
  // what keeps the paper reading as a single object.
  const openValue = useMotionValue(0)
  const open = useSpring(openValue, OPEN_MOTION)

  const spin = useMotionValue(0)
  const shakeZ = useMotionValue(0)
  const shakeX = useMotionValue(0)
  // 1 = the four folds are part of the object, 0 = they have got out of the
  // way so the result can breathe. One value, so they always leave together.
  const spread = useMotionValue(1)

  // The idle line on the core, fixed for the life of the object so it does not
  // flicker as the folds are hovered.
  const [idleLine] = useState(() => COPY_CORE_IDLE[0])

  const choosing = isChoosing(phase)
  const shuffling = phase === BOREDOM.shuffling
  const revealing = phase === BOREDOM.revealing || phase === BOREDOM.result
  const settled = phase === BOREDOM.result

  // ── Fold open / shut ────────────────────────────────────────────────────
  useEffect(() => {
    const shut = shuffling || phase === BOREDOM.closing || phase === BOREDOM.idle
    const target = shut ? 0 : 1
    if (reducedMotion) {
      openValue.set(target)
      return undefined
    }
    const controls = animate(openValue, target, shut ? SNAP_MOTION : OPEN_MOTION)
    return () => controls.stop()
  }, [phase, shuffling, openValue, reducedMotion])

  // ── The shuffle: snap shut (handled above), shake, then spin ────────────
  // Fractions of the machine's own shuffle budget, so the paper always lands
  // on the same frame the state machine advances — never a beat early or late.
  useEffect(() => {
    if (!shuffling || reducedMotion) return undefined
    const budget = timing.shuffling
    const spinDelay = budget * 0.56
    const spinDuration = Math.max(0.2, (budget - spinDelay) / 1000)
    const shakeDelay = (budget * 0.2) / 1000
    const shakeDuration = Math.max(0.2, (budget * 0.4) / 1000)

    const spinControls = animate(spin, spin.get() + SPIN_TURNS, {
      duration: spinDuration,
      delay: spinDelay / 1000,
      ease: [0.34, 0.02, 0.2, 1],
    })
    const shakeControls = animate(shakeZ, SHAKE_Z, {
      duration: shakeDuration,
      delay: shakeDelay,
      ease: 'easeOut',
    })
    const tiltControls = animate(shakeX, SHAKE_X, {
      duration: shakeDuration,
      delay: shakeDelay,
      ease: 'easeOut',
    })

    return () => {
      spinControls.stop()
      shakeControls.stop()
      tiltControls.stop()
    }
  }, [shuffling, reducedMotion, spin, shakeZ, shakeX, timing])

  // ── Give the space back when the result arrives ─────────────────────────
  // The folds fade out rather than the whole object scaling down: a scaled-down
  // paper would shrink its own type, and the slip still has to be readable.
  useEffect(() => {
    const target = settled ? 0 : 1
    if (reducedMotion) {
      spread.set(target)
      return undefined
    }
    const controls = animate(spread, target, { duration: 0.34, ease: 'easeIn' })
    return () => controls.stop()
  }, [settled, reducedMotion, spread])

  // ── Core copy ───────────────────────────────────────────────────────────
  const coreLine = choosing
    ? (hovered && COPY_CORE_PREVIEW[hovered]) || idleLine
    : COPY_PAPER_LABEL

  const bodyStyle = { rotateY: spin, rotate: shakeZ, rotateX: shakeX }
  // The wiggle only runs while the paper is alive and waiting, and it is a
  // CSS animation so it costs nothing when it is not running.
  const swayProps = choosing || phase === BOREDOM.opening
    ? { className: 'origami__sway origami__sway--alive' }
    : { className: 'origami__sway' }

  return (
    <div className="origami" data-phase={phase}>
      <div className="origami__shadow" aria-hidden="true" />

      <motion.div className="origami__body" style={bodyStyle}>
        <motion.div {...swayProps}>
          <SurpriseChoices
            open={open}
            spread={spread}
            interactive={choosing}
            mood={mood}
            onPick={onPick}
            onHover={setHovered}
          />

          <div className="origami__core">
            <div className="core__paper">
              {/* Closed-state stamp, gone the moment the folds rise. */}
              <AnimatePresence>
                {phase === BOREDOM.opening && (
                  <motion.span
                    key="stamp"
                    className="core__stamp"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.86 }}
                    transition={{ duration: 0.22 }}
                  >
                    {COPY_PAPER_LABEL}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Choosing: the prompt, or a preview of the fold under the cursor. */}
              <AnimatePresence mode="wait">
                {choosing && (
                  <motion.p
                    key={coreLine}
                    className="core__line"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    {coreLine}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Reveal: a fortune slip rises out of the middle of the paper. */}
              <AnimatePresence>
                {revealing && item && (
                  <motion.span
                    key={item.id}
                    className="core__slip"
                    initial={{ opacity: 0, y: 26, rotate: -6, scale: 0.86 }}
                    animate={{ opacity: 1, y: 0, rotate: -1.5, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 210, damping: 17 }}
                  >
                    {COPY_KICKER[item.type]}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* One ring, once, on the reveal. Cheap, and it sells the moment. */}
      <div className="origami__flash" data-on={revealing ? 'true' : 'false'} aria-hidden="true" />
    </div>
  )
}

export default OrigamiFortuneTeller
