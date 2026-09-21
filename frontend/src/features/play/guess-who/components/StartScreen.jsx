function StartScreen({ onStart }) {
  return (
    <section className="gw-start">
      <p className="play-eyebrow">
        <span className="play-eyebrow__dot" aria-hidden="true" />
        Play
      </p>
      <h1 className="gw-start__title">GUESS WHO</h1>
      <p className="gw-start__tag">Think you know them?</p>
      <p className="gw-start__desc">
        Pick your characters, ask clever questions, and eliminate the impossible.
      </p>

      <div className="gw-vs gw-vs--big" aria-label="Player 1 versus Player 2">
        <span className="gw-vs__side gw-vs__side--p1">PLAYER 1</span>
        <span className="gw-vs__mark">VS</span>
        <span className="gw-vs__side gw-vs__side--p2">PLAYER 2</span>
      </div>

      <p className="gw-start__helper">
        Best played over a voice call or while sharing your screen.
      </p>

      <div className="gw-start__actions">
        <button type="button" className="play-btn play-btn--primary play-btn--big" onClick={onStart}>
          Start game
          <span className="play-arrow" aria-hidden="true">
            →
          </span>
        </button>
        <a className="play-btn play-btn--ghost" href="#/play">
          <span className="play-back__arrow" aria-hidden="true">
            ←
          </span>
          Back to Play
        </a>
      </div>
    </section>
  )
}

export default StartScreen
