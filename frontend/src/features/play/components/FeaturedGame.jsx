import { motion } from 'framer-motion'
import { featuredGame } from '../data/games'
import GuessWhoBoard from './GuessWhoBoard'

const ease = [0.25, 0.1, 0.25, 1]

function FeaturedGame() {
  const game = featuredGame()
  if (!game) return null

  const tags = [game.players, ...game.tags].filter(Boolean)

  return (
    <section className="play-featured" aria-labelledby="featured-game-title">
      <motion.div
        className="play-featured__card"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="play-featured__copy">
          <span className="play-featured__flag">Featuring</span>
          <h2 id="featured-game-title">{game.title}</h2>
          <p>{game.description}</p>
          <ul className="play-tags" aria-label={`${game.title} tags`}>
            {tags.map((tag) => (
              <li key={tag} className="play-tags__item">
                {tag}
              </li>
            ))}
          </ul>
          <a className="play-btn play-btn--primary play-featured__cta" href={game.route}>
            Play {game.title}
            <span className="play-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>

        <GuessWhoBoard />

        <span className="play-featured__sticker" aria-hidden="true">
          <b>2</b>
          Players
        </span>
      </motion.div>
    </section>
  )
}

export default FeaturedGame