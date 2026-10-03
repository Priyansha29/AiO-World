import { useMemo, useState } from 'react'
import { computeAttendance } from '../../domain/attendance'
import { copyText } from '../../utils/copy'

function NumberField({ label, value, onChange, suffix, hint, min = 0 }) {
  return (
    <label className="tool-field">
      <span className="tool-field__label">{label}</span>
      <span className="tool-field__control">
        <input
          className="tool-input"
          type="number"
          inputMode="decimal"
          min={min}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix && <span className="tool-field__suffix">{suffix}</span>}
      </span>
      {hint && <span className="tool-field__hint">{hint}</span>}
    </label>
  )
}

const toNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function AttendanceCalculator() {
  const [total, setTotal] = useState('60')
  const [attended, setAttended] = useState('48')
  const [threshold, setThreshold] = useState('75')
  const [perWeek, setPerWeek] = useState('')
  const [copied, setCopied] = useState(false)

  const result = useMemo(
    () => computeAttendance({ total: toNumber(total), attended: toNumber(attended), threshold: toNumber(threshold), perWeek: toNumber(perWeek) }),
    [total, attended, threshold, perWeek],
  )

  const copy = async () => {
    const lines = [
      `Attendance: ${result.percentage == null ? '—' : result.percentage.toFixed(1)}%`,
      result.status === 'good'
        ? `You can miss up to ${result.canSkip} more class${result.canSkip === 1 ? '' : 'es'}.`
        : `Attend ${result.needAttend} consecutive class${result.needAttend === 1 ? '' : 'es'} to recover to ${threshold}%.`,
    ]
    const ok = await copyText(lines.join('\n'))
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    }
  }

  return (
    <div className="tool-panel">
      <h2 className="tool-panel__title">Classroom attendance</h2>
      <div className="tool-fields tool-fields--grid">
        <NumberField
          label="Classes held"
          value={total}
          onChange={setTotal}
          min={0}
        />
        <NumberField
          label="Classes attended"
          value={attended}
          onChange={setAttended}
          min={0}
        />
        <NumberField
          label="Required attendance"
          value={threshold}
          onChange={setThreshold}
          suffix="%"
          min={1}
        />
        <NumberField
          label="Classes per week"
          value={perWeek}
          onChange={setPerWeek}
          suffix=""
          hint="Optional — adds a weeks estimate"
        />
      </div>

      {result.percentage == null ? (
        <p className="tool-note">Enter the number of classes held to see your attendance.</p>
      ) : (
        <div className="tool-result" role="status" aria-live="polite">
          <div className="tool-result__row">
            <span className="tool-result__label">Current attendance</span>
            <span className="tool-result__value">{result.percentage.toFixed(1)}%</span>
          </div>

          {result.status === 'good' ? (
            <div className="tool-result__verdict tool-result__verdict--good">
              <strong>You can miss up to {result.canSkip} more class{result.canSkip === 1 ? '' : 'es'}</strong>
              <span> and still stay at or above {threshold}%.</span>
            </div>
          ) : (
            <div className="tool-result__verdict tool-result__verdict--need">
              <strong>Attend {result.needAttend} consecutive class{result.needAttend === 1 ? '' : 'es'}</strong> to reach
              <span> {threshold}% from {result.percentage.toFixed(1)}%.</span>
            </div>
          )}

          {result.canSkipWeeks > 0 && (
            <p className="tool-result__note">At {perWeek} classes a week, that is roughly {result.canSkipWeeks} week{result.canSkipWeeks === 1 ? '' : 's'} of slack.</p>
          )}
          {result.needWeeks > 0 && (
            <p className="tool-result__note">At {perWeek} classes a week, that is about {result.needWeeks} week{result.needWeeks === 1 ? '' : 's'} of unbroken attendance.</p>
          )}

          <button type="button" className="tool-btn tool-btn--ghost" onClick={copy}>
            {copied ? 'Copied' : 'Copy summary'}
          </button>
        </div>
      )}
    </div>
  )
}

export default AttendanceCalculator