/**
 * Search input + sort select that drive the grid.
 *
 * Controlled: the page owns query/sort state so the results grid is one pure
 * derivation.
 */
import { memo } from 'react'
import { SORTS } from '../domain/library-types'

function LibrarySearch({ query, onQuery, sort, onSort }) {
  return (
    <div className="lib-search">
      <label className="lib-search__box">
        <svg className="lib-search__icon" viewBox="0 0 24 24" aria-hidden>
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          className="lib-search__input"
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search books, authors, subjects..."
          aria-label="Search books"
        />
        {query && (
          <button type="button" className="lib-search__clear" onClick={() => onQuery('')} aria-label="Clear search">
            ×
          </button>
        )}
      </label>

      <label className="lib-sort">
        <span className="lib-sort__label">Sort</span>
        <select
          className="lib-sort__select"
          value={sort}
          onChange={(event) => onSort(event.target.value)}
          aria-label="Sort books"
        >
          {SORTS.map((option) => (
            <option key={option.key} value={option.key}>{option.label}</option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default memo(LibrarySearch)