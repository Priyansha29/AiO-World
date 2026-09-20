/**
 * CollegeSearch — the search input for finding a college.
 * Presentation only: the debounced query flows up to the page, which owns data.
 */
export default function CollegeSearch({ value, onChange, placeholder = 'Search your college…' }) {
  return (
    <div className="college-search">
      <svg
        className="college-search__icon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className="college-search__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search your college"
        autoComplete="off"
        spellCheck="false"
      />
      {value ? (
        <button
          type="button"
          className="college-search__clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      ) : null}
    </div>
  )
}