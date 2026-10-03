import { resourceCount } from '../data/fun-resources'

function FunCollectionCard({ collection }) {
  const count = resourceCount(collection)

  return (
    <a className="fun-collection-card" href={`#${collection.route}`}>
      <h3 className="fun-collection-card__title">{collection.title}</h3>
      <p className="fun-collection-card__desc">{collection.description}</p>
      <div className="fun-collection-card__foot">
        {count > 0 ? (
          <span className="fun-collection-card__meta">
            {count} {count === 1 ? 'thing' : 'things'} to explore
          </span>
        ) : (
          <span className="fun-collection-card__soon">Coming soon</span>
        )}
        <span className="fun-collection-card__cta">
          Explore
          <span className="play-arrow" aria-hidden="true">
            →
          </span>
        </span>
      </div>
    </a>
  )
}

export default FunCollectionCard