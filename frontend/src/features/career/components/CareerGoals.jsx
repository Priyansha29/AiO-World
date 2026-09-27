/**
 * "Why are you here?" goal cards just under the hero.
 *
 * Each card is a landing-pad for the rest of the page: clicking a goal
 * filters the grid to the matching category tags so the page reacts to what
 * the student said they came for.
 */
import { memo } from 'react'
import { GOALS } from '../data/catalog'

// Map a goal to the filter key its card should activate. Kept next to the
// data for discoverability; unknown goals just clear the filters.
const GOAL_TO_FILTER = {
  internship: 'career-path',
  placements: 'career-path',
  betterProjects: 'career-path',
  newTechnology: 'technology',
  exploreCareers: 'all',
  jobReady: 'career-path',
}

function CareerGoals({ activeGoal, onPickGoal }) {
  return (
    <div className="career-goals" aria-label="Why are you here">
      <h2 className="career-goals__title">Why are you here?</h2>
      <div className="career-goals__grid">
        {GOALS.map((goal) => {
          const active = activeGoal === goal.key
          return (
            <button
              key={goal.key}
              type="button"
              className={`career-goal${active ? ' career-goal--active' : ''}`}
              onClick={() => onPickGoal(goal.key, GOAL_TO_FILTER[goal.key] ?? 'all')}
              aria-pressed={active}
            >
              <span className="career-goal__emoji" aria-hidden>{goal.emoji}</span>
              <strong className="career-goal__title">{goal.title}</strong>
              <span className="career-goal__blurb">{goal.blurb}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default memo(CareerGoals)