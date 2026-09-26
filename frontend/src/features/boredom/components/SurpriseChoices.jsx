/**
 * SurpriseChoices — the four folds of the paper.
 *
 * These are not buttons that happen to sit near the origami; they ARE the
 * origami. Each one is a paper flap hinged to the core square, and closing the
 * machine is literally these four faces folding down over the middle. That is
 * why the labels live on the flap fronts: when the paper is open you read
 * them, and when it snaps shut the labels foreshorten away with the paper and
 * you are left holding a blank folded square.
 *
 * All four folds read from one shared spring, so they can never move out of
 * sync with each other or with the machine's phase.
 */
import { memo } from 'react'
import { motion, useTransform } from 'framer-motion'
import { SURPRISE_MOODS, MOOD_FOLD } from '../domain/surpriseTypes.js'

/**
 * Fold angle when shut, in degrees. Not 90° — a real flap covering the core
 * sits a few degrees off flat so you still catch a sliver of its face, which
 * is what stops it reading as a div that vanished.
 */
const SHUT_ANGLE = 76

/** Each fold hinges on the edge it shares with the core, folding toward you. */
const HINGE = {
  top: { axis: 'rotateX', sign: -1 },
  bottom: { axis: 'rotateX', sign: 1 },
  left: { axis: 'rotateY', sign: 1 },
  right: { axis: 'rotateY', sign: -1 },
}

function Fold({ mood, fold, open, spread, interactive, selected, onPick, onHover }) {
  const { axis, sign } = HINGE[fold]
  const angle = useTransform(open, (value) => sign * (1 - value) * SHUT_ANGLE)
  // A hair of lift when open, so the flaps read as separate sheets of card
  // rather than one flat cross.
  const depth = useTransform(open, (value) => value * 6)

  return (
    <motion.button
      type="button"
      className="flap"
      data-fold={fold}
      data-mood={mood.id}
      data-selected={selected ? 'true' : undefined}
      style={{ [axis]: angle, translateZ: depth, opacity: spread }}
      disabled={!interactive}
      tabIndex={interactive ? 0 : -1}
      aria-label={mood.full}
      onClick={() => onPick(mood.id)}
      onMouseEnter={() => onHover(mood.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(mood.id)}
      onBlur={() => onHover(null)}
    >
      <span className="flap__sheet">
        <span className="flap__face" aria-hidden="true">
          <span className="flap__crease" />
          <span className="flap__label">
            <span className="flap__words">
              <span>{mood.short[0]}</span>
              <span>{mood.short[1]}</span>
            </span>
          </span>
        </span>
      </span>
    </motion.button>
  )
}

function SurpriseChoices({ open, spread, interactive, mood, onPick, onHover }) {
  return (
    <div className="origami__folds" role="group" aria-label="Pick a surprise">
      {SURPRISE_MOODS.map((option) => (
        <Fold
          key={option.id}
          mood={option}
          fold={MOOD_FOLD[option.id]}
          open={open}
          spread={spread}
          interactive={interactive}
          selected={mood === option.id}
          onPick={onPick}
          onHover={onHover}
        />
      ))}
    </div>
  )
}

export default memo(SurpriseChoices)
