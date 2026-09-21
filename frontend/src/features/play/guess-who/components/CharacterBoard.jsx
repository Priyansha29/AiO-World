import CharacterCard from './CharacterCard'

/**
 * The 12-person grid. In `board` mode tapping toggles your own eliminated
 * list; in `guess` mode tapping selects the person you're about to name.
 * The board never removes a card — elimination is only a visual state.
 */
export default function CharacterBoard({
  characters,
  eliminatedIds = [],
  selectedId = null,
  mode = 'board',
  disabled = false,
  onAction,
}) {
  return (
    <div className="gw-board gw-board--game" role="group" aria-label="Character board">
      <div className="gw-board__grid">
        {characters.map((character) => {
          const eliminated = eliminatedIds.includes(character.id)
          const selected = selectedId === character.id
          const state = mode === 'guess'
            ? selected
              ? 'selected'
              : 'active'
            : eliminated
              ? 'eliminated'
              : 'active'
          return (
            <CharacterCard
              key={character.id}
              character={character}
              state={state}
              disabled={disabled}
              onClick={onAction}
            />
          )
        })}
      </div>
    </div>
  )
}
