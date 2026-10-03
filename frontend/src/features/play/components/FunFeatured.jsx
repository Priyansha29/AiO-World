import { useId } from 'react'
import { featuredResources } from '../data/fun-resources'
import FunResourceCard from './FunResourceCard'

function FunFeatured() {
  const titleId = useId()
  const resources = featuredResources()

  return (
    <section className="fun-section fun-section--featured" aria-labelledby={titleId}>
      <header className="fun-section__head">
        <h2 className="fun-section__title" id={titleId}>
          Featured
        </h2>
      </header>
      <div className="fun-grid">
        {resources.map((resource, index) => (
          <FunResourceCard key={resource.id} resource={resource} index={index} numbered={false} />
        ))}
      </div>
    </section>
  )
}

export default FunFeatured