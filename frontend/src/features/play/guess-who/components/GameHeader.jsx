function GameHeader({ suspects, onChangePack }) {
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

      <h1 className="gw-header__title">GUESS WHO</h1>

      <div className="gw-header__meta">
        <span className="gw-turnchip">YOUR TURN</span>
        <span className="gw-chip">{suspects} {suspects === 1 ? 'suspect' : 'suspects'}</span>
      </div>
    </header>
  )
}

export default GameHeader