/**
 * Career roadmaps — domain types and shared constants.
 *
 * This file only defines the shapes and the vocabulary the rest of the
 * feature speaks. The actual roadmap content lives in `data/roadmaps.js`
 * and the browsable catalogue in `data/catalog.js`. Adding a new roadmap is
 * adding data, never another component or page.
 *
 * A roadmap is a student-facing path:
 *
 *   LEARN ─► PRACTICE ─► BUILD ─► CAREER
 *
 * Every `stage` belongs to one of those four phases, and every stage lists
 * `nodes` that can individually be marked not-started / in-progress /
 * completed (persisted by `services/progress-store.js`).
 */

/**
 * @typedef {'learn'|'practice'|'build'|'career'} Phase
 * @typedef {'skill'|'concept'|'tool'|'practice'|'project'} NodeType
 * @typedef {'Beginner'|'Intermediate'|'Advanced'} Difficulty
 * @typedef {'available'|'coming-soon'} RoadmapStatus
 *
 * @typedef {{ id: string, title: string, type: NodeType }} RoadmapNode
 * @typedef {{
 *   id: string,
 *   title: string,
 *   phase: Phase,
 *   blurb?: string,
 *   nodes: RoadmapNode[]
 * }} RoadmapStage
 *
 * @typedef {{
 *   id: string,
 *   title: string,
 *   category: string,
 *   tags: string[],
 *   difficulty: Difficulty|null,
 *   description: string,
 *   whyStudents: string,
 *   status: RoadmapStatus,
 *   stages?: RoadmapStage[]
 * }} Roadmap
 */

export const PHASES = [
  { key: 'learn', ordinal: 0, title: 'Learn', blurb: 'Understand the ideas and skills.' },
  { key: 'practice', ordinal: 1, title: 'Practice', blurb: 'Try it yourself, break it, fix it.' },
  { key: 'build', ordinal: 2, title: 'Build', blurb: 'Make something real you can show.' },
  { key: 'career', ordinal: 3, title: 'Career', blurb: 'Turn it into interviews, internships, offers.' },
]

export function phaseByKey(key) {
  return PHASES.find((phase) => phase.key === key) ?? PHASES[0]
}

export const NODE_TYPE_LABELS = {
  skill: 'Skill',
  concept: 'Concept',
  tool: 'Tool',
  practice: 'Practice',
  project: 'Project',
}

export const NODE_TYPE_ORDER = ['skill', 'concept', 'tool', 'practice', 'project']

export const DIFFICULTY_RANK = { Beginner: 1, Intermediate: 2, Advanced: 3 }

export const PROGRESS_STATES = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
}

/** Cycle a node between the three progress states. */
export function nextProgressState(current) {
  if (current === PROGRESS_STATES.COMPLETED) return PROGRESS_STATES.NOT_STARTED
  if (current === PROGRESS_STATES.IN_PROGRESS) return PROGRESS_STATES.COMPLETED
  return PROGRESS_STATES.IN_PROGRESS
}

/** All node titles in a roadmap, lower-cased, for search. */
export function roadmapSearchText(roadmap) {
  const nodes = (roadmap.stages ?? []).flatMap((stage) => stage.nodes.map((node) => node.title))
  return [roadmap.title, roadmap.description, roadmap.whyStudents, ...nodes]
    .join(' ')
    .toLowerCase()
}