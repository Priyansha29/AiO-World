import { useEffect } from 'react'
import Navbar from '../../../components/Navbar'
import FunResourceCard from '../components/FunResourceCard'
import { funCollection, resourcesFor } from '../data/fun-resources'
import '../play.css'

export default function CollectionPage({ collectionId }) {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const collection = funCollection(collectionId)
  const resources = collection ? resourcesFor(collection) : []
  const comingSoon = Boolean(collection) && resources.length === 0

  return (
    <main className="play-page" id="top">
      <Navbar />
      <div className="play-shell">
        <a className="play-back" href="#/fun">
          <span className="play-back__arrow" aria-hidden="true">
            ←
          </span>
          Back to Fun
        </a>

        {!collection && (
          <section className="fun-empty">
            <h1 className="fun-empty__title">Collection not found</h1>
            <p className="fun-empty__sub">
              That collection doesn&rsquo;t exist yet. Head back to the Fun homepage and explore
              the ones that do.
            </p>
          </section>
        )}

        {comingSoon && (
          <section className="fun-empty">
            <h1 className="fun-empty__title">{collection.title}</h1>
            <p className="fun-empty__sub">{collection.description}</p>
            <p className="fun-empty__note">
              We&rsquo;re putting this together — check back soon.
            </p>
          </section>
        )}

        {resources.length > 0 && (
          <section className="fun-section fun-section--collection" aria-labelledby="collection-title">
            <header className="fun-section__head">
              <h1 className="fun-section__title" id="collection-title">
                {collection.title}
              </h1>
              <p className="fun-section__sub">{collection.description}</p>
            </header>
            <div className="fun-grid">
              {resources.map((resource, index) => (
                <FunResourceCard key={resource.id} resource={resource} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}