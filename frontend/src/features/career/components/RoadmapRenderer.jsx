/**
 * The visual roadmap renderer.
 *
 * Renders a roadmap as four phase "lanes" (Learn → Practice → Build → Career)
 * in order, each containing its stages as cards whose nodes are clickable
 * progress toggles. Toggling persists immediately via `progress-store`.
 */
import { memo, useCallback } from 'react'
import { NODE_TYPE_LABELS, PROGRESS_STATES, nextProgressState } from '../domain/roadmap-types'

/** "learn" -> 0 so lane order is stable regardless of data order. */
const LANE_ORDER = { learn: 0, practice: 1, build: 2, career: 3 }

const LANE_LABELS = {
  learn: 'Learn',
  practice: 'Practice',
  build: 'Build',
  career: 'Career',
}

function sortByLane(stages) {
  return [...stages].sort((a, b) => (LANE_ORDER[a.phase] ?? 99) - (LANE_ORDER[b.phase] ?? 99))
}

function NodeButton({ node, state, onToggle }) {
  const active = state === PROGRESS_STATES.COMPLETED || state === PROGRESS_STATES.IN_PROGRESS
  const done = state === PROGRESS_STATES.COMPLETED

  return (
    <button
      type="button"
      className={`career-node career-node--${state}`}
      onClick={onToggle}
      aria-pressed={active}
      title={`${node.title} — ${state}`}
    >
      <span className={`career-node__mark${done ? ' career-node__mark--done' : ''}`} aria-hidden>
        {done ? '✓' : '·'}
      </span>
      <span className="career-node__label">{node.title}</span>
      <span className="career-node__type">{NODE_TYPE_LABELS[node.type] ?? node.type}</span>
    </button>
  )
}

function StageBlock({ stage, states, onToggleNode }) {
  const doneCount = stage.nodes.filter((node) => states[node.id] === PROGRESS_STATES.COMPLETED).length
  const total = stage.nodes.length

  return (
    <section className={`career-stage career-stage--${stage.phase}`} aria-label={stage.title}>
      <header className="career-stage__head">
        <h4 className="career-stage__title">{stage.title}</h4>
        <span className="career-stage__count">
          {doneCount}/{total}
        </span>
      </header>
      {stage.blurb && <p className="career-stage__blurb">{stage.blurb}</p>}
      <div className="career-stage__nodes">
        {stage.nodes.map((node) => (
          <NodeButton
            key={node.id}
            node={node}
            state={states[node.id] ?? PROGRESS_STATES.NOT_STARTED}
            onToggle={() => onToggleNode(node.id, states[node.id])}
          />
        ))}
      </div>
    </section>
  )
}

function RoadmapRenderer({ roadmap, progress, onSetNode }) {
  const onToggleNode = useCallback(
    (stageId, nodeId, currentState) => {
      onSetNode(roadmap.id, stageId, nodeId, nextProgressState(currentState))
    },
    [roadmap.id, onSetNode],
  )

  const lanes = ['learn', 'practice', 'build', 'career']
    .map((phase) => ({
      key: phase,
      label: LANE_LABELS[phase],
      stages: sortByLane(roadmap.stages).filter((stage) => stage.phase === phase),
    }))
    .filter((lane) => lane.stages.length > 0)

  return (
    <div className="career-renderer">
      {lanes.map((lane) => (
        <div key={lane.key} className={`career-lane career-lane--${lane.key}`}>
          <h3 className="career-lane__label">{lane.label}</h3>
          <div className="career-lane__stages">
            {lane.stages.map((stage) => {
              const stageProgress = progress[stage.id] ?? {}
              const states = Object.fromEntries(
                stage.nodes.map((node) => [node.id, stageProgress[node.id] ?? PROGRESS_STATES.NOT_STARTED]),
              )
              return (
                <StageBlock
                  key={stage.id}
                  stage={stage}
                  states={states}
                  onToggleNode={(nodeId, currentState) => onToggleNode(stage.id, nodeId, currentState)}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(RoadmapRenderer)