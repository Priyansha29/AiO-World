export function computeAttendance({ total, attended, threshold, perWeek }) {
  const safeTotal = Number.isFinite(total) && total > 0 ? total : 0
  const safeAttended = Math.min(Math.max(Number.isFinite(attended) ? attended : 0, 0), safeTotal)
  const safeThreshold = Number.isFinite(threshold) ? Math.min(Math.max(threshold, 1), 100) : 75
  const safeWeek = Number.isFinite(perWeek) && perWeek > 0 ? perWeek : 0

  if (safeTotal === 0) {
    return {
      percentage: null,
      status: 'empty',
      canSkip: 0,
      canSkipWeeks: 0,
      needAttend: 0,
      needWeeks: 0,
    }
  }

  const percentage = (safeAttended / safeTotal) * 100

  let canSkip = 0
  if (safeThreshold < 100) {
    canSkip = Math.max(Math.floor((100 * safeAttended) / safeThreshold - safeTotal), 0)
  } else {
    canSkip = safeAttended >= safeTotal ? 0 : 0
  }

  let needAttend = 0
  if (percentage < safeThreshold && safeThreshold < 100) {
    needAttend = Math.ceil((safeThreshold * safeTotal - 100 * safeAttended) / (100 - safeThreshold))
    needAttend = Math.max(needAttend, 0)
  }

  const status = percentage >= safeThreshold ? 'good' : 'need'

  return {
    percentage,
    status,
    canSkip,
    canSkipWeeks: safeWeek > 0 ? Math.floor(canSkip / safeWeek) : 0,
    needAttend,
    needWeeks: safeWeek > 0 ? Math.ceil(needAttend / safeWeek) : 0,
  }
}