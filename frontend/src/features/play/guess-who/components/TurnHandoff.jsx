function TurnHandoff({ onReady }) {
  return (
    <section className="gw-handoff gw-handoff--pass">
      <p className="play-eyebrow">
        <span className="play-eyebrow__dot" aria-hidden="true" />
        Pass the screen
      </p>
      <h1 className="gw-handoff__title">Give the screen to the other player.</h1>
      <p className="gw-handoff__sub">Make sure your character is hidden before continuing.</p>
      <button type="button" className="play-btn play-btn--primary play-btn--big" onClick={onReady}>
        I'm ready
        <span className="play-arrow" aria-hidden="true">
          →
        </span>
      </button>
    </section>
  )
}

export default TurnHandoff
