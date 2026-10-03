import { useState } from 'react'
import NumberField from '../fields/NumberField'
import {
  formatNumber,
  formatPercent,
  formatSignedPercent,
  marksPercentage,
  percentOfNumber,
  percentageChange,
  reversePercentage,
  validateMarksPercentage,
  validatePercentOfNumber,
  validatePercentageChange,
  validateReversePercentage,
} from '../../domain/percentage'

const MODES = [
  { key: 'marks-percentage', label: 'Marks Percentage' },
  { key: 'percent-of-number', label: 'Percentage of a Number' },
  { key: 'percentage-change', label: 'Percentage Change' },
  { key: 'reverse-percentage', label: 'Reverse Percentage' },
]

const MODE_FIELDS = {
  'marks-percentage': [
    { key: 'obtained', label: 'Obtained marks' },
    { key: 'total', label: 'Total marks' },
  ],
  'percent-of-number': [
    { key: 'percent', label: 'Percentage', suffix: '%' },
    { key: 'number', label: 'Number' },
  ],
  'percentage-change': [
    { key: 'original', label: 'Original value' },
    { key: 'new', label: 'New value' },
  ],
  'reverse-percentage': [
    { key: 'value', label: 'Value' },
    { key: 'percent', label: 'Percentage', suffix: '%' },
  ],
}

const VALIDATORS = {
  'marks-percentage': validateMarksPercentage,
  'percent-of-number': validatePercentOfNumber,
  'percentage-change': validatePercentageChange,
  'reverse-percentage': validateReversePercentage,
}

function buildResult(mode, values) {
  switch (mode) {
    case 'marks-percentage': {
      const value = marksPercentage(values.obtained, values.total)
      return { title: 'Your percentage', value: formatPercent(value) }
    }
    case 'percent-of-number': {
      const value = percentOfNumber(values.percent, values.number)
      return { title: `${formatNumber(values.percent)}% of ${formatNumber(values.number)}`, value: formatNumber(value) }
    }
    case 'percentage-change': {
      const value = percentageChange(values.original, values.new)
      const verdict = value > 0 ? 'Increase' : value < 0 ? 'Decrease' : 'No change'
      const variant = value > 0 ? 'up' : value < 0 ? 'down' : 'none'
      return { title: 'Percentage change', value: formatSignedPercent(value), verdict, variant }
    }
    case 'reverse-percentage': {
      const value = reversePercentage(values.value, values.percent)
      return {
        title: `${formatNumber(values.value)} is ${formatNumber(values.percent)}% of what?`,
        value: formatNumber(value),
      }
    }
    default:
      return null
  }
}

function MarksPercentageCalculator() {
  const [mode, setMode] = useState('marks-percentage')
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)

  const fields = MODE_FIELDS[mode]

  const selectMode = (key) => {
    setMode(key)
    setErrors({})
    setResult(null)
  }

  const setField = (key, raw) => {
    setValues((current) => ({ ...current, [key]: raw }))
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current))
  }

  const reset = () => {
    setValues({})
    setErrors({})
    setResult(null)
  }

  const calculate = (event) => {
    event.preventDefault()
    const validation = VALIDATORS[mode](values)
    if (!validation.ok) {
      setErrors(validation.errors)
      setResult(null)
      const firstKey = MODE_FIELDS[mode].find((field) => validation.errors[field.key])?.key
      if (firstKey) document.getElementById(`percent-${firstKey}`)?.focus()
      return
    }
    setErrors({})
    setResult(buildResult(mode, validation.values))
  }

  return (
    <div className="tool-panel">
      <h2 className="tool-panel__title">What do you want to work out?</h2>

      <div className="tool-modes" role="group" aria-label="Calculation mode">
        {MODES.map((item) => (
          <button
            type="button"
            key={item.key}
            className={`tool-mode${mode === item.key ? ' tool-mode--active' : ''}`}
            aria-pressed={mode === item.key}
            onClick={() => selectMode(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form className="tool-form" onSubmit={calculate} noValidate>
        <div className="tool-fields tool-fields--grid">
          {fields.map((field) => (
            <NumberField
              key={field.key}
              id={`percent-${field.key}`}
              label={field.label}
              suffix={field.suffix}
              min={field.suffix ? 0 : undefined}
              value={values[field.key] ?? ''}
              onChange={(raw) => setField(field.key, raw)}
              error={errors[field.key]}
            />
          ))}
        </div>

        <div className="tool-actions">
          <button type="submit" className="tool-btn tool-btn--primary">
            Calculate
          </button>
          <button type="button" className="tool-btn tool-btn--ghost" onClick={reset}>
            Reset
          </button>
        </div>
      </form>

      {result && (
        <div className="tool-result" role="status" aria-live="polite">
          <div className="tool-result__row">
            <span className="tool-result__label">{result.title}</span>
            <span className="tool-result__value">{result.value}</span>
          </div>
          {result.verdict && (
            <div className={`tool-result__verdict tool-result__verdict--${result.variant}`}>
              {result.verdict}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MarksPercentageCalculator