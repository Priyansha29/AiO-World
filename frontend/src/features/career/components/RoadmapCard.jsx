/**
 * A single roadmap card for the landing grid.
 *
 * Clicking navigates to `/career/roadmaps/:id` via the hash router. The card
 * shows difficulty, tag chips, a tiny phase summary, and a progress bar when
 * the student has started the roadmap.
 */
import { memo } from 'react'
import { navigate } from '../../../router/hash-router'
import { DIFFICULTY_RANK } from '../domain/roadmap-types'
import ProgressBar from './ProgressBar'

function RoadmapCard({ roadmap, progress }) {
  const started = (progress?.done ?? 0) > 0 || (progress?.total ?? 0) > 0

  return (
    <button
      type="button"
      className="career-card"
      onClick={() => navigate(`/career/roadmaps/${roadmap.id}`)}
      aria-label={`Open roadmap: ${roadmap.title}`}
    >
      <div className="career-card__head">
        <span className={`career-card__difficulty career-card__difficulty--${DIFFICULTY_RANK[roadmap.difficulty] ?? 1}`}>
          {roadmap.difficulty}
        </span>
        <ul className="career-card__tags" aria-label="Tags">
          {roadmap.tags.slice(0, 2).map((tag) => (
            <li key={tag} className="career-card__tag">{tag}</li>
          ))}
        </ul>
      </div>

      <h3 className="career-card__title">{roadmap.title}</h3>
      <p className="career-card__desc">{roadmap.description}</p>

      <div className="career-card__meta">
        <span>{roadmap.stages.length} stages</span>
        <span>
          {roadmap.stages.filter((stage) => stage.phase === 'build').length} build steps
        </span>
      </div>

      {started && <ProgressBar done={progress.done} total={progress.total} />}

      <span className="career-card__cta">Open roadmap →</span>
    </button>
  )
}

export default memo(RoadmapCard)