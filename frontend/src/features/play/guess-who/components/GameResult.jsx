import { initialsFor } from '../data/packs'

function GameResult({ result, revealed, onPlayAgain, onChangePack }) {
  const won = result.correct

  return (
    <section className={`gw-result${won ? ' gw-result--won' : ' gw-result--lost'}`}>
      <p className="play-eyebrow">
        <span className="play-eyebrow__dot" aria-hidden="true" />
        Guess Who
      </p>
      <h1 className="gw-result__title">{won ? 'YOU GOT THEM 🎉' : 'WRONG GUESS'}</h1>
      <p className="gw-result__sub">
        {won ? 'Nailed it — that was the other player’s character.' : 'Not this time.'}
      </p>

      <div className="gw-result__reveal">
        <span className="gw-result__who">The character was</span>
        <span className="gw-result__portrait">
          {revealed.image ? (
            <img src={revealed.image} alt="" />
          ) : (
            <span className="gw-result__initials">{initialsFor(revealed.name)}</span>
          )}
        </span>
        <span className="gw-result__name">{revealed.name}</span>
      </div>

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
