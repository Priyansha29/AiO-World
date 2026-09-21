import { useEffect, useMemo, useState } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import Navbar from '../../../components/Navbar'
import PlayHero from '../components/PlayHero'
import FeaturedGame from '../components/FeaturedGame'
import GameFilters from '../components/GameFilters'
import GameCard from '../components/GameCard'
import BoredCta from '../components/BoredCta'
import { collectionGames, filterGames } from '../data/games'
import '../play.css'

const ease = [0.25, 0.1, 0.25, 1]

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
}

export default function PlayPage() {
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const shown = useMemo(() => filterGames(collectionGames(), filter), [filter])

  return (
    <MotionConfig reducedMotion="user">
      <main className="play-page" id="top">
        <Navbar />
        <div className="play-shell">
          <PlayHero />
          <FeaturedGame />

          <section
            className="play-collection"
            id="pick-something"
            aria-labelledby="play-collection-title"
          >
            <motion.header
              className="play-collection__head"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, ease }}
            >
              <h2 className="play-collection__title" id="play-collection-title">
                Pick something
              </h2>
              <p className="play-collection__sub">No downloads. No setup. Just play.</p>
            </motion.header>

            <GameFilters active={filter} onChange={setFilter} />

            {shown.length > 0 ? (
              <motion.div
                className="play-grid"
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
              >
                {shown.map((game) => (
                  <motion.div key={game.id} variants={itemVariants}>
                    <GameCard game={game} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="play-grid__empty">Nothing in this mood yet — check back soon.</p>
            )}
          </section>

          <BoredCta />
        </div>
      </main>
    </MotionConfig>
  )
}