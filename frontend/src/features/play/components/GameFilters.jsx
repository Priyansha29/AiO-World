import { GAME_FILTERS } from '../data/games'

function GameFilters({ active, onChange }) {
  return (
    <div className="play-filters" role="group" aria-label="Filter games by mood">
      {GAME_FILTERS.map((filter) => {
        const pressed = active === filter.id
        return (
          <button
            key={filter.id}
            type="button"
            className={`play-chip${pressed ? ' play-chip--active' : ''}`}
            aria-pressed={pressed}
            onClick={() => onChange(filter.id)}
          >
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}

export default GameFilters