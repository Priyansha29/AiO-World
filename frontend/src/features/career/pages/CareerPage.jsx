/**
 * Career landing page — the browsable roadmap library.
 *
 * Sections top to bottom:
 *   1. Hero (title + count + short pitch)
 *   2. "Why are you here?" goal cards
 *   3. Search + filter chips
 *   4. Roadmap grid — grouped by category when browsing, flat when searching
 *   5. Coming-soon cards
 *   6. Help Me Choose quiz
 *
 * All state (query, filter, active goal) lives here so the grid is a pure
 * derivation; progress is read from `progress-store` for the per-card bars.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from '../../../components/Navbar'
import PlatformNav from '../../../components/platform/PlatformNav'
import CareerGoals from '../components/CareerGoals'
import CareerSearch from '../components/CareerSearch'
import RoadmapCard from '../components/RoadmapCard'
import HelpMeChoose from '../components/HelpMeChoose'
import { CATEGORIES, COMING_SOON, filterRoadmaps, getCategoryEntries } from '../data/catalog'
import { roadmapSearchText } from '../domain/roadmap-types'
import { getStageProgress } from '../services/progress-store'
import { suggestRoadmap } from '../services/chooser'
import '../career.css'

function roadmapTotal(roadmap) {
  return roadmap.stages.reduce((sum, stage) => sum + stage.nodes.length, 0)
}

function roadmapDone(roadmap) {
  return roadmap.stages.reduce((sum, stage) => {
    const states = getStageProgress(roadmap.id, stage.id)
    return sum + stage.nodes.filter((node) => states[node.id] === 'completed').length
  }, 0)
}

export default function CareerPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [activeGoal, setActiveGoal] = useState(null)
  const [showComingSoon, setShowComingSoon] = useState(null)
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const onPickGoal = useCallback((goalKey, filterKey) => {
    setActiveGoal((current) => (current === goalKey ? null : goalKey))
    setFilter(filterKey)
    setQuery('')
  }, [])

  const onAnswer = useCallback((questionKey, value) => {
    setAnswers((current) => ({ ...current, [questionKey]: value }))
  }, [])

  const choose = useMemo(() => {
    if (Object.keys(answers).length === 0) {
      return { suggestion: null, ids: [] }
    }
    const result = suggestRoadmap(answers)
    return {
      suggestion: result.roadmap,
      ids: result.scores.slice(0, 3).map((entry) => entry.roadmap.title),
    }
  }, [answers])

  const matches = useMemo(() => {
    const byFilter = filterRoadmaps(filter)
    const needle = query.trim().toLowerCase()
    if (!needle) return byFilter
    return byFilter.filter((roadmap) => roadmapSearchText(roadmap).includes(needle))
  }, [query, filter])

  const groups = useMemo(() => {
    if (query.trim() || filter !== 'all') return null
    return CATEGORIES.map((category) => ({
      category,
      items: getCategoryEntries(category.key),
    })).filter((group) => group.items.length > 0)
  }, [query, filter])

  const progressFor = useCallback((roadmap) => {
    const total = roadmapTotal(roadmap)
    const done = roadmapDone(roadmap)
    return { total, done }
  }, [])

  const renderCard = (roadmap) => (
    <RoadmapCard key={roadmap.id} roadmap={roadmap} progress={progressFor(roadmap)} />
  )

  return (
    <main className="career-page" id="top">
      <Navbar />

      <div className="career-shell">
        {/* 1 ── Hero ─────────────────────────────────────────────────────── */}
        <header className="career-hero">
          <p className="career-hero__eyebrow">Career roadmaps</p>
          <h1 className="career-hero__title">
            Your first job <em>is</em> a project.
          </h1>
          <p className="career-hero__sub">
            {CATEGORIES.length} career paths and tech tracks built for students,
            each one taking you from «learn» to «internship-ready» in lightweight stages.
          </p>
        </header>

        <PlatformNav />

        {/* 2 ── Why are you here? ────────────────────────────────────────── */}
        <CareerGoals activeGoal={activeGoal} onPickGoal={onPickGoal} />

        {/* 3 ── Search & filters ─────────────────────────────────────────── */}
        <CareerSearch query={query} onQuery={setQuery} filter={filter} onFilter={setFilter} />

        {/* 4 ── Grid ─────────────────────────────────────────────────────── */}
        {groups ? (
          groups.map(({ category, items }) => (
            <section key={category.key} className="career-group" aria-label={category.title}>
              <h2 className="career-group__title">{category.title}</h2>
              <p className="career-group__blurb">{category.blurb}</p>
              <div className="career-grid">{items.map(renderCard)}</div>
            </section>
          ))
        ) : matches.length > 0 ? (
          <section className="career-group" aria-label="Results">
            <h2 className="career-group__title">
              {query.trim() ? `Results for “${query}”` : 'Matching roadmaps'}
              <span className="career-group__count">{matches.length}</span>
            </h2>
            <div className="career-grid">{matches.map(renderCard)}</div>
          </section>
        ) : (
          <section className="career-group" aria-label="No results">
            <p className="career-empty">
              Nothing matches that (yet). Try a different search — or browse a category instead.
            </p>
          </section>
        )}

        {/* 5 ── Coming soon ──────────────────────────────────────────────── */}
        <section className="career-coming" aria-label="Coming soon">
          <h2 className="career-group__title">Coming soon</h2>
          <div className="career-coming__grid">
            {COMING_SOON.map((item) => (
              <button
                key={item.key}
                type="button"
                className="career-coming__card"
                onClick={() => setShowComingSoon(item)}
              >
                <span className="career-coming__icon" aria-hidden>{item.icon}</span>
                <span className="career-coming__label">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 6 ── Help me choose ───────────────────────────────────────────── */}
        <HelpMeChoose
          answers={answers}
          onAnswer={onAnswer}
          suggestion={choose.suggestion}
          suggestedIds={choose.ids}
        />
      </div>

      {showComingSoon && (
        <div className="career-modal" role="dialog" aria-modal="true" onClick={(event) => {
          if (event.target === event.currentTarget) setShowComingSoon(null)
        }}>
          <div className="career-modal__card">
            <span className="career-modal__icon" aria-hidden>{showComingSoon.icon}</span>
            <h3 className="career-modal__title">{showComingSoon.label} is coming soon</h3>
            <p className="career-modal__sub">
              This roadmap is being written right now. Pick a similar live path to
              get rolling in the meantime.
            </p>
            <button type="button" className="career-modal__close" onClick={() => setShowComingSoon(null)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </main>
  )
}