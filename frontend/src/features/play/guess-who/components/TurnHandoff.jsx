import { playerLabel } from '../logic/gameReducer'

function TurnHandoff({ nextPlayer, onReady }) {
  const player = playerLabel(nextPlayer)
  const other = playerLabel(nextPlayer === 'p1' ? 'p2' : 'p1')

  return (
    <section className="gw-handoff gw-handoff--pass">
      <p className="play-eyebrow">
        <span className="play-eyebrow__dot" aria-hidden="true" />
        Pass the screen
      </p>
      <h1 className="gw-handoff__title">{player}'s turn</h1>
      <p className="gw-handoff__sub">Make sure {other} isn't looking.</p>
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
