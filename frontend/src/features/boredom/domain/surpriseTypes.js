/**
 * Surprise — the domain vocabulary behind "I'm bored — surprise me".
 *
 * Two orthogonal axes describe every surprise item, and keeping them apart is
 * what lets the content library grow to hundreds of entries without ever
 * touching the UI:
 *
 *   CATEGORY → which pool the item belongs to. This is the only thing the
 *              selector is allowed to filter on, so adding a pool later is a
 *              data change, not a code change.
 *
 *   TYPE     → what shape the result is. This is the only thing the reveal is
 *              allowed to branch on, so a new result layout is a new renderer,
 *              not a new pool.
 *
 * Moods (what the player picked) map onto categories one-to-one, except
 * `anywhere`, which means "the whole library" rather than a pool of its own.
 */

/** Pools. `anywhere` is deliberately absent — it is a selector mode, not a pool. */
export const SURPRISE_CATEGORY = {
  fun: 'fun',
  discover: 'discover',
  move: 'move',
  explore: 'explore',
}

/** Every real pool, in the order weights are applied (see surprise-selector). */
export const SURPRISE_CATEGORIES = [
  SURPRISE_CATEGORY.fun,
  SURPRISE_CATEGORY.discover,
  SURPRISE_CATEGORY.move,
  SURPRISE_CATEGORY.explore,
]

/** Result shapes. Each one gets its own layout in SurpriseReveal. */
export const SURPRISE_TYPE = {
  /** "Did you know…" — a surprising fact with a rabbit-hole link. */
  fact: 'fact',
  /** A question posed at you. Nothing to click but the next surprise. */
  prompt: 'prompt',
  /** Something playable inside AiO World. */
  game: 'game',
  /** A guided, follow-along physical thing. */
  activity: 'activity',
  /** Something to read. */
  read: 'read',
  /** Something to watch. */
  watch: 'watch',
  /** Something to listen to. */
  listen: 'listen',
}

/**
 * The four moods the origami offers. `pool` is what gets passed to the
 * selector: a category name, or `anywhere` for the entire library.
 */
export const SURPRISE_MOOD = {
  laugh: {
    id: 'laugh',
    /** Short label baked into the origami's paper folds. Keep it two lines. */
    short: ['MAKE ME', 'LAUGH'],
    /** Full wording, used for aria + the result header. */
    full: 'Make me laugh',
    pool: SURPRISE_CATEGORY.fun,
    /** Result header, e.g. "YOU GOT A LAUGH". */
    resultTitle: 'YOU GOT A LAUGH',
  },
  curious: {
    id: 'curious',
    short: ['MAKE ME', 'CURIOUS'],
    full: 'Make me curious',
    pool: SURPRISE_CATEGORY.discover,
    resultTitle: 'YOU GOT A RABBIT HOLE',
  },
  moving: {
    id: 'moving',
    short: ['GET ME', 'MOVING'],
    full: 'Get me moving',
    pool: SURPRISE_CATEGORY.move,
    resultTitle: 'YOU GOT OFF THE CHAIR',
  },
  anywhere: {
    id: 'anywhere',
    short: ['PURE', 'RANDOM'],
    full: 'Absolutely random',
    pool: 'anywhere',
    resultTitle: 'WELL. YOU ASKED FOR RANDOM',
  },
}

/** Stable order so the four paper folds never reshuffle between renders. */
export const SURPRISE_MOODS = [
  SURPRISE_MOOD.laugh,
  SURPRISE_MOOD.curious,
  SURPRISE_MOOD.moving,
  SURPRISE_MOOD.anywhere,
]

/** Which compass arm of the cross each mood occupies. */
export const MOOD_FOLD = {
  laugh: 'top',
  curious: 'right',
  moving: 'bottom',
  anywhere: 'left',
}

export const FOLD_ORDER = ['top', 'right', 'bottom', 'left']
