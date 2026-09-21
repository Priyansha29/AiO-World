import GameMotif from './GameMotif'

function GameCard({ game }) {
  const available = game.status === 'available'

  return (
    <article
      className={`play-card play-card--${game.accent}`}
      aria-label={`${game.title} — ${available ? 'available now' : 'coming soon'}`}
    >
      <div className="play-card__motif" aria-hidden="true">
        <span className={`play-card__badge${available ? ' play-card__badge--live' : ''}`}>
          {available ? 'Ready' : 'Soon'}
        </span>
        <GameMotif type={game.motif} />
      </div>

      <div className="play-card__body">
        <h3 className="play-card__title">{game.title}</h3>
        <p className="play-card__desc">{game.description}</p>
        <ul className="play-tags play-card__tags" aria-label={`${game.title} tags`}>
          {game.tags.map((tag) => (
            <li key={tag} className="play-tags__item">
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="play-card__footer">
        <span className={`play-card__status${available ? '' : ' play-card__status--soon'}`}>
          {available ? 'Available now' : 'Coming soon'}
        </span>
        {available ? (
          <a className="play-card__cta" href={game.route}>
            Play
            <span className="play-arrow" aria-hidden="true">
              →
            </span>
          </a>
        ) : (
          <button
            type="button"
            className="play-btn play-btn--soon"
            disabled
            aria-disabled="true"
            aria-label={`${game.title} — coming soon, not yet playable`}
          >
            Coming soon
          </button>
        )}
      </div>
    </article>
  )
}

export default GameCard