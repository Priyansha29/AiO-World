/**
 * useBoredomMachine — the one owner of timers for the boredom machine.
 *
 * The reducer in logic/boredomMachine.js is pure and knows nothing about time.
 * This hook supplies the clock: it schedules every automatic transition, tears
 * the timers down on unmount, and asks the selector for content at the exact
 * moment the paper should "decide" (SHUFFLED), so the reveal always has
 * something to reveal.
 *
 * It also hands back the active timing table. The origami's CSS animations are
 * driven from the same numbers, which is what keeps the shake finishing on the
 * same frame as the state change instead of drifting out of sync with it.
 */
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import {
  BOREDOM,
  boredomReducer,
  createInitialState,
  isBusy,
  timingFor,
} from '../logic/boredomMachine.js'
import { selectSurprise } from './surprise-selector.js'
import { SURPRISE_MOOD } from '../domain/surpriseTypes.js'

export function useBoredomMachine() {
  const [state, dispatch] = useReducer(boredomReducer, undefined, createInitialState)
  const reducedMotion = useReducedMotion() ?? false

  const timerRef = useRef(0)
  const lastItemIdRef = useRef(null)

  const timing = useMemo(
    () => timingFor(state.cycle, reducedMotion),
    [state.cycle, reducedMotion],
  )

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = 0
    }
  }, [])

  // No timer may outlive the component. This is the only cleanup that matters
  // for a feature like this, where a stray setTimeout would dispatch into an
  // unmounted reducer.
  useEffect(() => clearTimer, [clearTimer])

  // Exactly one automatic transition is pending at a time, so a single timer
  // ref is enough — and it guarantees we never stack two.
  useEffect(() => {
    const pool = state.mood ? SURPRISE_MOOD[state.mood].pool : 'anywhere'

    switch (state.phase) {
      case BOREDOM.opening:
        timerRef.current = setTimeout(() => dispatch({ type: 'OPENED' }), timing.opening)
        break

      case BOREDOM.shuffling:
        timerRef.current = setTimeout(() => {
          const item = selectSurprise({ category: pool, excludeId: lastItemIdRef.current })
          if (item) lastItemIdRef.current = item.id
          dispatch({ type: 'SHUFFLED', item })
        }, timing.shuffling)
        break

      case BOREDOM.revealing:
        timerRef.current = setTimeout(() => dispatch({ type: 'REVEALED' }), timing.revealing)
        break

      case BOREDOM.closing:
        timerRef.current = setTimeout(() => dispatch({ type: 'DONE' }), timing.closing)
        break

      default:
        clearTimer()
    }

    return clearTimer
  }, [state.phase, state.mood, timing, clearTimer])

  const requestOpen = useCallback(() => dispatch({ type: 'OPEN' }), [])
  const requestClose = useCallback(() => {
    clearTimer()
    dispatch({ type: 'CLOSE' })
  }, [clearTimer])
  const pick = useCallback((mood) => dispatch({ type: 'PICK', mood }), [])
  const again = useCallback(() => dispatch({ type: 'AGAIN' }), [])

  return {
    ...state,
    /** 'anywhere' | 'fun' | 'discover' | 'move' | 'explore' */
    pool: state.mood ? SURPRISE_MOOD[state.mood].pool : 'anywhere',
    isOpen: state.phase !== BOREDOM.idle,
    isBusy: isBusy(state.phase),
    reducedMotion,
    timing,
    requestOpen,
    requestClose,
    pick,
    again,
  }
}
