/**
 * Search box + filter chips that drive the roadmap grid.
 *
 * Fully controlled: the page owns the query/filter state so the grid can be
 * derived in one place.
 */
import { memo } from 'react'
import { FILTERS } from '../data/catalog'

function CareerSearch({ query, onQuery, filter, onFilter }) {
  return (
    <div className="career-search">
      <label className="career-search__box">
        <span className="career-search__icon" aria-hidden>🔎</span>
        <input
          className="career-search__input"
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search roadmaps — React, SQL, cyber…"
          aria-label="Search roadmaps"
        />
        {query && (
          <button type="button" className="career-search__clear" onClick={() => onQuery('')} aria-label="Clear search">
            ×
          </button>
        )}
      </label>

      <div className="career-search__filters" role="group" aria-label="Filter roadmaps">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`career-chip${filter === item.key ? ' career-chip--active' : ''}`}
            onClick={() => onFilter(item.key)}
            aria-pressed={filter === item.key}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default memo(CareerSearch)