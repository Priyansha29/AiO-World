import { useEffect, useState } from 'react'
import Navbar from '../../../components/Navbar'
import FunHero from '../components/FunHero'
import FunMoodPicker from '../components/FunMoodPicker'
import FunSurprise from '../components/FunSurprise'
import FunResourceCard from '../components/FunResourceCard'
import { resourcesForMood, funMood } from '../data/fun-resources'
import '../play.css'

export default function FunPage() {
  const [mood, setMood] = useState(null)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const resources = mood ? resourcesForMood(mood) : []
  const moodLabel = mood ? funMood(mood).label : ''

  return (
    <main className="play-page" id="top">
      <Navbar />
      <div className="play-shell">
        <FunHero />
        <FunMoodPicker selected={mood} onSelect={setMood} />

        {mood && (
          <section className="fun-section fun-section--results" aria-label={`Results for ${moodLabel}`}>
            <header className="fun-section__head">
              <h3 className="fun-section__title">{moodLabel}</h3>
              <p className="fun-section__sub">
                {resources.length} {resources.length === 1 ? 'thing' : 'things'} to try — tap the
                mood again to clear it.
              </p>
            </header>
            <div className="fun-grid">
              {resources.map((resource, index) => (
                <FunResourceCard key={resource.id} resource={resource} index={index} />
              ))}
            </div>
          </section>
        )}

        <FunSurprise />

        <section className="fun-section fun-section--all" aria-label="Explore everything">
          <header className="fun-section__head">
            <h2 className="fun-section__title">Explore everything</h2>
            <p className="fun-section__sub">
              Search the whole catalogue — every website, game and experiment in one place.
            </p>
          </header>
          <a className="play-btn play-btn--primary play-btn--big fun-all__cta" href="#/fun/websites">
            All websites
            <span className="play-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </section>
      </div>
    </main>
  )
}