import { useState } from 'react'
import { GRADE_SCALE, calculateSemesterGpa, gradePoints, projectCgpa, requiredSgpaForTarget } from '../../domain/gpa'
import { copyText } from '../../utils/copy'

let rowSeq = 0
const nextId = () => `row-${++rowSeq}`

function emptyRow() {
  return { id: nextId(), name: '', credit: '3', grade: '' }
}

function NumberField({ label, value, onChange, min = 0, placeholder }) {
  return (
    <label className="tool-field">
      <span className="tool-field__label">{label}</span>
      <span className="tool-field__control">
        <input
          className="tool-input"
          type="number"
          inputMode="decimal"
          min={min}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  )
}

const toNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function CgpaCalculator() {
  const [rows, setRows] = useState(() => [emptyRow()])
  const [prevCgpa, setPrevCgpa] = useState('')
  const [prevCredits, setPrevCredits] = useState('')
  const [targetCgpa, setTargetCgpa] = useState('')
  const [copied, setCopied] = useState(false)

  const update = (id, patch) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)))

  const removeRow = (id) => setRows((current) => current.filter((row) => row.id !== id))

  const addRow = () => setRows((current) => [...current, emptyRow()])

  const completeRows = rows.filter((row) => toNumber(row.credit) > 0 && row.grade !== '')
  const pendingRows = rows.filter((row) => toNumber(row.credit) > 0 && row.grade === '')

  const semester = calculateSemesterGpa(completeRows)
  const hasPrev = toNumber(prevCgpa) > 0 && toNumber(prevCredits) > 0
  const projected = hasPrev
    ? projectCgpa(toNumber(prevCgpa), toNumber(prevCredits), semester.earned, semester.totalCredits)
    : null
  const target = toNumber(targetCgpa)
  const required = hasPrev && target > 0 ? requiredSgpaForTarget(toNumber(prevCgpa), toNumber(prevCredits), semester.totalCredits, target) : null
  const alreadyHit = required != null && required <= 0

  const copy = async () => {
    const lines = [
      `Semester grade point average: ${semester.sgpa == null ? '—' : semester.sgpa.toFixed(2)}`,
      `Credits this semester: ${semester.totalCredits}`,
    ]
    if (projected != null) lines.push(`Projected CGPA: ${projected.toFixed(2)}`)
    if (required != null) {
      lines.push(alreadyHit ? 'You already meet your target CGPA.' : `Required SGPA to reach target: ${required.toFixed(2)}`)
    }
    const ok = await copyText(lines.join('\n'))
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    }
  }

  return (
    <div className="tool-stack">
      <section className="tool-panel">
        <h2 className="tool-panel__title">Subjects this semester</h2>
        <div className="gpa-rows" role="table" aria-label="Subject grades">
          <div className="gpa-rows__head" role="row">
            <span role="columnheader">Subject</span>
            <span role="columnheader">Credits</span>
            <span role="columnheader">Grade</span>
            <span aria-hidden="true" />
          </div>
          {rows.map((row) => (
            <div className="gpa-row" role="row" key={row.id}>
              <input
                className="tool-input"
                type="text"
                placeholder="e.g. Data Structures"
                value={row.name}
                aria-label="Subject name"
                onChange={(event) => update(row.id, { name: event.target.value })}
              />
              <input
                className="tool-input tool-input--credit"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                value={row.credit}
                aria-label="Credits"
                onChange={(event) => update(row.id, { credit: event.target.value })}
              />
              <select
                className="tool-select"
                value={row.grade}
                aria-label={`Grade for ${row.name || 'subject'}`}
                onChange={(event) => update(row.id, { grade: event.target.value })}
              >
                <option value="">Grade</option>
                {GRADE_SCALE.map((grade) => (
                  <option key={grade.key} value={grade.key}>
                    {grade.key} ({gradePoints(grade.key)})
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="gpa-row__remove"
                aria-label={`Remove ${row.name || 'subject'}`}
                onClick={() => removeRow(row.id)}
                disabled={rows.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="tool-btn tool-btn--ghost" onClick={addRow}>
          + Add subject
        </button>
      </section>

      <section className="tool-panel">
        <h2 className="tool-panel__title">Plan a target (optional)</h2>
        <div className="tool-fields tool-fields--grid">
          <NumberField label="Previous CGPA" value={prevCgpa} onChange={setPrevCgpa} min={0} placeholder="e.g. 8.2" />
          <NumberField label="Previous credits" value={prevCredits} onChange={setPrevCredits} min={0} placeholder="e.g. 60" />
          <NumberField label="Target CGPA" value={targetCgpa} onChange={setTargetCgpa} min={0} placeholder="e.g. 8.5" />
        </div>
        {!hasPrev && (target > 0 || prevCgpa !== '' || prevCredits !== '') && (
          <p className="tool-note">Enter both a previous CGPA and its credits to project a new CGPA.</p>
        )}
      </section>

      {semester.sgpa == null && pendingRows.length === 0 ? (
        <p className="tool-note">Add a subject and pick a grade to see your semester average.</p>
      ) : (
        <div className="tool-result" role="status" aria-live="polite">
          <div className="tool-result__row">
            <span className="tool-result__label">Semester GPA (SGPA)</span>
            <span className="tool-result__value">{semester.sgpa == null ? '—' : semester.sgpa.toFixed(2)}</span>
          </div>
          <p className="tool-result__note">{semester.totalCredits} credit{semester.totalCredits === 1 ? '' : 's'} this semester.</p>

          {projected != null && (
            <div className="tool-result__row">
              <span className="tool-result__label">Projected CGPA</span>
              <span className="tool-result__value">{projected.toFixed(2)}</span>
            </div>
          )}

          {required != null && (
            <div className={`tool-result__verdict ${alreadyHit ? 'tool-result__verdict--good' : 'tool-result__verdict--need'}`}>
              {alreadyHit ? (
                <>
                  <strong>You already meet your target.</strong>
                  <span> A {semester.sgpa == null ? '—' : semester.sgpa.toFixed(2)} this semester keeps you above {target.toFixed(2)}.</span>
                </>
              ) : (
                <>
                  <strong>Need an SGPA of {required.toFixed(2)}</strong>
                  <span> this semester to reach {target.toFixed(2)} overall.</span>
                </>
              )}
            </div>
          )}

          {pendingRows.length > 0 && (
            <p className="tool-note">{pendingRows.length} subject{pendingRows.length === 1 ? '' : 's'} still need a grade.</p>
          )}

          <button type="button" className="tool-btn tool-btn--ghost" onClick={copy}>
            {copied ? 'Copied' : 'Copy summary'}
          </button>
        </div>
      )}
    </div>
  )
}

export default CgpaCalculator