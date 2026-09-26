/**
 * The boredom machine — a small, pure state machine.
 *
 * The whole feature is one interaction, so it is modelled as exactly one
 * explicit phase instead of a pile of booleans (`isOpen`, `isLoading`,
 * `isAnimating`, `isDone`…). The origami animation is driven off this phase,
 * which means the paper can never disagree with the copy.
 *
 *   idle ──OPEN──▶ opening ──▶ choosing ──PICK──▶ shuffling ──▶ revealing ──▶ result
 *          ▲                                        ▲                │  │
 *          │                                        └─────AGAIN──────┘  │
 *          └──────────── CLOSE ◀── closing ◀────────────────────────────┘
 *
 * `AGAIN` re-enters `shuffling` without going back through `choosing`: the
 * player already told us what they are in the mood for, asking again would be
 * the boring thing to do.
 *
 * Transitions that represent time passing (OPENED, SHUFFLED, REVEALED, DONE)
 * are dispatched by useBoredomMachine, which owns the timers. This module
 * stays pure so the animation is easy to reason about and to test.
 */

export const BOREDOM = {
  /** Not mounted. The homepage is showing. */
  idle: 'idle',
  /** Paper closed, wiggle playing, intro copy showing. */
  opening: 'opening',
  /** Folds open. The four options are live. */
  choosing: 'choosing',
  /** Snaps shut, shakes, spins. Anticipation. */
  shuffling: 'shuffling',
  /** Folds spring back open on the chosen surprise. */
  revealing: 'revealing',
  /** Settled. Content readable, controls live. */
  result: 'result',
  /** Folding away back to the homepage. */
  closing: 'closing',
}

/** Phases where the four folds are interactive. */
export const isChoosing = (phase) => phase === BOREDOM.choosing

/** Phases where the paper is shut. */
export const isShut = (phase) =>
  phase === BOREDOM.idle ||
  phase === BOREDOM.opening ||
  phase === BOREDOM.shuffling ||
  phase === BOREDOM.revealing ||
  phase === BOREDOM.closing

/** Phases where anything is still moving and the content is not yet readable. */
export const isBusy = (phase) =>
  phase === BOREDOM.opening ||
  phase === BOREDOM.shuffling ||
  phase === BOREDOM.revealing ||
  phase === BOREDOM.closing

export function createInitialState() {
  return {
    phase: BOREDOM.idle,
    /** The chosen mood id, or null before the first pick. */
    mood: null,
    /** The library item being revealed, or null while the paper is deciding. */
    item: null,
    /** Surprises shown this session. Never reset on OPEN — see note below. */
    runCount: 0,
    /**
     * Shuffles *started* this session. PICK increments it before the shuffle
     * runs, so the shuffle in progress is already counted here — which is why
     * timingFor treats 1 as "still the first one".
     */
    cycle: 0,
  }
}

/**
 * How long each transition takes, in ms.
 *
 * The first run gets the full, elaborate intro. Every later run is faster —
 * nobody wants the whole ceremony again on their third click. Reduced motion
 * collapses all of it to near-instant, because the point there is that the
 * interaction still works, not that it moves.
 */
export const TIMING = {
  first: {
    opening: 1500,
    shuffling: 1250,
    revealing: 620,
    closing: 380,
  },
  repeat: {
    opening: 620,
    shuffling: 900,
    revealing: 480,
    closing: 320,
  },
  reduced: {
    opening: 420,
    shuffling: 340,
    revealing: 220,
    closing: 200,
  },
}

/**
 * Pick the timing table for the shuffle currently in progress.
 *
 * `cycle` counts shuffles *started*, and PICK bumps it before the shuffle
 * begins — so the very first shuffle runs with cycle === 1, not 0. Both 0
 * (the opening, before anything has been picked) and 1 (the first shuffle) want
 * the elaborate table; 2 and up get the quick one.
 */
export function timingFor(cycle, reducedMotion) {
  if (reducedMotion) return TIMING.reduced
  return cycle <= 1 ? TIMING.first : TIMING.repeat
}

export function boredomReducer(state, action) {
  switch (action.type) {
    case 'OPEN':
      // Fresh slate for content, but `cycle` survives so a second open is quick.
      return {
        ...state,
        phase: BOREDOM.opening,
        mood: null,
        item: null,
      }

    case 'OPENED':
      if (state.phase !== BOREDOM.opening) return state
      return { ...state, phase: BOREDOM.choosing }

    case 'PICK': {
      if (state.phase !== BOREDOM.choosing) return state
      return {
        ...state,
        phase: BOREDOM.shuffling,
        mood: action.mood,
        // The paper is still deciding — no item until SHUFFLED.
        item: null,
        cycle: state.cycle + 1,
      }
    }

    case 'SHUFFLED': {
      if (state.phase !== BOREDOM.shuffling) return state
      if (!action.item) return { ...state, phase: BOREDOM.choosing }
      return { ...state, phase: BOREDOM.revealing, item: action.item }
    }

    case 'REVEALED':
      if (state.phase !== BOREDOM.revealing) return state
      return { ...state, phase: BOREDOM.result, runCount: state.runCount + 1 }

    case 'AGAIN': {
      if (state.phase !== BOREDOM.result) return state
      if (!state.mood) return state
      return {
        ...state,
        phase: BOREDOM.shuffling,
        item: null,
        cycle: state.cycle + 1,
      }
    }

    case 'CLOSE':
      if (state.phase === BOREDOM.idle || state.phase === BOREDOM.closing) return state
      return { ...state, phase: BOREDOM.closing }

    case 'DONE': {
      if (state.phase !== BOREDOM.closing) return state
      const fresh = createInitialState()
      // Keep the session pacing so the next open is still the "fast" one.
      return { ...fresh, cycle: state.cycle, runCount: state.runCount }
    }

    default:
      return state
  }
}
