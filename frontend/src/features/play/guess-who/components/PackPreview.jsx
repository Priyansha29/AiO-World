import CharacterCard from './CharacterCard'

function PackPreview({ pack, onStart, onEdit, onRemove, onAddMore, onNewPack, onChangePack }) {
  const characters = pack.characters
  const ready = characters.length === 12

  const cardActions = (character) => (
    <span className="gw-avatar__tools">
      <button
        type="button"
        className="gw-avatar__tool"
        onClick={() => onEdit(character.id)}
      >
        Edit
      </button>
      <button
        type="button"
        className="gw-avatar__tool gw-avatar__tool--danger"
        onClick={() => onRemove(character.id)}
      >
        Remove
      </button>
    </span>
  )

  return (
    <section className="gw-step">
      <header className="gw-step__head">
        <p className="play-eyebrow">
          <span className="play-eyebrow__dot" aria-hidden="true" />
          {pack.emoji} {pack.title}
        </p>
        <h1 className="gw-step__title">Your {pack.title} Pack</h1>
        <p className="gw-step__desc">
          {characters.length} {characters.length === 1 ? 'character' : 'characters'}
          {ready ? ' — ready to play.' : ` — add ${12 - characters.length} more to start.`}
        </p>
      </header>

      <div className="gw-board gw-board--preview">
        <div className="gw-board__grid">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} actions={cardActions(character)} />
          ))}
          {characters.length < 12 && (
            <button type="button" className="gw-add-tile" onClick={onAddMore}>
              <span className="gw-add-tile__plus" aria-hidden="true">
                +
              </span>
              Add character
            </button>
          )}
        </div>
      </div>

      <div className="gw-step__actions">
        <button
          type="button"
          className="play-btn play-btn--primary play-btn--big"
          disabled={!ready}
          onClick={onStart}
        >
          Start Guess Who
          <span className="play-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>

      <div className="gw-step__foot gw-step__foot--spread">
        <button type="button" className="gw-textbtn" onClick={onNewPack}>
          Build a new pack
        </button>
        <button type="button" className="gw-textbtn" onClick={onChangePack}>
          Change pack
        </button>
      </div>
    </section>
  )
}

export default PackPreview
