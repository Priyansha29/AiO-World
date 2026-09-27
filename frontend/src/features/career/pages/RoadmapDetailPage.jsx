/**
 * Roadmap detail page — a single roadmap rendered stage by stage.
 *
 * Reused by every roadmap id: progress is read/written per node through
 * `progress-store`, and the phase lanes give a coarse overview first, with
 * every node toggleable. Also offers a "reset progress" escape hatch.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from '../../../components/Navbar'
import RoadmapRenderer from '../components/RoadmapRenderer'
import ProgressBar from '../components/ProgressBar'
import { getRoadmap } from '../data/catalog'
import { navigate } from '../../../router/hash-router'
import { clearRoadmapProgress, getStageProgress, setNodeProgress } from '../services/progress-store'
import '../career.css'

export default function RoadmapDetailPage({ roadmapId }) {
  const roadmap = useMemo(() => getRoadmap(roadmapId), [roadmapId])

  // Bumped on every write so the page (and its totals) re-reads progress.
  const [, setRevision] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [roadmapId])

  // Read progress fresh on every render (this component re-renders when
  // `revision` bumps after a write), so totals and lanes always agree.
  let done = 0
  let total = 0
  const progress = {}
  if (roadmap) {
    for (const stage of roadmap.stages) {
      const states = getStageProgress(roadmap.id, stage.id)
      progress[stage.id] = states
      done += stage.nodes.filter((node) => states[node.id] === 'completed').length
      total += stage.nodes.length
    }
  }

  const onSetNode = useCallback(
    (id, stageId, nodeId, state) => {
      setNodeProgress(id, stageId, nodeId, state)
      setRevision((n) => n + 1)
    },
    [],
  )

  const onReset = useCallback(() => {
    if (!roadmap) return
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Reset all progress for “${roadmap.title}”?`)) return
    clearRoadmapProgress(roadmap.id)
    setRevision((n) => n + 1)
  }, [roadmap])

  if (!roadmap) {
    return (
      <main className="career-page">
        <Navbar />
        <div className="career-shell">
          <div className="career-missing">
            <h1 className="career-missing__title">Roadmap not found</h1>
            <p className="career-missing__sub">
              That roadmap is not in the library (yet). Head back and pick another one.
            </p>
            <button type="button" className="career-missing__cta" onClick={() => navigate('/career')}>
              ← Back to all roadmaps
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="career-page">
      <Navbar />
      <div className="career-shell career-shell--detail">
        <button type="button" className="career-back" onClick={() => navigate('/career')}>
          ← All roadmaps
        </button>

        <header className="career-detail">
          <p className="career-detail__kicker">
            {roadmap.category} · {roadmap.difficulty}
          </p>
          <h1 className="career-detail__title">{roadmap.title}</h1>
          <p className="career-detail__desc">{roadmap.description}</p>
          <p className="career-detail__why">
            <strong>Why it suits students:</strong> {roadmap.whyStudents}
          </p>

          <div className="career-detail__progress">
            <ProgressBar done={done} total={total} />
            {total > 0 && done === total && (
              <p className="career-detail__all-done">All completed — go land that internship.</p>
            )}
          </div>
          <button
            type="button"
            className="career-detail__reset"
            onClick={onReset}
            aria-label={`Reset progress for ${roadmap.title}`}
          >
            Reset progress
          </button>
        </header>

        <RoadmapRenderer
          roadmap={roadmap}
          progress={progress}
          onSetNode={onSetNode}
        />
      </div>
    </main>
  )
}