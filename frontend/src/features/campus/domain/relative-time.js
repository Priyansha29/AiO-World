/**
 * Relative-time formatting for freshness indicators.
 * Pure metadata formatting; never implies a live feed.
 */
export function formatRelativeTime(iso) {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diffMs = Date.now() - then
  if (diffMs < 60_000) return 'Updated just now'
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 60) return `Updated ${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Updated ${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Updated yesterday'
  if (days < 7) return `Updated ${days} days ago`
  return `Published ${new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })}`
}