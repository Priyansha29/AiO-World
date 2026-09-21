import { motion } from 'framer-motion'
import { navigate } from '../../../router/hash-router'
import { pickRandomGame } from '../data/games'

const ease = [0.25, 0.1, 0.25, 1]

function scrollToCollection() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document
    .getElementById('pick-something')
    ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

function PlayHero() {
  const onSurpriseMe = () => {
    const game = pickRandomGame()
    if (game) navigate(game.route)
  }

  return (
    <section className="play-hero">
      <div className="play-hero__deco" aria-hidden="true">
        <span className="play-shape play-shape--circle play-shape--peach" />
        <span className="play-shape play-shape--square play-shape--sand" />
        <span className="play-shape play-shape--qmark">?</span>
        <span className="play-shape play-shape--star">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
            <path d="M12 1.5 14.6 9.4 22.5 12 14.6 14.6 12 22.5 9.4 14.6 1.5 12 9.4 9.4Z" />
          </svg>
        </span>
        <span className="play-shape play-shape--die">
          <span className="play-pip" />
          <span className="play-pip" />
        </span>
      </div>

      <motion.p
        className="play-eyebrow"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        <span className="play-eyebrow__dot" aria-hidden="true" />
        Playground
      </motion.p>

      <motion.h1
        className="play-hero__title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.05 }}
      >
        What do you feel like{' '}
        <span className="play-underline">
          playing?
          <svg className="play-underline__ink" viewBox="0 0 120 14" aria-hidden="true">
            <path
              d="M4 9 C28 4 66 3 116 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </motion.h1>

      <motion.p
        className="play-hero__sub"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease, delay: 0.12 }}
      >
        Quick games, weird challenges and things to do with friends — right in
        your browser.
      </motion.p>

      <motion.div
        className="play-hero__actions"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease, delay: 0.2 }}
      >
        <button type="button" className="play-btn play-btn--primary" onClick={onSurpriseMe}>
          Surprise me
          <span className="play-btn__dice" aria-hidden="true">
            🎲
          </span>
        </button>
        <button type="button" className="play-btn play-btn--ghost" onClick={scrollToCollection}>
          Browse games
        </button>
      </motion.div>
    </section>
  )
}

export default PlayHero