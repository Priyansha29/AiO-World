import { useState } from 'react'
import { randomResource } from '../data/fun-resources'
import FunResourceCard from './FunResourceCard'

function FunSurprise() {
  const [resource, setResource] = useState(null)

  const next = () => setResource(randomResource())

  return (
    <section className="fun-section fun-section--surprise" aria-label="Surprise me">
      <header className="fun-section__head">
        <h2 className="fun-section__title">Something random?</h2>
        <p className="fun-section__sub">
          Can&rsquo;t decide? Let us pick a corner of the internet for you.
        </p>
      </header>
      <div className="fun-surprise">
        <button type="button" className="play-btn play-btn--primary" onClick={next}>
          Surprise me
          <span className="play-arrow" aria-hidden="true">
            →
          </span>
        </button>
        {resource && (
          <div className="fun-surprise__result">
            <p className="fun-surprise__label">How about this?</p>
            <FunResourceCard resource={resource} numbered={false} showMoods />
            <button
              type="button"
              className="play-btn play-btn--ghost"
              onClick={next}
            >
              Try another
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default FunSurprise