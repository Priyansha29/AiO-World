import { GAME_PACKS } from '../data/packs'

function PackSelector({ onSelect, onBack }) {
  return (
    <section className="gw-step">
      <header className="gw-step__head">
        <p className="play-eyebrow">
          <span className="play-eyebrow__dot" aria-hidden="true" />
          Guess Who
        </p>
        <h1 className="gw-step__title">Who are we guessing?</h1>
        <p className="gw-step__desc">Pick a pack of people to play with.</p>
      </header>

      <div className="gw-packs">
        {GAME_PACKS.map((pack) => {
          const available = pack.status === 'available'
          return (
            <article
              key={pack.id}
              className={`gw-pack${available ? ' gw-pack--available' : ' gw-pack--soon'}`}
            >
              <span className="gw-pack__emoji" aria-hidden="true">
                {pack.emoji}
              </span>
              <h2 className="gw-pack__title">{pack.title}</h2>
              <p className="gw-pack__desc">{pack.description}</p>
              {available ? (
                <button
                  type="button"
                  className="play-btn play-btn--primary gw-pack__cta"
                  onClick={() => onSelect(pack.id)}
                >
                  Play {pack.title}
                </button>
              ) : (
                <span className="play-btn play-btn--soon gw-pack__cta" aria-disabled="true">
                  Coming soon
                </span>
              )}
            </article>
          )
        })}
      </div>

      <div className="gw-step__foot">
        <button type="button" className="play-back" onClick={onBack}>
          <span className="play-back__arrow" aria-hidden="true">
            ←
          </span>
          Back
        </button>
      </div>
    </section>
  )
}

export default PackSelector
