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
      <p className="gw-start__helper">
        One screen, two players. Best played over a voice call or while sharing your screen.
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
