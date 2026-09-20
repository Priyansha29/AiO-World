/**
 * CollegeCard — a single selectable college result.
 */
export default function CollegeCard({ college, onSelect, index = 0 }) {
  return (
    <button
      type="button"
      className="college-card"
      onClick={() => onSelect(college)}
      style={{ '--delay': `${index * 45}ms` }}
    >
      <span className="college-card__crest" aria-hidden="true">
        {(college.abbreviation ?? college.name).slice(0, 2).toUpperCase()}
      </span>
      <span className="college-card__body">
        <span className="college-card__name">{college.name}</span>
        <span className="college-card__meta">
          {college.city}, {college.state}
          {college.university ? ` · ${college.university}` : ''}
        </span>
      </span>
      <span className="college-card__arrow" aria-hidden="true">
        →
      </span>
    </button>
  )
}