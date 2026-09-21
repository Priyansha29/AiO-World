import { useState } from 'react'
import CharacterCard from './CharacterCard'

/**
 * The editable list of people in the pack. Names stay readable (the card grid
 * gives each card room and lets long names wrap only when they have to).
 */
function PackRoster({ characters, onEdit, onRemove }) {
  const [pendingRemoveId, setPendingRemoveId] = useState(null)
  const pending = characters.find((c) => c.id === pendingRemoveId) ?? null

  return (
    <section className="gw-roster" aria-label="People in this pack">
      {pending && (
        <div className="gw-confirm" role="alertdialog" aria-label={`Remove ${pending.name}`}>
          <p className="gw-confirm__q">Remove {pending.name} from this pack?</p>
          <div className="gw-confirm__actions">
            <button type="button" className="play-btn play-btn--ghost" onClick={() => setPendingRemoveId(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="play-btn play-btn--danger"
              onClick={() => {
                onRemove(pending.id)
                setPendingRemoveId(null)
              }}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="gw-board__grid">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            actions={
              <span className="gw-avatar__tools">
                <button type="button" className="gw-avatar__tool" onClick={() => onEdit(character.id)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="gw-avatar__tool gw-avatar__tool--danger"
                  onClick={() => setPendingRemoveId(character.id)}
                >
                  Remove
                </button>
              </span>
            }
          />
        ))}
      </div>
    </section>
  )
}

export default PackRoster
