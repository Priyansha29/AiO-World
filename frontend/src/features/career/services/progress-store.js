/**
 * Progress persistence for roadmap nodes.
 *
 * Storage is localStorage keyed per roadmap:
 *
 *   aioworld.career.progress = {
 *     "full-stack": { "fs-foundations": { "html": "completed", ... }, ... },
 *     ...
 *   }
 *
 * The nested structure matches a roadmap's stages -> nodes, and only stores
 * per-node progress states (see `PROGRESS_STATES`). Like `profile-store.js`
 * this is intentionally localStorage for now so the future swap to an
 * authenticated server profile is a one-file change.
 */

const STORAGE_KEY = 'aioworld.career.progress'

/** @type {Record<string, Record<string, Record<string, string>>>|null} */
let cachedProgress = null
let progressLoaded = false

function readProgress() {
  if (progressLoaded) return cachedProgress
  progressLoaded = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    cachedProgress = raw ? JSON.parse(raw) : {}
  } catch {
    cachedProgress = {}
  }
  return cachedProgress
}

function writeProgress() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedProgress))
  } catch {
    // Storage unavailable: progress just won't persist across reloads.
  }
}

function stageProgress(progress, roadmapId, stageId) {
  if (!progress[roadmapId]) progress[roadmapId] = {}
  if (!progress[roadmapId][stageId]) progress[roadmapId][stageId] = {}
  return progress[roadmapId][stageId]
}

/** @returns {Record<string, string>} nodeId -> progress state for a stage. */
export function getStageProgress(roadmapId, stageId) {
  return stageProgress(readProgress(), roadmapId, stageId)
}

/** Mark one node's progress state within a roadmap stage. */
export function setNodeProgress(roadmapId, stageId, nodeId, state) {
  const progress = readProgress()
  stageProgress(progress, roadmapId, stageId)[nodeId] = state
  writeProgress()
}

/** Clear all stored progress for a single roadmap. */
export function clearRoadmapProgress(roadmapId) {
  const progress = readProgress()
  delete progress[roadmapId]
  writeProgress()
}