import CharacterBoard from './CharacterBoard'

function SecretPicker({ characters, step, onPick, onContinue, onStart }) {
  if (step === 'ready') {
    return (
      <section className="gw-handoff gw-handoff--soft">
        <p className="play-eyebrow">
          <span className="play-eyebrow__dot" aria-hidden="true" />
          Player 1
        </p>
        <h1 className="gw-handoff__title">Player 1 is ready.</h1>
        <p className="gw-handoff__sub">Pass the screen to Player 2.</p>
        <button type="button" className="play-btn play-btn--primary play-btn--big" onClick={onContinue}>
          Continue
          <span className="play-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </section>
    )
  }

  if (step === 'locked') {
    return (
      <section className="gw-handoff gw-handoff--soft">
        <div className="gw-handoff__lock" aria-hidden="true">
          🔒
        </div>
        <h1 className="gw-handoff__title">Both characters locked.</h1>
        <p className="gw-handoff__sub">You're ready to play. Remember to keep your own person secret.</p>
        <button type="button" className="play-btn play-btn--primary play-btn--big" onClick={onStart}>
          Start game
          <span className="play-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </section>
    )
  }

  const player = step === 'p1' ? 'Player 1' : 'Player 2'
  const other = step === 'p1' ? 'Player 2' : 'Player 1'

  return (
    <section className="gw-step">
      <header className="gw-step__head">
        <p className="play-eyebrow">
          <span className="play-eyebrow__dot" aria-hidden="true" />
          {player}
        </p>
        <h1 className="gw-step__title">{player} — Choose your character</h1>
        <p className="gw-step__desc">
          <strong>{other}, look away.</strong> Tap the person you want to be. Your choice stays hidden.
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
