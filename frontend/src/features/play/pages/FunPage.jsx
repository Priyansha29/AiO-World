import { useEffect } from 'react'
import Navbar from '../../../components/Navbar'
import FunHero from '../components/FunHero'
import FunFeatured from '../components/FunFeatured'
import FunCollectionCard from '../components/FunCollectionCard'
import { FUN_COLLECTIONS } from '../data/fun-resources'
import '../play.css'

export default function FunPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <main className="play-page" id="top">
      <Navbar />
      <div className="play-shell">
        <FunHero />
        <FunFeatured />

        <section className="fun-section" id="collections" aria-label="Explore collections">
          <header className="fun-section__head">
            <h2 className="fun-section__title">Explore collections</h2>
            <p className="fun-section__sub">
              Curated corners of the internet — each one a rabbit hole worth falling into.
            </p>
          </header>
          <div className="fun-collections-grid">
            {FUN_COLLECTIONS.map((collection) => (
              <FunCollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}