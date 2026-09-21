function ReadyScreen({ onStart }) {
  return (
    <section className="gw-handoff">
      <p className="play-eyebrow">
        <span className="play-eyebrow__dot" aria-hidden="true" />
        Guess Who
      </p>
      <h1 className="gw-handoff__title">Pick a person secretly</h1>
      <p className="gw-handoff__sub">
        Pick a person secretly, then try to figure out who your opponent picked.
      </p>
      <p className="gw-handoff__hint">Since you&rsquo;re sharing one screen, keep your secret choice off the board.</p>
      <button type="button" className="play-btn play-btn--primary play-btn--big" onClick={onStart}>
        Start game
        <span className="play-arrow" aria-hidden="true">
          →
        </span>
      </button>
    </section>
  )
}

export default ReadyScreen