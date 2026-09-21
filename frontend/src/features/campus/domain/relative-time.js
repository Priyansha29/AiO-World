/**
 * Static date formatting for campus information.
 *
 * Demo content uses fixed dates — nothing here simulates a live feed, so
 * relative "x minutes ago" precision is deliberately avoided.
 */
export function formatFullDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Compact date chip, e.g. "SEP 21". */
export function formatShortDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date
    .toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
    .toUpperCase()
}