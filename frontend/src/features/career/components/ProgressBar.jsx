/**
 * Horizontal progress bar used on cards and the detail page.
 *
 * Pure presentational component — progress values are computed by the pages.
 */
import { memo } from 'react'

function ProgressBar({ done = 0, total = 0 }) {
  const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0

  return (
    <div className="career-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="career-progress__bar" style={{ width: `${pct}%` }} />
      <span className="career-progress__label">
        {done}/{total} done
      </span>
    </div>
  )
}

export default memo(ProgressBar)