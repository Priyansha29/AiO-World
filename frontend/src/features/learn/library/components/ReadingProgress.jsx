/**
 * Reading progress meter shown on cards and shelf rows.
 *
 * Pure presentational — the page passes a ReadingProgress record. Where the
 * figure cannot honestly be calculated (PDFs, external books) the record has
 * no `progress`, and the meter simply falls back to a neutral "opened" chip.
 */
import { memo } from 'react'

function ReadingProgress({ progress }) {
  if (!progress) {
    return <span className="lib-progress lib-progress--none">Not started</span>
  }

  const pct = Math.round((progress.progress ?? 0) * 100)
  const hasFraction = typeof progress.progress === 'number' && progress.progress > 0

  return (
    <div className="lib-progress">
      <div className="lib-progress__track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="lib-progress__fill" style={{ width: `${pct}%` }} />
      </div>
      {hasFraction || progress.completed ? (
        <span className="lib-progress__label">
          {progress.completed && pct >= 100 ? 'Completed' : `${pct}% read`}
        </span>
      ) : (
        <span className="lib-progress__label">Opened</span>
      )}
    </div>
  )
}

export default memo(ReadingProgress)