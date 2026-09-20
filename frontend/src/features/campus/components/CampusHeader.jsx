/**
 * CampusHeader — "Your campus, organized."
 */
import FreshnessIndicator from './FreshnessIndicator'

function initials(college) {
  const seed = college.abbreviation ?? college.name
  return seed
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function CampusHeader({ college, lastUpdatedAt, onChangeCollege }) {
  return (
    <header className="campus-header">
      <span className="campus-header__crest" aria-hidden="true">
        {initials(college)}
      </span>
      <div className="campus-header__text">
        <p className="campus-header__eyebrow">Your Campus</p>
        <h1 className="campus-header__name">{college.name}</h1>
        <p className="campus-header__meta">
          {college.city}, {college.state}
          {college.university ? ` · ${college.university}` : ''}
        </p>
        {lastUpdatedAt ? (
          <p className="campus-header__freshness">
            <FreshnessIndicator updatedAt={lastUpdatedAt} />
          </p>
        ) : null}
      </div>
      {onChangeCollege ? (
        <button type="button" className="campus-header__change" onClick={onChangeCollege}>
          Change college
        </button>
      ) : null}
    </header>
  )
}