/**
 * FreshnessIndicator — static "as of" date for an update.
 * Demo content uses fixed dates; no live/relative simulation.
 */
import { useMemo } from 'react'
import { formatFullDate } from '../domain/relative-time'

export default function FreshnessIndicator({ updatedAt }) {
  const label = useMemo(() => formatFullDate(updatedAt), [updatedAt])
  if (!label) return null

  return <span className="campus-freshness">{label}</span>
}