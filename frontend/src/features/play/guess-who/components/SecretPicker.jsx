import CharacterBoard from './CharacterBoard'

function SecretPicker({ characters, step, onPick, onConfirm, onPassReady, onStart }) {
  if (step === 'locked-a') {
    return (
      <section className="gw-handoff gw-handoff--soft">
        <div className="gw-handoff__lock" aria-hidden="true">
          🔒
        </div>
        <h1 className="gw-handoff__title">Character locked.</h1>
        <p className="gw-handoff__sub">Keep it to yourself — the other player mustn't see it.</p>
        <button type="button" className="play-btn play-btn--primary play-btn--big" onClick={onConfirm}>
          Continue
          <span className="play-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </section>
    )
  }

  if (step === 'pass') {
    return (
      <section className="gw-handoff gw-handoff--pass">
        <p className="play-eyebrow">
          <span className="play-eyebrow__dot" aria-hidden="true" />
          Pass the screen
        </p>
        <h1 className="gw-handoff__title">Give the screen to the other player.</h1>
        <p className="gw-handoff__sub">Make sure your character stays secret.</p>
        <button type="button" className="play-btn play-btn--primary play-btn--big" onClick={onPassReady}>
          I'm ready
          <span className="play-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </section>
    )
  }

  if (step === 'both') {
    return (
      <section className="gw-handoff gw-handoff--soft">
        <div className="gw-handoff__lock" aria-hidden="true">
          🔒
        </div>
        <h1 className="gw-handoff__title">Both characters are locked.</h1>
        <p className="gw-handoff__sub">You're ready to play. Keep your own person secret.</p>
        <button type="button" className="play-btn play-btn--primary play-btn--big" onClick={onStart}>
          Start game
          <span className="play-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </section>
    )
  }

  return (
    <section className="gw-step">
      <header className="gw-step__head">
        <p className="play-eyebrow">
          <span className="play-eyebrow__dot" aria-hidden="true" />
          Guess Who
        </p>
        <h1 className="gw-step__title">Choose your character</h1>
        <p className="gw-step__desc">
          <strong>Make sure the other player isn't looking.</strong> Tap the person you want to be — your
          choice stays hidden.
        </p>
      </header>

      <CharacterBoard
        characters={characters}
        mode="guess"
        onAction={(character) => onPick(character.id)}
      />
    </section>
  )
}

export default SecretPicker
