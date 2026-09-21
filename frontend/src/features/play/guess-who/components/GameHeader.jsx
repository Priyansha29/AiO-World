function GameHeader({ turn, suspectsLeft, questionsAsked, onChangePack }) {
  const p1Active = turn === 'p1'

  return (
    <header className="gw-header">
      <div className="gw-header__top">
        <a className="play-back" href="#/play">
          <span className="play-back__arrow" aria-hidden="true">
            ←
          </span>
          Back to Play
        </a>
        <button type="button" className="gw-textbtn" onClick={onChangePack}>
          Change pack
        </button>
      </div>

      <div className="gw-header__row">
        <h1 className="gw-header__title">GUESS WHO</h1>
        <div className="gw-vs">
          <span className={`gw-vs__side gw-vs__side--p1${p1Active ? ' is-active' : ''}`}>PLAYER 1</span>
          <span className="gw-vs__mark">VS</span>
          <span className={`gw-vs__side gw-vs__side--p2${!p1Active ? ' is-active' : ''}`}>PLAYER 2</span>
        </div>
      </div>

      <div className="gw-header__meta">
        <span className={`gw-turnchip${p1Active ? '' : ' gw-turnchip--p2'}`}>
          {p1Active ? "PLAYER 1'S TURN" : "PLAYER 2'S TURN"}
        </span>
        <span className="gw-chip">Suspects left: {suspectsLeft}</span>
        <span className="gw-chip">Questions asked: {questionsAsked}</span>
      </div>
    </header>
  )
}

export default GameHeader
