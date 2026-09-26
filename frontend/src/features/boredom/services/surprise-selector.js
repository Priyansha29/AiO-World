/**
 * Surprise selection — the only place randomness happens.
 *
 * Every component in this feature asks this module for content; none of them
 * call Math.random() themselves. That matters for three reasons:
 *
 *  - Repeat avoidance lives here, so no screen has to remember what it showed.
 *  - Weights have exactly one home, so "fun shows up more often" is a data
 *    change rather than a hunt through JSX.
 *  - Personalisation later (interests, college, time of day) slots in as a
 *    filter in `pick()` without any UI changing at all.
 *
 * For now the filters are simple rules, deliberately. No model, no API.
 */
import { SURPRISE_LIBRARY } from '../data/surpriseLibrary.js'
import { SURPRISE_CATEGORIES } from '../domain/surpriseTypes.js'

/**
 * How often each pool shows up in "absolutely random" mode. These are pool
 * probabilities, not per-item weights, and the sum is 1.0 — selectSurprise
 * divides each one across its pool so the table means what it says. Absent
 * pools keep an implicit weight of 1, so a new category is playable the moment
 * it is added.
 *
 * Tuned so "absolutely random" still feels like a surprise: move and explore
 * are the pools a bored person is least likely to pick on purpose, so they get
 * a bigger share than they would get by chance.
 */
const RANDOM_WEIGHTS = {
  fun: 0.28,
  discover: 0.3,
  move: 0.22,
  explore: 0.2,
}

/** How many recent surprises to remember per pool, to avoid repeats. */
const RECENT_MEMORY = 4

/**
 * One weighted roll over `list`. Weights are the only input; no other
 * randomness happens anywhere in this feature. Returns null for an empty list.
 */
function weightedPick(list, weightOf) {
  const total = list.reduce((sum, item) => sum + weightOf(item), 0)
  if (total <= 0) return list[0]

  let roll = Math.random() * total
  for (const item of list) {
    roll -= weightOf(item)
    if (roll <= 0) return item
  }
  return list[list.length - 1]
}

/** The shared, mutable "recently shown" memory. Session-only, never persisted. */
const recentByCategory = new Map()

function remember(category, id) {
  if (!SURPRISE_CATEGORIES.includes(category)) return
  const seen = recentByCategory.get(category) ?? []
  recentByCategory.set(category, [id, ...seen].slice(0, RECENT_MEMORY))
}

function wasShownRecently(category, id) {
  return (recentByCategory.get(category) ?? []).includes(id)
}

/** Fresh, enabled items in `category`. */
export function poolFor(category) {
  if (!category || category === 'anywhere') {
    return SURPRISE_LIBRARY.filter((item) => item.enabled)
  }
  return SURPRISE_LIBRARY.filter((item) => item.enabled && item.category === category)
}

/**
 * Pick one surprise item.
 *
 * @param {object}  [options]
 * @param {string}  [options.category]  pool id, or 'anywhere' for everything
 * @param {boolean} [options.avoidRepeats=true]  drop items seen recently
 * @param {string}  [options.excludeId]  never return this one (the current result)
 * @param {number}  [options.recencyBias=0]  0..1, shrinks weight of recent items
 * @returns {object|null} a library item, or null if the pool is empty
 */
export function selectSurprise({
  category = 'anywhere',
  avoidRepeats = true,
  excludeId = null,
  recencyBias = 0,
} = {}) {
  const weightedCategory = category === 'anywhere'
  const source = weightedCategory
    ? SURPRISE_CATEGORIES
    : [category].filter(Boolean)

  // Two rolls, in this order, and the order matters.
  //
  // 1. Roll the *pool*, using RANDOM_WEIGHTS. Because each pool is a single
  //    candidate here, the table is honoured exactly — no pool can buy itself a
  //    bigger share just by holding more items.
  // 2. Roll an *item* inside that pool, skipping anything seen recently.
  //
  // Rolling items first and weighting them per-item does not work: repeat
  // avoidance then shrinks small pools fastest (fun holds 7 items and the
  // memory holds 4, so most of it is zeroed at any moment) and the observed
  // split drifts well away from the table it is supposedly following.
  //
  // Repeat avoidance is allowed to fall back to a full pool rather than return
  // nothing, so a small pool never leaves the player without a result.
  const rollPool = (pool) => (weightedCategory ? (RANDOM_WEIGHTS[pool] ?? 1) : 1)

  const eligibleIn = (pool) => {
    const fresh = poolFor(pool).filter((item) => item.id !== excludeId)
    if (fresh.length === 0) return []
    if (!avoidRepeats) return fresh
    const unseen = fresh.filter((item) => !wasShownRecently(pool, item.id))
    return unseen.length > 0 ? unseen : fresh
  }

  const options = source
    .map((pool) => ({ pool, items: eligibleIn(pool) }))
    .filter((option) => option.items.length > 0)
  if (options.length === 0) return null

  const chosenPool = weightedPick(options, ({ pool }) => rollPool(pool))?.pool
  const chosen = options.find((option) => option.pool === chosenPool)
  if (!chosen) return null

  // A soft recency bias on top, for when a caller wants recent items to still be
  // possible rather than impossible.
  const itemWeight = (item) => (recencyBias > 0 && wasShownRecently(chosen.pool, item.id) ? 1 - recencyBias : 1)

  const winner = weightedPick(chosen.items, itemWeight)
  if (!winner) return null
  remember(winner.category, winner.id)
  return winner
}

/**
 * Pick a fresh mood for "give me another" — the player keeps the mood they
 * chose, which is the right behaviour (they asked for a different surprise,
 * not a different question).
 */
export function selectMood(current, moods) {
  if (moods.length < 2) return current
  const others = moods.filter((mood) => mood.id !== current)
  return others[Math.floor(Math.random() * others.length)]
}

/** Test seam: forget everything. Not used by the UI. */
export function resetSurpriseMemory() {
  recentByCategory.clear()
}
