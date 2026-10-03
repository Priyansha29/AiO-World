import { useId } from 'react'
import { resourcesFor } from '../data/fun-resources'
import FunResourceCard from './FunResourceCard'

function FunCollection({ collection }) {
  const titleId = useId()
  const resources = resourcesFor(collection)

  return (
    <section className="fun-collection" id={collection.id} aria-labelledby={titleId}>
      <header className="fun-collection__head">
        <h2 className="fun-collection__title" id={titleId}>
          {collection.title}
        </h2>
        {collection.description && (
          <p className="fun-collection__sub">{collection.description}</p>
        )}
      </header>
      <div className="fun-grid">
        {resources.map((resource, index) => (
          <FunResourceCard key={resource.id} resource={resource} index={index} />
        ))}
      </div>
    </section>
  )
}

export default FunCollection