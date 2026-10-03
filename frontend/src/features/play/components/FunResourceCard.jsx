import { funCategory, funMood } from '../data/fun-resources'

function FunResourceCard({ resource, index, numbered = true, showMoods = false }) {
  const category = funCategory(resource.category)
  const label = resource.linkLabel ?? 'Visit Website'

  return (
    <article className="fun-card">
      <div className="fun-card__top">
        <span className="fun-card__category" style={{ '--cat': category.accent }}>
          {category.label}
        </span>
        {numbered && (
          <span className="fun-card__num" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
      </div>
      <h3 className="fun-card__title">{resource.title}</h3>
      <p className="fun-card__desc">{resource.description}</p>
      {showMoods && (
        <ul className="fun-card__moods" aria-label="Moods">
          {resource.moods.map((moodKey) => (
            <li key={moodKey}>
              <span className="fun-card__mood">{funMood(moodKey).label}</span>
            </li>
          ))}
        </ul>
      )}
      <a className="fun-card__link" href={resource.url} target="_blank" rel="noreferrer">
        {label}
        <span className="play-arrow" aria-hidden="true">
          →
        </span>
      </a>
    </article>
  )
}

export default FunResourceCard