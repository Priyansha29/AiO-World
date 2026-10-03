import { useState } from 'react'
import NumberField from '../fields/NumberField'
import { formatNumber, formatPercent } from '../../domain/percentage'
import {
  analyzeRelative,
  formatSignedNumber,
  validateRelativeGrading,
} from '../../domain/relative-grading'

const METHODS = [
  { key: 'zscore', label: 'Z-score analysis' },
  { key: 'boundaries', label: 'Custom grade boundaries' },
]

const DEFAULT_BOUNDARIES = [
  { id: 'bound-A+', label: 'A+', min: '90' },
  { id: 'bound-A', label: 'A', min: '80' },
  { id: 'bound-B+', label: 'B+', min: '70' },
  { id: 'bound-B', label: 'B', min: '60' },
  { id: 'bound-C', label: 'C', min: '50' },
  { id: 'bound-D', label: 'D', min: '40' },
  { id: 'bound-F', label: 'F', min: '' },
]

let boundaryCounter = 100

function newBoundaryId() {
  boundaryCounter += 1
  return `bound-${boundaryCounter}`
}

function Stat({ label, value, sub, modifier }) {
  return (
    <div className={`tool-stat${modifier ? ` tool-stat--${modifier}` : ''}`}>
      <span className="tool-stat__label">{label}</span>
      <span className="tool-stat__value">{value}</span>
      {sub && <span className="tool-stat__sub">{sub}</span>}
    </div>
  )
}

function Histogram({ histogram }) {
  if (!histogram) return null
  if (histogram.flat) {
    return <p className="tool-result__note">Distribution is flat — every class mark is the same.</p>
  }
  const { bins, width } = histogram
  const maxCount = Math.max(...bins.map((bin) => bin.count), 1)
  return (
    <div className="histogram" aria-label="Distribution of the class marks">
      <p className="tool-result__note">Distribution of the class marks — your mark&apos;s bin is highlighted.</p>
      <div className="histogram__chart">
        {bins.map((bin) => {
          const barHeight = bin.count === 0 ? 0 : Math.max(4, Math.round((bin.count / maxCount) * 110))
          return (
            <div
              className="histogram__bar-group"
              key={bin.start}
              title={`${bin.start}–${bin.start + width - 1}: ${bin.count} mark${bin.count === 1 ? '' : 's'}`}
            >
              <span
                className={`histogram__bar${bin.you ? ' histogram__bar--student' : ''}`}
                style={{ height: `${barHeight}px` }}
              >
                {barHeight >= 14 ? bin.count : ''}
              </span>
              {bin.you && <span className="histogram__you" style={{ bottom: `${barHeight + 4}px` }}>you</span>}
            </div>
          )
        })}
      </div>
      <div className="histogram__axis">
        <span>{bins[0].start}</span>
        <span>{bins[bins.length - 1].start + width - 1}</span>
      </div>
    </div>
  )
}

function RelativeGradingCalculator() {
  const [method, setMethod] = useState(METHODS[0].key)
  const [student, setStudent] = useState('')
  const [classRaw, setClassRaw] = useState('')
  const [max, setMax] = useState('')
  const [boundaries, setBoundaries] = useState(DEFAULT_BOUNDARIES)
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)

  const clearError = (key) => {
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current))
  }

  const selectMethod = (key) => {
    setMethod(key)
    setErrors({})
    setResult(null)
  }

  const updateBoundary = (id, patch) => {
    setBoundaries((list) => list.map((boundary) => (boundary.id === id ? { ...boundary, ...patch } : boundary)))
    setErrors((current) => (current.boundaries ? { ...current, boundaries: undefined } : current))
  }

  const addBoundary = () => {
    setBoundaries((list) => [...list, { id: newBoundaryId(), label: '', min: '' }])
    setErrors((current) => (current.boundaries ? { ...current, boundaries: undefined } : current))
  }

  const removeBoundary = (id) => {
    setBoundaries((list) => (list.length > 1 ? list.filter((boundary) => boundary.id !== id) : list))
    setErrors((current) => (current.boundaries ? { ...current, boundaries: undefined } : current))
  }

  const reset = () => {
    setStudent('')
    setClassRaw('')
    setMax('')
    setBoundaries(DEFAULT_BOUNDARIES)
    setErrors({})
    setResult(null)
  }

  const calculate = (event) => {
    event.preventDefault()
    const validation = validateRelativeGrading({ student, classRaw, max, method, boundaries })
    if (!validation.ok) {
      setErrors(validation.errors)
      setResult(null)
      if (validation.errors.student) document.getElementById('relative-student')?.focus()
      else if (validation.errors.classRaw) document.getElementById('relative-classRaw')?.focus()
      else if (validation.errors.max) document.getElementById('relative-max')?.focus()
      else if (validation.errors.boundaries) {
        const firstError = validation.errors.boundaries.findIndex((message) => message !== '')
        if (firstError >= 0) document.getElementById(`relative-bound-min-${firstError}`)?.focus()
      }
      return
    }
    setErrors({})
    setResult({ ...analyzeRelative(validation.values.student, validation.values.marks, validation.values.boundaries, method), max: validation.values.max })
  }

  const grade = result?.grade ?? null
  const gradeRule = grade
    ? grade.catchAll
      ? grade.below != null
        ? `below ${formatNumber(grade.below)} → ${grade.label}`
        : `any mark → ${grade.label}`
      : `${formatNumber(result.student)} ≥ ${formatNumber(grade.min)} → ${grade.label}`
    : null

  return (
    <div className="tool-panel">
      <h2 className="tool-panel__title">Your marks and the class</h2>

      <p className="tool-note">
        Relative grading differs between universities and instructors — this shows where you stand in the marks you enter, not an official grade.
      </p>

      <form className="tool-form" onSubmit={calculate} noValidate>
        <div className="tool-fields tool-fields--grid">
          <NumberField
            id="relative-student"
            label="Your marks"
            value={student}
            min={0}
            onChange={(raw) => {
              setStudent(raw)
              clearError('student')
            }}
            error={errors.student}
            placeholder="e.g. 78"
          />
          <NumberField
            id="relative-max"
            label="Maximum marks (optional)"
            value={max}
            min={0}
            onChange={(raw) => {
              setMax(raw)
              clearError('max')
            }}
            error={errors.max}
            placeholder="e.g. 100"
          />
        </div>

        <div className="tool-field">
          <label className="tool-field__label" htmlFor="relative-classRaw">
            Class marks
          </label>
          <span className={`tool-field__control${errors.classRaw ? ' tool-field__control--invalid' : ''}`}>
            <textarea
              id="relative-classRaw"
              className="tool-textarea"
              rows={4}
              value={classRaw}
              placeholder="92, 85, 81, 78, 75, 71, 68, 65, 60"
              aria-invalid={errors.classRaw ? true : undefined}
              aria-describedby={errors.classRaw ? 'relative-classRaw-error' : undefined}
              onChange={(event) => {
                setClassRaw(event.target.value)
                clearError('classRaw')
              }}
            />
          </span>
          <span className="tool-field__hint">Separate marks with commas, spaces or new lines.</span>
          {errors.classRaw && (
            <span id="relative-classRaw-error" className="tool-field__error" role="alert">
              {errors.classRaw}
            </span>
          )}
        </div>

        <div className="tool-modes tool-modes--spaced" role="group" aria-label="Grading analysis method">
          {METHODS.map((item) => (
            <button
              type="button"
              key={item.key}
              className={`tool-mode${method === item.key ? ' tool-mode--active' : ''}`}
              aria-pressed={method === item.key}
              onClick={() => selectMethod(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {method === 'boundaries' && (
          <section className="tool-bounds" aria-label="Custom grade boundaries">
            <h3 className="tool-bounds__title">Custom grade boundaries</h3>
            <p className="tool-bounds__hint">
              These rows are the example scheme shown below and in the task — edit them freely. A blank minimum on one row acts as the catch-all for marks below every other row (for example “F”). They are your configuration, never an official scheme.
            </p>
            <div className="bounds-rows__head">
              <span>Grade</span>
              <span>Minimum marks</span>
              <span aria-hidden />
            </div>
            <div className="bounds-rows">
              {boundaries.map((boundary, index) => (
                <div className="bounds-row" key={boundary.id}>
                  <input
                    className="tool-input"
                    value={boundary.label}
                    placeholder="A+"
                    aria-label={`Grade ${index + 1} label`}
                    onChange={(event) => updateBoundary(boundary.id, { label: event.target.value })}
                  />
                  <input
                    id={`relative-bound-min-${index}`}
                    className="tool-input"
                    value={boundary.min}
                    placeholder="Min mark"
                    inputMode="decimal"
                    aria-label={`Minimum marks for grade ${index + 1}`}
                    aria-invalid={errors.boundaries?.[index] ? true : undefined}
                    onChange={(event) => updateBoundary(boundary.id, { min: event.target.value })}
                  />
                  <button
                    type="button"
                    className="bounds-row__remove"
                    disabled={boundaries.length <= 1}
                    aria-label={`Remove grade ${boundary.label || index + 1}`}
                    onClick={() => removeBoundary(boundary.id)}
                  >
                    ✕
                  </button>
                  {errors.boundaries?.[index] && (
                    <span className="tool-field__error bounds-row__error" role="alert">
                      {errors.boundaries[index]}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="bounds-actions">
              <button type="button" className="tool-btn" onClick={addBoundary}>
                Add grade
              </button>
            </div>
          </section>
        )}

        <div className="tool-actions">
          <button type="submit" className="tool-btn tool-btn--primary">
            Calculate
          </button>
          <button type="button" className="tool-btn tool-btn--ghost" onClick={reset}>
            Reset
          </button>
        </div>
      </form>

      {result && result.stats && (
        <div className="tool-result tool-result--dashboard" role="status" aria-live="polite">
          <h3 className="grading-block__title">Where your mark sits</h3>
          <div className="tool-dashboard">
            <Stat label="Class size" value={formatNumber(result.stats.n)} sub="students entered" />
            <Stat label="Your mark" value={formatNumber(result.student)} sub={result.max ? `out of ${formatNumber(result.max)}` : undefined} modifier="student" />
            <Stat label="Class average (mean)" value={formatNumber(result.stats.mean)} />
            <Stat label="Median" value={formatNumber(result.stats.median)} />
            <Stat label="Highest mark" value={formatNumber(result.stats.highest)} />
            <Stat label="Lowest mark" value={formatNumber(result.stats.lowest)} />
            <Stat label="Standard deviation" value={formatNumber(result.stats.sd)} sub="whole class (n)" />
            <Stat label="Difference from average" value={formatSignedNumber(result.diff)} />
            <Stat label="Percentile (at or above)" value={formatPercent(result.rank.percentile)} />
            <Stat label="Class rank" value={`${formatNumber(result.rank.rank)} / ${formatNumber(result.rank.n)}`} sub="1 = highest" />
          </div>
          <p className="tool-result__note">
            Percentile is the share of the class at or below your mark (equal marks count together). Rank counts how many scored strictly higher.
          </p>

          <Histogram histogram={result.histogram} />

          {method === 'zscore' ? (
            <div className="grading-block">
              <h3 className="grading-block__title">Z-score analysis</h3>
              {result.z !== null ? (
                <>
                  <div className="tool-result__row">
                    <span className="tool-result__label">z = (your mark − class average) ÷ standard deviation</span>
                    <span className="tool-result__value">{formatNumber(result.z)}</span>
                  </div>
                  <p className="tool-result__note">
                    {Math.abs(result.z).toFixed(2)} standard deviation{Math.abs(result.z) === 1 ? '' : 's'}{' '}
                    {result.z >= 0 ? 'above' : 'below'} the class average. A z-score describes your position relative to the class — it does not assign an official grade.
                  </p>
                </>
              ) : result.stats.n === 1 ? (
                <div className="tool-result__verdict tool-result__verdict--none">
                  <strong>z-score needs more spread</strong>
                  You entered a single class mark, so there is nothing to compare against — add more class marks to get a z-score.
                </div>
              ) : (
                <div className="tool-result__verdict tool-result__verdict--none">
                  <strong>z-score is undefined here</strong>
                  All class marks are identical (standard deviation is 0), so a z-score cannot distinguish you from the class. The statistics still describe the class accurately.
                </div>
              )}
            </div>
          ) : (
            <div className="grading-block">
              <h3 className="grading-block__title">Estimated grade</h3>
              <p className="tool-note">Based on your configured boundaries — not a fixed rule, not an official grade.</p>
              {grade ? (
                <>
                  <span className="grade-badge">{grade.label}</span>
                  <p className="tool-result__note">
                    {gradeRule} in the boundaries you set. Your instructor or college may use a different scheme.
                  </p>
                </>
              ) : (
                <div className="tool-result__verdict tool-result__verdict--none">
                  <strong>No boundary matches your mark</strong>
                  Add a grade row with a minimum at or below {formatNumber(result.student)}, or raise the example rows.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RelativeGradingCalculator