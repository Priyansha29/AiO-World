import { initialsFor } from '../data/packs'

function SecretTokens({ character }) {
  return (
    <section className="gw-secret" aria-label="Your secret character">
      <div className="gw-secret__card">
        <span className="gw-secret__label">Your character</span>
        <span className="gw-secret__portrait">
          {character.image ? (
            <img src={character.image} alt="" />
          ) : (
            <span className="gw-secret__initials">{initialsFor(character.name)}</span>
          )}
        </span>
        <span className="gw-secret__name">{character.name}</span>
      </div>

      <div className="gw-secret__line">
        <p>Only you can see this.</p>
        <p>Answer questions about them honestly.</p>
      </div>

      <div className="gw-secret__opponent">
        <span className="gw-secret__label">Opponent's character</span>
        <span className="gw-secret__mystery" aria-hidden="true">
          ???
        </span>
        <span className="gw-secret__hidden">Hidden</span>
      </div>
    </section>
  )
}

export default SecretTokens
