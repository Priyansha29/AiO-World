function GuessDialog({ selected, confirmed, onConfirm, onFinal, onKeepLooking, onCancel }) {
  if (confirmed) {
    return (
      <section className="gw-panel gw-guess" role="alertdialog" aria-labelledby="gw-sure-title">
        <h2 id="gw-sure-title" className="gw-guess__title">
          Make this your final guess?
        </h2>
        <p className="gw-guess__sub">
          You think it's <strong>{selected ? selected.name : 'them'}</strong>. This ends the game.
        </p>
        <div className="gw-guess__actions">
          <button type="button" className="play-btn play-btn--primary" onClick={onFinal}>
            Yes, guess
          </button>
          <button type="button" className="play-btn play-btn--ghost" onClick={onKeepLooking}>
            Keep looking
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="gw-panel gw-guess" aria-labelledby="gw-guess-title">
      <h2 id="gw-guess-title" className="gw-guess__title">
        Who do you think it is?
      </h2>
      <p className="gw-guess__sub">
        {selected ? `Selected: ${selected.name}` : 'Select a character on the board below.'}
      </p>
      <div className="gw-guess__actions">
        <button type="button" className="play-btn play-btn--primary" disabled={!selected} onClick={onConfirm}>
          Confirm final guess
        </button>
        <button type="button" className="play-btn play-btn--ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </section>
  )
}

export default GuessDialog
