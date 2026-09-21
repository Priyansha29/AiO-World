function SettleScreen({ guessName, onWon, onLost }) {
  return (
    <section className="gw-handoff">
      <p className="play-eyebrow">
        <span className="play-eyebrow__dot" aria-hidden="true" />
        Guess Who
      </p>
      <h1 className="gw-handoff__title">Your guess</h1>
      <p className="gw-settle__who">{guessName || 'Your guess'}</p>
      <p className="gw-handoff__sub">Ask your opponent if you got it.</p>
      <div className="gw-handoff__actions">
        <button type="button" className="play-btn play-btn--primary play-btn--big" onClick={onWon}>
          I won 🎉
        </button>
        <button type="button" className="play-btn play-btn--ghost play-btn--big" onClick={onLost}>
          I guessed wrong
        </button>
      </div>
    </section>
  )
}

export default SettleScreen