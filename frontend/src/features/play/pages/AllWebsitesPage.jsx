import { useEffect, useMemo, useState } from 'react'
import Navbar from '../../../components/Navbar'
import FunResourceCard from '../components/FunResourceCard'
import { FUN_CATEGORIES, FUN_MOODS, FUN_RESOURCES, resourcesMatching } from '../data/fun-resources'
import '../play.css'

function toggle(list, key) {
  return list.includes(key) ? list.filter((item) => item !== key) : [...list, key]
}

export default function AllWebsitesPage() {
  const [query, setQuery] = useState('')
  const [moods, setMoods] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const results = useMemo(
    () => resourcesMatching({ query, moods, categories }),
    [query, moods, categories],
  )
  const total = FUN_RESOURCES.length

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

        <header className="fun-hero fun-hero--compact">
          <p className="play-eyebrow">
            <span className="play-eyebrow__dot" aria-hidden="true" />
            Fun · All websites
          </p>
          <h1 className="fun-hero__title fun-hero__title--small">The whole catalogue.</h1>
          <p className="fun-hero__sub">
            Every corner of the internet we&rsquo;ve filed under Fun — search it, or
            filter by mood and category.
          </p>
        </header>

        <section className="fun-section fun-section--filters" aria-label="Filters">
          <label className="fun-search">
            <span className="sr-only">Search websites</span>
            <input
              className="fun-search__input"
              type="search"
              placeholder="Search websites…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div className="fun-filter-group" role="group" aria-label="Filter by mood">
            <span className="fun-filter-group__label">Mood</span>
            <div className="fun-filter-chips">
              {FUN_MOODS.map((mood) => {
                const active = moods.includes(mood.key)
                return (
                  <button
                    key={mood.key}
                    type="button"
                    className={`fun-filter-chip${active ? ' fun-filter-chip--active' : ''}`}
                    aria-pressed={active}
                    onClick={() => setMoods((list) => toggle(list, mood.key))}
                  >
                    {mood.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="fun-filter-group" role="group" aria-label="Filter by category">
            <span className="fun-filter-group__label">Category</span>
            <div className="fun-filter-chips">
              {FUN_CATEGORIES.map((category) => {
                const active = categories.includes(category.key)
                return (
                  <button
                    key={category.key}
                    type="button"
                    className={`fun-filter-chip${active ? ' fun-filter-chip--active' : ''}`}
                    aria-pressed={active}
                    onClick={() => setCategories((list) => toggle(list, category.key))}
                  >
                    {category.label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <p className="fun-results-count" aria-live="polite">
          {results.length} of {total} {results.length === 1 ? 'website' : 'websites'}
        </p>

        {results.length > 0 ? (
          <div className="fun-grid fun-grid--filters">
            {results.map((resource, index) => (
              <FunResourceCard key={resource.id} resource={resource} index={index} />
            ))}
          </div>
        ) : (
          <section className="fun-empty fun-empty--filters">
            <h2 className="fun-empty__title">No matches</h2>
            <p className="fun-empty__sub">
              Try clearing a filter or two — there&rsquo;s always something worth doing.
            </p>
          </section>
        )}
      </div>
    </main>
  )
}