import { FUN_MOODS } from '../data/fun-resources'

function FunMoodPicker({ selected, onSelect }) {
  return (
    <section className="fun-section fun-section--moods" aria-label="Pick a mood">
      <header className="fun-section__head">
        <h2 className="fun-section__title">How are you feeling?</h2>
        <p className="fun-section__sub">
          Pick a mood and we&rsquo;ll line up a few corners of the internet to match.
        </p>
      </header>
      <div className="fun-moods">
        {FUN_MOODS.map((mood) => {
          const active = mood.key === selected
          return (
            <button
              key={mood.key}
              type="button"
              className={`fun-mood${active ? ' fun-mood--active' : ''}`}
              aria-pressed={active}
              onClick={() => onSelect(active ? null : mood.key)}
            >
              {mood.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default FunMoodPicker