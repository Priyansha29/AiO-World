/**
 * SurpriseReveal — renders a surprise item.
 *
 * Each content type gets its own layout on purpose. A fact, a game, a guided
 * activity and a film recommendation want genuinely different shapes, and
 * forcing them into one card is what makes these things feel like widgets.
 *
 * The staggered `lines` are the one shared gesture: the result assembles a
 * sentence at a time, so the payoff arrives in pieces instead of all at once.
 */
import { motion } from 'framer-motion'
import { SURPRISE_TYPE } from '../domain/surpriseTypes.js'

const EASE = [0.22, 0.61, 0.36, 1]

/** Lines arrive one at a time, the last one settling a beat later. */
function Lines({ lines }) {
  return (
    <div className="reveal__lines">
      {lines.map((line, index) => (
        <motion.p
          key={line}
          className="reveal__line"
          initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.42,
            delay: 0.06 * index,
            ease: EASE,
          }}
        >
          {line}
        </motion.p>
      ))}
    </div>
  )
}

/**
 * A four-count breathing loop: in, hold, out, hold. Pure CSS, so it costs
 * nothing and it disappears with the element — no timer to leak.
 */
function BreathCircle() {
  return (
    <div className="breath" aria-hidden="true">
      <span className="breath__ring" />
      <span className="breath__core" />
      <span className="breath__caption">4 in · 4 hold · 4 out · 4 hold</span>
    </div>
  )
}

function FactReveal({ item }) {
  return (
    <>
      <Lines lines={item.lines} />
      {item.link && (
        <motion.a
          className="reveal__action reveal__action--link"
          href={item.link.href}
          target="_blank"
          rel="noreferrer noopener"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 * item.lines.length + 0.1, duration: 0.4, ease: EASE }}
        >
          {item.link.label}
          <span aria-hidden="true"> →</span>
        </motion.a>
      )}
    </>
  )
}

function PromptReveal({ item }) {
  return (
    <>
      <Lines lines={item.lines} />
      {item.options && (
        <motion.div
          className="reveal__options"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 * item.lines.length + 0.1, duration: 0.4, ease: EASE }}
        >
          {item.options.map((option) => (
            <span key={option} className="reveal__option">
              {option}
            </span>
          ))}
        </motion.div>
      )}
    </>
  )
}

function GameReveal({ item, onDepart }) {
  return (
    <>
      <motion.h3
        className="reveal__title"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {item.title}
      </motion.h3>
      <motion.p
        className="reveal__blurb"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45, ease: EASE }}
      >
        {item.blurb}
      </motion.p>
      <motion.button
        type="button"
        className="reveal__action reveal__action--primary"
        onClick={() => onDepart(item.route)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.45, ease: EASE }}
      >
        Play it
        <span aria-hidden="true"> →</span>
      </motion.button>
    </>
  )
}

function ActivityReveal({ item }) {
  return (
    <>
      <motion.div
        className="reveal__headline"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <span className="reveal__chip">{item.duration}</span>
        <h3 className="reveal__title">{item.title}</h3>
      </motion.div>

      {item.player === 'breathing' && (
        <motion.div
          className="reveal__player"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.5, ease: EASE }}
        >
          <BreathCircle />
        </motion.div>
      )}

      <motion.ol
        className="reveal__steps"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
      >
        {item.steps.map((step, index) => (
          <motion.li
            key={step}
            className="reveal__step"
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.36, ease: EASE } },
            }}
          >
            <span className="reveal__step-num" aria-hidden="true">
              {index + 1}
            </span>
            <span>{step}</span>
          </motion.li>
        ))}
      </motion.ol>
    </>
  )
}

const MEDIA_VERB = {
  [SURPRISE_TYPE.read]: 'Read it',
  [SURPRISE_TYPE.watch]: 'Watch it',
  [SURPRISE_TYPE.listen]: 'Listen',
}

function MediaReveal({ item }) {
  return (
    <>
      <motion.p
        className="reveal__eyebrow"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {item.meta}
      </motion.p>
      <motion.h3
        className="reveal__title"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.45, ease: EASE }}
      >
        {item.title}
      </motion.h3>
      <motion.p
        className="reveal__blurb"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.45, ease: EASE }}
      >
        {item.blurb}
      </motion.p>
      <motion.a
        className="reveal__action reveal__action--primary"
        href={item.href}
        target="_blank"
        rel="noreferrer noopener"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45, ease: EASE }}
      >
        {MEDIA_VERB[item.type]}
        <span aria-hidden="true"> ↗</span>
      </motion.a>
    </>
  )
}

export default function SurpriseReveal({ item, onDepart }) {
  const depart = (route) => onDepart?.(route)

  return (
    <motion.div
      className="reveal"
      key={item.id}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {item.type === SURPRISE_TYPE.fact && <FactReveal item={item} />}
      {item.type === SURPRISE_TYPE.prompt && <PromptReveal item={item} />}
      {item.type === SURPRISE_TYPE.game && <GameReveal item={item} onDepart={depart} />}
      {item.type === SURPRISE_TYPE.activity && <ActivityReveal item={item} />}
      {(item.type === SURPRISE_TYPE.read ||
        item.type === SURPRISE_TYPE.watch ||
        item.type === SURPRISE_TYPE.listen) && <MediaReveal item={item} />}
    </motion.div>
  )
}
