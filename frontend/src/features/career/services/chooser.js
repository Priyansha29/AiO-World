/**
 * Help-me-choose: turns a student's answers into a suggested roadmap.
 *
 * Deliberately simple and deterministic — a scored match against each
 * roadmap's tags, with no randomness so the same answers always give the
 * same suggestion (and the "why" stays explainable to the user).
 */

import { ROADMAPS } from '../data/roadmaps.js'
import { getRoadmap, isAvailable } from '../data/catalog.js'

const QUIZ_WEIGHTS = {
  careerPath: { software: 2, 'career-path': 0, ai: 3, cloud: 3, cybersecurity: 3, engineering: 3, design: 2 },
  cpp: { software: 1, engineering: 2, cybersecurity: 1 },
  ai: { ai: 3 },
  data: { ai: 2 },
  cloud: { cloud: 3 },
  security: { cybersecurity: 3 },
  design: { design: 3 },
  quick: { ai: 1, software: 1, 'career-path': 1 },
}

/**
 * Score a roadmap against a quiz answer set.
 *
 * @param {import('../domain/roadmap-types.js').Roadmap} roadmap
 * @param {Record<string, string>} answers
 */
function scoreRoadmap(roadmap, answers) {
  let score = 0
  for (const [question, answer] of Object.entries(answers)) {
    const weights = QUIZ_WEIGHTS[question]
    if (!weights || !answer) continue
    if (roadmap.tags.includes(answer)) score += weights[answer] ?? 1
  }
  if (answers.careerPath && roadmap.tags.includes('career-path')) score += 1
  return score
}

/**
 * @param {Record<string, string>} answers
 * @returns {{ roadmap: import('../domain/roadmap-types.js').Roadmap|null, scores: Array<{roadmap: import('../domain/roadmap-types.js').Roadmap, score: number}> }}
 */
export function suggestRoadmap(answers) {
  const scores = ROADMAPS.filter(isAvailable)
    .map((roadmap) => ({ roadmap, score: scoreRoadmap(roadmap, answers) }))
    .sort((a, b) => b.score - a.score)
  return { roadmap: scores[0]?.roadmap ?? null, scores }
}

/** Fallback suggestion when the quiz has no answers yet. */
export function defaultSuggestion() {
  const roadmap = getRoadmap('full-stack')
  return { roadmap, scores: [] }
}