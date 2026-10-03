import { useState } from 'react'
import { funCategory, funMood } from '../data/fun-resources'

function FunResourceCard({ resource, index, numbered = true, showMoods = false }) {
  const category = funCategory(resource.category)
  const label = resource.linkLabel ?? 'Visit Website'
  const [broken, setBroken] = useState(false)
  const showThumb = Boolean(resource.thumbnail) && !broken

  return (
    <article className="fun-card" style={{ '--cat': category.accent }}>
      {showThumb ? (
        <div className="fun-card__thumb">
          <img
            className="fun-card__thumb-img"
            src={resource.thumbnail}
            alt={resource.thumbnailAlt ?? `${resource.title} website preview`}
            loading="lazy"
            onError={() => setBroken(true)}
          />
        </div>
      ) : (
        <div className="fun-card__thumb fun-card__thumb--fallback" aria-hidden="true">
          <span className="fun-card__thumb-mono">{resource.title.charAt(0)}</span>
        </div>
      )}
      <div className="fun-card__top">
        <span className="fun-card__category">{category.label}</span>
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