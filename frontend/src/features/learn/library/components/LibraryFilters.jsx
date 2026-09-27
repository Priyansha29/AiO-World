/**
 * Category chips (All + every present category) and a hosted/external source
 * toggle. Controlled by the page.
 */
import { memo } from 'react'
import { SOURCE_FILTERS } from '../domain/library-types'

function LibraryFilters({ categories, category, onCategory, source, onSource }) {
  return (
    <div className="lib-filters">
      <div className="lib-filters__cats" role="group" aria-label="Filter by subject">
        <button
          type="button"
          className={`lib-chip${category === 'all' ? ' lib-chip--active' : ''}`}
          onClick={() => onCategory('all')}
          aria-pressed={category === 'all'}
        >
          All
        </button>
        {categories.map((entry) => (
          <button
            key={entry.key}
            type="button"
            className={`lib-chip${category === entry.key ? ' lib-chip--active' : ''}`}
            onClick={() => onCategory(entry.key)}
            aria-pressed={category === entry.key}
          >
            {entry.title}
            <span className="lib-chip__count">{entry.count}</span>
          </button>
        ))}
      </div>

      <div className="lib-filters__sources" role="group" aria-label="Filter by source">
        {SOURCE_FILTERS.map((option) => (
          <button
            key={option.key}
            type="button"
            className={`lib-chip lib-chip--source${source === option.key ? ' lib-chip--active' : ''}`}
            onClick={() => onSource(option.key)}
            aria-pressed={source === option.key}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default memo(LibraryFilters)