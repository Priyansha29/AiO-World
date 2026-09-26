/**
 * The Sidequests page — the section's only route.
 *
 * Ten layers, in the order the brief gives them, each with its own data
 * lifecycle. Two decisions shape the whole file:
 *
 *   1. **One request for the first viewport.** `GET /overview` returns the
 *      interests, six ranked picks, the weekly sidequest, a few circles and the
 *      people counts — roughly a fifth of the catalogue. Everything below the
 *      fold (events, the full circle list, saved) loads when its section first
 *      approaches the viewport, so scrolling the page is what fetches more.
 *
 *   2. **Failure is per section, not per page.** If the events request fails,
 *      only the events block shows "Something got lost somewhere." with a
 *      working retry. The shelf above it stays on screen. A single dead request
 *      should not blank a page that is mostly fine.
 *
 * The interest picker is the only control that changes the shape of the rest of
 * the page, so a change there refetches the overview and the discovery seed —
 * everything downstream is a function of what was picked.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Navbar from '../../../components/Navbar'
import Section from '../components/Section'
import SidequestsHero from '../components/SidequestsHero'
import InterestSelector from '../components/InterestSelector'
import ForYouShelf from '../components/ForYouShelf'
import DiscoveryShelf from '../components/DiscoveryShelf'
import SidequestOfTheWeek from '../components/SidequestOfTheWeek'
import LocalEvents from '../components/LocalEvents'
import PeopleLikeYou from '../components/PeopleLikeYou'
import InterestCircles from '../components/InterestCircles'
import SavedForLater from '../components/SavedForLater'
import SidequestsClosing from '../components/SidequestsClosing'
import { ErrorState } from '../components/States'
import {
  useDiscover,
  useInterests,
  usePeople,
  useSavedSidequests,
  useSidequestsOverview,
  useWeekly,
} from '../services/use-sidequests'
import { getSelectedCollege } from '../../campus/services/profile-store'
import '../sidequests.css'

/** A short heading used by several sections; kept here so the page reads as one plan. */
const copy = {
  forYou: {
    eyebrow: 'For you',
    title: 'Picked for you',
    sub: 'Built from what you picked, spread out so it is not the same thing five times.',
  },
  discover: {
    eyebrow: 'Discover something new',
    title: 'Go a little off-script.',
    sub: 'Not everything has to be productive. Take this seriously, or roll again.',
  },
  weekly: {
    eyebrow: 'Sidequest of the week',
    title: 'One thing, all week',
    sub: 'The same pick for everybody until Monday. No streak, no points.',
  },
  events: {
    eyebrow: 'Around you',
    title: 'Things happening near you',
    sub: 'Filtered to things worth leaving the room for.',
  },
  people: {
    eyebrow: 'People with similar interests',
    title: 'You are not the only one',
    sub: 'What other people on your campus pick up, as anonymous counts.',
  },
  circles: {
    eyebrow: 'Interest circles',
    title: 'Find your people',
    sub: 'A name, a shared interest, and a way to say you are in. That is all a circle is.',
  },
  saved: {
    eyebrow: 'Save for later',
    title: 'Kept for you',
    sub: 'Nothing here is urgent. That is the point.',
  },
}

export default function SidequestsPage() {
  // The selection and the overview are mutually dependent: the overview *is* the
  // personalisation, and changing the selection changes the answer. The counter
  // lives here rather than inside either hook, because this is the only place
  // that sees both.
  const [interestRevision, setInterestRevision] = useState(0)
  const overview = useSidequestsOverview({ revision: interestRevision })
  const { catalogue, selected, selectedIds, slugs, add, remove, busy: savingInterests } =
    useInterests(overview)
  const weekly = useWeekly({ seed: overview.data?.weekly ?? null })
  // Seeded from the overview, so the discovery section has a card on arrival
  // and costs no request until somebody presses something.
  const discover = useDiscover({ seed: overview.data?.discoverySeed ?? null })

  const [eventsNear, setEventsNear] = useState(false)
  const [peopleNear, setPeopleNear] = useState(false)
  const [circlesNear, setCirclesNear] = useState(false)
  const [savedNear, setSavedNear] = useState(false)

  // Both are enabled by the viewport observer below, so neither costs a request
  // until the student actually scrolls to it.
  const people = usePeople({ enabled: peopleNear })
  const saved = useSavedSidequests({ enabled: savedNear })

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  /* ── Below-the-fold sections announce themselves as they approach ───────── */

  /**
   * Mark a section "reached" once its top has come within `MARGIN` of the bottom
   * of the viewport, and never un-mark it.
   *
   * Deliberately a *reach* test rather than an `IntersectionObserver`. An
   * intersection test only reports what happens to be on screen when a frame is
   * produced, so pressing End — or following a link to the bottom — skips every
   * section in between and those sections silently never load. A reach test
   * answers the question actually being asked: has the student got to this yet?
   * If the section is anywhere above the fold line, they have.
   *
   * Discovery is absent on purpose: it is seeded from the overview, so it needs no
   * request of its own and is not waiting on anything.
   */
  useEffect(() => {
    if (!overview.data) return undefined

    const pending = [
      ['#sq-events', setEventsNear],
      ['#sq-people', setPeopleNear],
      ['#sq-circles', setCirclesNear],
      ['#sq-saved', setSavedNear],
    ]
    let remaining = [...pending]
    let frame = 0

    const sweep = () => {
      frame = 0
      const line = window.innerHeight + 340
      const next = []
      for (const [selector, mark] of remaining) {
        const node = document.querySelector(selector)
        if (node && node.getBoundingClientRect().top < line) mark(true)
        else next.push([selector, mark])
      }
      remaining = next
      if (remaining.length === 0) {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
    }

    // rAF-throttled: a scroll gesture fires far more events than there are frames,
    // and each sweep is a batched layout read.
    function onScroll() {
      if (frame) return
      frame = window.requestAnimationFrame(sweep)
    }

    sweep()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [overview.data])

  /* ── Lookup helpers ─────────────────────────────────────────────────────── */

  const interestBySlug = useMemo(() => {
    const map = new Map()
    for (const interest of catalogue) map.set(interest.slug, interest)
    return map
  }, [catalogue])

  const interestNameFor = useCallback(
    (slug) => interestBySlug.get(slug)?.name ?? slug,
    [interestBySlug],
  )
  const interestIconFor = useCallback(
    (slug) => interestBySlug.get(slug)?.icon ?? 'sparkle',
    [interestBySlug],
  )

  /* ── Changing what you are into ─────────────────────────────────────────── */

  /**
   * Every write re-reads the overview, because the shelf, the circles, the people
   * counts and the discovery preview are all ranked on the server from the same
   * selection. Patching them locally would mean reimplementing the ranking
   * rules in the client, and the two would disagree the first time the weights
   * changed.
   */
  const onAddInterests = useCallback(
    async (ids) => {
      const added = await add(ids)
      setInterestRevision((n) => n + 1)
      return added
    },
    [add],
  )

  const onRemoveInterest = useCallback(
    async (id) => {
      await remove(id)
      setInterestRevision((n) => n + 1)
    },
    [remove],
  )

  /* ── "Surprise me" in the hero ──────────────────────────────────────────── */

  /**
   * The hero's button and the section's button are one action. It rolls a fresh
   * card and then takes you there, so the label describes what happened rather
   * than only where it went.
   */
  const onSurprise = useCallback(() => {
    discover.shuffle()
    document.getElementById('sq-discover')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }, [discover])

  const hasCollege = Boolean(getSelectedCollege()?.id)
  const hasInterests = selected.length > 0

  const onSave = useCallback(
    (item) => {
      saved.toggle(item).catch(() => {})
    },
    [saved],
  )

  /* ── Fatal: the overview itself failed, so there is no page ─────────────── */

  if (overview.error && !overview.data) {
    return (
      <MotionConfig reducedMotion="user">
        <main className="sq-page" id="top">
          <Navbar />
          <div className="sq-shell sq-shell--bare">
            <SidequestsHero />
            <ErrorState onRetry={overview.retry} what="Sidequests" />
          </div>
        </main>
      </MotionConfig>
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="sq-page" id="top">
        <Navbar />

        <div className="sq-shell">
          <SidequestsHero onSurprise={onSurprise} />

          {/* 2 ── Your Interests ─────────────────────────────────────────── */}
          <Section
            id="your-interests"
            eyebrow="Your interests"
            title="What are you into?"
            sub="Pick anything. Everything below re-sorts around your answers, and nothing is a commitment."
          >
            <InterestSelector
              catalogue={catalogue}
              selectedIds={selectedIds}
              onAdd={onAddInterests}
              onRemove={onRemoveInterest}
              busy={savingInterests}
              loading={overview.loading && catalogue.length === 0}
            />
          </Section>

          {/* 3 ── For You ───────────────────────────────────────────────── */}
          <Section {...copy.forYou} id="for-you" tone="tinted">
            <ForYouShelf
              items={overview.data?.forYou ?? []}
              interestNameFor={interestNameFor}
              loading={overview.loading}
              error={overview.error}
              onRetry={overview.retry}
              hasInterests={hasInterests}
              savedIds={saved.savedIds}
              onSave={onSave}
              saveBusyId={saved.busyId}
            />
          </Section>

          {/* 4 ── Discover Something New ─────────────────────────────────── */}
          <Section {...copy.discover} id="sq-discover">
            <DiscoveryShelf
              item={discover.item}
              band={discover.band}
              loading={discover.loading}
              error={discover.error}
              presses={discover.presses}
              onShuffle={discover.shuffle}
              interestNameFor={interestNameFor}
              savedIds={saved.savedIds}
              onSave={onSave}
              saveBusyId={saved.busyId}
            />
          </Section>

          {/* 5 ── Sidequest of the Week ──────────────────────────────────── */}
          <Section {...copy.weekly} id="sq-week" tone="tinted">
            <SidequestOfTheWeek
              sidequest={weekly.sidequest}
              completed={weekly.completed}
              busy={weekly.busy}
              error={weekly.error}
              onToggle={weekly.toggle}
              loading={overview.loading && !weekly.sidequest}
            />
          </Section>

          {/* 6 ── Local discovery ────────────────────────────────────────── */}
          <Section {...copy.events} id="sq-events">
            <LocalEvents
              visible={eventsNear}
              interestSlugs={slugs}
              hasInterests={hasInterests}
              hasCollege={hasCollege}
              interestNameFor={interestNameFor}
            />
          </Section>

          {/* 7 ── People with similar interests ──────────────────────────── */}
          <Section {...copy.people} id="sq-people" tone="tinted">
            <PeopleLikeYou
              data={people.data ?? overview.data?.people ?? null}
              loading={people.loading || overview.loading}
              error={people.error ?? overview.error}
              onRetry={people.error ? people.retry : overview.retry}
            />
          </Section>

          {/* 8 ── Interest circles ────────────────────────────────────────── */}
          <Section {...copy.circles} id="sq-circles">
            <InterestCircles
              visible={circlesNear}
              seedCircles={overview.data?.circles ?? []}
              interestNameFor={interestNameFor}
              interestIconFor={interestIconFor}
            />
          </Section>

          {/* 9 ── Save for later ─────────────────────────────────────────── */}
          <Section {...copy.saved} id="sq-saved" tone="tinted">
            <SavedForLater
              items={saved.items}
              loading={saved.loading}
              error={saved.error}
              onRetry={saved.retry}
              onSave={onSave}
              busyId={saved.busyId}
              interestNameFor={interestNameFor}
            />
          </Section>

          {/* 10 ── Closing ───────────────────────────────────────────────── */}
          <SidequestsClosing />
        </div>
      </main>
    </MotionConfig>
  )
}
