/**
 * FreshnessIndicator — renders a human "how recent" label from ISO timestamps.
 */
import { useMemo } from 'react'
import { formatRelativeTime } from '../domain/relative-time'

export default function FreshnessIndicator({ updatedAt, publishedAt }) {
  const label = useMemo(() => formatRelativeTime(updatedAt), [updatedAt])
  if (!label) return null

  const wasRepublished = publishedAt && new Date(updatedAt) - new Date(publishedAt) > 60_000 * 60

  return (
    <span className="campus-freshness" title={new Date(updatedAt).toLocaleString()}>
      {wasRepublished ? <span className="campus-freshness__dot" aria-hidden="true" /> : null}
      {label}
    </span>
  )
}