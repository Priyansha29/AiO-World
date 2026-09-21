/**
 * GuessWhoPage — placeholder route for the flagship game.
 * The real game ships later; this exists so the Play CTAs and randomizers
 * have a legitimate place to land.
 */
import { useEffect } from 'react'
import Navbar from '../../../components/Navbar'
import GuessWhoBoard from '../components/GuessWhoBoard'
import '../play.css'

const TAGS = ['2 Players', 'Social', 'Strategy']

export default function GuessWhoPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <main className="play-page" id="top">
      <Navbar />
      <div className="play-shell play-shell--thin">
        <a className="play-back" href="#/play">
          <span className="play-back__arrow" aria-hidden="true">
            ←
          </span>
          Back to Play
        </a>

        <section className="play-placeholder">
          <p className="play-eyebrow">
            <span className="play-eyebrow__dot" aria-hidden="true" />
            Playground
          </p>
          <h1 className="play-placeholder__title">Guess Who</h1>
          <p className="play-placeholder__sub">Game coming together…</p>

          <ul className="play-tags play-tags--center" aria-label="Guess Who tags">
            {TAGS.map((tag) => (
              <li key={tag} className="play-tags__item">
                {tag}
              </li>
            ))}
          </ul>

          <div className="play-placeholder__board">
            <GuessWhoBoard label="Design preview" />
          </div>

          <p className="play-placeholder__note">
            Placeholder route — the full game ships after the Play homepage is
            approved.
          </p>
        </section>
      </div>
    </main>
  )
}