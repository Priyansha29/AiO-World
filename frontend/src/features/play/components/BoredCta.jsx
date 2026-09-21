import { navigate } from '../../../router/hash-router'
import { availableGames, pickRandomGame } from '../data/games'

function BoredCta() {
  const nothingReady = availableGames().length === 0

  const onBored = () => {
    const game = pickRandomGame()
    if (game) navigate(game.route)
  }

  return (
    <section className="play-bored" aria-labelledby="bored-title">
      <div className="play-bored__deco" aria-hidden="true">
        <span className="play-shape play-shape--qmark play-shape--mini" style={{ top: 18, left: 24 }}>
          ?
        </span>
        <span className="play-shape play-shape--qmark play-shape--mini" style={{ bottom: 16, right: 28 }}>
          ?
        </span>
        <span className="play-shape play-shape--die play-shape--mini" style={{ top: 26, right: 64 }}>
          <span className="play-pip" />
          <span className="play-pip" />
        </span>
      </div>

      <h2 className="play-bored__title" id="bored-title">
        Don't know what to play?
      </h2>
      <p className="play-bored__sub">We'll pick something for you.</p>
      <button
        type="button"
        className="play-btn play-btn--primary play-btn--big"
        onClick={onBored}
        disabled={nothingReady}
      >
        <span className="play-btn__dice" aria-hidden="true">
          🎲
        </span>
        I'm bored
      </button>
    </section>
  )
}

export default BoredCta