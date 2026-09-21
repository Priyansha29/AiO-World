function GameResult({ result, onPlayAgain, onChangePack }) {
  const won = result.won

  return (
    <section className={`gw-result${won ? ' gw-result--won' : ' gw-result--lost'}`}>
      <p className="play-eyebrow">
        <span className="play-eyebrow__dot" aria-hidden="true" />
        Guess Who
      </p>
      <h1 className="gw-result__title">{won ? 'YOU GOT THEM 🎉' : 'NOT THIS TIME'}</h1>
      <p className="gw-result__sub">{won ? 'Nice deduction.' : 'Better luck next round.'}</p>

      <div className="gw-result__actions">
        <button type="button" className="play-btn play-btn--primary play-btn--big" onClick={onPlayAgain}>
          Play again
        </button>
        <a className="play-btn play-btn--ghost" href="#/play">
          Back to Play
        </a>
        <button type="button" className="gw-textbtn" onClick={onChangePack}>
          Change pack
        </button>
      </div>
    </section>
  )
}

export default GameResult