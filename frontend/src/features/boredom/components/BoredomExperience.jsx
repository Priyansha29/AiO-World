/**
 * BoredomExperience — the full-screen "boredom machine".
 *
 * This owns the overlay chrome and nothing else: the phase lives in
 * useBoredomMachine, the paper lives in OrigamiFortuneTeller, the content
 * lives in SurpriseReveal. What is left here is the shell — the transition in,
 * the escape routes out, the scroll lock and the focus trap.
 *
 * It is deliberately not a centred modal card. The whole viewport becomes the
 * experience, and the page behind it dims and recedes, because the promise of
 * the button is "somewhere else", not "a dialog".
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import OrigamiFortuneTeller from './OrigamiFortuneTeller.jsx'
import SurpriseReveal from './SurpriseReveal.jsx'
import SurpriseControls from './SurpriseControls.jsx'
import { useBoredomMachine } from '../services/use-boredom-machine.js'
import { BOREDOM } from '../logic/boredomMachine.js'
import { navigate } from '../../../router/hash-router.js'
import { SURPRISE_MOOD, SURPRISE_MOODS } from '../domain/surpriseTypes.js'
import {
  COPY_AGAIN,
  COPY_CHOOSING,
  COPY_CLOSED,
  COPY_CLOSE,
  COPY_DONE,
  COPY_SHUFFLING,
} from '../data/surpriseCopy.js'
import '../boredom.css'

/** Lines rotate by run index rather than at random — repeatable, and no reroll. */
function pickLine(lines, index) {
  return lines[index % lines.length]
}

export default function BoredomExperience({ open, anchorRef, onClose }) {
  const machine = useBoredomMachine()
  const {
    phase,
    mood,
    item,
    timing,
    reducedMotion,
    runCount,
    cycle,
    isOpen,
    requestOpen,
  } = machine

  const overlayRef = useRef(null)
  const closeRef = useRef(null)
  const restoreFocusRef = useRef(null)
  const [origin, setOrigin] = useState(null)

  const isIdle = phase === BOREDOM.idle
  const moodMeta = mood ? SURPRISE_MOOD[mood] : null

  // ── Open request from the host (the hero button) ───────────────────────
  // Only an actual false→true transition re-opens, so the machine closing
  // itself can never bounce straight back open.
  useEffect(() => {
    if (open) requestOpen()
  }, [open, requestOpen])

  // Report back once the closing animation has actually finished.
  const wasOpen = useRef(false)
  useEffect(() => {
    if (isOpen) {
      wasOpen.current = true
      return
    }
    if (wasOpen.current) {
      wasOpen.current = false
      onClose?.()
    }
  }, [isOpen, onClose])

  // ── Transition in from the button that was pressed ─────────────────────
  // The overlay opens out of the actual "I'm bored" button rather than fading
  // in from nowhere, which is most of what makes it feel connected to the page.
  useLayoutEffect(() => {
    if (phase !== BOREDOM.opening) return
    const rect = anchorRef?.current?.getBoundingClientRect()
    if (!rect) {
      setOrigin(null)
      return
    }
    setOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }, [phase, anchorRef])

  // ── Escape hatches ──────────────────────────────────────────────────────
  const close = useCallback(() => machine.requestClose(), [machine])

  useEffect(() => {
    if (phase === BOREDOM.idle) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab') return
      // Keep focus inside. An experience you can tab out of into a page you
      // cannot see is worse than no focus trap at all.
      const root = overlayRef.current
      if (!root) return
      const focusable = root.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [phase, close])

  // ── Scroll lock, focus hand-off and restoration ─────────────────────────
  useEffect(() => {
    if (isIdle) return undefined
    const { body } = document
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    // Compensate for the scrollbar so the page behind does not visibly jump.
    const gap = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`

    restoreFocusRef.current = document.activeElement
    const focusTimer = setTimeout(() => closeRef.current?.focus(), 60)

    return () => {
      clearTimeout(focusTimer)
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
      const target = restoreFocusRef.current
      if (target && typeof target.focus === 'function' && document.contains(target)) {
        target.focus()
      }
    }
  }, [isIdle])

  // ── Copy ────────────────────────────────────────────────────────────────
  const stageLine =
    phase === BOREDOM.opening
      ? pickLine(COPY_CLOSED, cycle)
      : phase === BOREDOM.choosing
        ? pickLine(COPY_CHOOSING, cycle)
        : ''

  /**
   * One live region for the whole dialog, mounted up front and left in place.
   *
   * It has to exist *before* the text inside it changes: a region that mounts
   * in the same commit as the result it is describing is announced unreliably,
   * or not at all. So the shell owns it and only its text changes.
   */
  const announcement =
    phase === BOREDOM.choosing
      ? `${stageLine} ${SURPRISE_MOODS.map((m) => m.full).join(', ')}.`
      : phase === BOREDOM.shuffling
        ? COPY_SHUFFLING
        : phase === BOREDOM.result
          ? `${item ? `${item.title}. ` : ''}${COPY_AGAIN} or ${COPY_DONE}.`
          : ''

  const showResult = phase === BOREDOM.result && item
  const showReveal = (phase === BOREDOM.revealing || phase === BOREDOM.result) && item

  // Departing for an internal route unmounts the whole overlay with the page,
  // so there is no closing animation to play here.
  const depart = useCallback((route) => {
    if (route) navigate(route)
  }, [])

  /**
   * The resting state of the overlay. Every branch below has to name `scale: 1`
   * and `opacity: 1` explicitly.
   *
   * The first render happens before the trigger button has been measured, so
   * `origin` is still null and the element is briefly given the scale-up
   * starting pose. If the clip-path branch then omits scale from its target,
   * nothing ever animates that value back down and the overlay sits at 1.04 for
   * its whole life — 4% too big, bleeding off both edges, with every absolutely
   * positioned child dragged along with it. Naming the rest state once and
   * spreading it into each branch makes that impossible.
   */
  const RESTING = { opacity: 1, scale: 1 }

  const backdrop = reducedMotion
    ? { initial: { opacity: 0 }, animate: RESTING, exit: { opacity: 0 } }
    : origin
      ? {
          initial: { clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`, ...RESTING },
          animate: { clipPath: `circle(150% at ${origin.x}px ${origin.y}px)`, ...RESTING },
          exit: { clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`, ...RESTING },
        }
      : {
          initial: { opacity: 0, scale: 1.04 },
          animate: RESTING,
          exit: { opacity: 0, scale: 0.98 },
        }

  return (
    <AnimatePresence>
      {phase !== BOREDOM.idle && (
        <MotionConfig reducedMotion="user">
          <motion.div
            className="boredom"
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="I'm bored — surprise me"
            data-phase={phase}
            {...backdrop}
            transition={
              reducedMotion
                ? { duration: 0.18 }
                : { duration: 0.52, ease: [0.32, 0.72, 0.24, 1] }
            }
          >
            <div className="boredom__field" aria-hidden="true" />

            <p className="boredom__sr-only" aria-live="polite" aria-atomic="true">
              {announcement}
            </p>

            <div className="boredom__chrome">
              <p className="boredom__brand">
                <span className="boredom__brand-mark" aria-hidden="true" />
                AiO World
              </p>
              <button
                type="button"
                className="boredom__close"
                onClick={close}
                ref={closeRef}
              >
                <span className="boredom__close-x" aria-hidden="true" />
                <span>{COPY_CLOSE}</span>
              </button>
            </div>

            <div className="boredom__stage">
              <div className="boredom__copy" data-live="stage">
                {stageLine && (
                  <motion.h2
                    key={stageLine}
                    className="boredom__line"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stageLine}
                  </motion.h2>
                )}
              </div>

              <OrigamiFortuneTeller
                phase={phase}
                mood={mood}
                item={item}
                timing={timing}
                reducedMotion={reducedMotion}
                onPick={machine.pick}
              />

              <div className="boredom__copy" data-live="mood">
                {moodMeta && (
                  <motion.p
                    key={moodMeta.id}
                    className="boredom__mood"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {moodMeta.resultTitle}
                  </motion.p>
                )}
              </div>

              <AnimatePresence mode="wait">
                {showReveal && (
                  <motion.div
                    key={item.id}
                    className="boredom__result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
                  >
                    <SurpriseReveal item={item} onDepart={depart} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showResult && (
                <SurpriseControls
                  onAgain={machine.again}
                  onDone={close}
                  runCount={runCount}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </MotionConfig>
      )}
    </AnimatePresence>
  )
}
