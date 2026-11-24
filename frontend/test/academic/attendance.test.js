import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { computeAttendance } from '../../src/features/tools/domain/attendance.js'

describe('Academic - Attendance Calculator (computeAttendance)', () => {
  it('returns empty status when total classes is 0 or negative', () => {
    const zeroTotal = computeAttendance({ total: 0, attended: 0, threshold: 75, perWeek: 4 })
    assert.deepEqual(zeroTotal, {
      percentage: null,
      status: 'empty',
      canSkip: 0,
      canSkipWeeks: 0,
      needAttend: 0,
      needWeeks: 0,
    })

    const negativeTotal = computeAttendance({ total: -10, attended: 5, threshold: 75, perWeek: 4 })
    assert.equal(negativeTotal.status, 'empty')
    assert.equal(negativeTotal.percentage, null)
  })

  it('calculates exactly 75% attendance correctly', () => {
    const res = computeAttendance({ total: 40, attended: 30, threshold: 75, perWeek: 4 })
    assert.equal(res.percentage, 75)
    assert.equal(res.status, 'good')
    assert.equal(res.canSkip, 0)
    assert.equal(res.canSkipWeeks, 0)
    assert.equal(res.needAttend, 0)
    assert.equal(res.needWeeks, 0)
  })

  it('calculates above threshold correctly and computes skippable classes', () => {
    // 36 attended out of 40 = 90%. Target is 75%.
    // To stay at or above 75%: 36 / (40 + x) >= 0.75 => 40 + x <= 48 => x <= 8
    const res = computeAttendance({ total: 40, attended: 36, threshold: 75, perWeek: 4 })
    assert.equal(res.percentage, 90)
    assert.equal(res.status, 'good')
    assert.equal(res.canSkip, 8)
    assert.equal(res.canSkipWeeks, 2)
    assert.equal(res.needAttend, 0)
    assert.equal(res.needWeeks, 0)
  })

  it('calculates below threshold correctly and computes required recovery classes', () => {
    // 20 attended out of 40 = 50%. Target is 75%.
    // (20 + x) / (40 + x) >= 0.75 => 20 + x >= 30 + 0.75x => 0.25x >= 10 => x >= 40 classes
    const res = computeAttendance({ total: 40, attended: 20, threshold: 75, perWeek: 5 })
    assert.equal(res.percentage, 50)
    assert.equal(res.status, 'need')
    assert.equal(res.canSkip, 0)
    assert.equal(res.canSkipWeeks, 0)
    assert.equal(res.needAttend, 40)
    assert.equal(res.needWeeks, 8)
  })

  it('clamps attended classes within [0, total]', () => {
    // Negative attended should clamp to 0
    const neg = computeAttendance({ total: 20, attended: -5, threshold: 75, perWeek: 4 })
    assert.equal(neg.percentage, 0)
    assert.equal(neg.needAttend, 60)

    // Attended greater than total should clamp to total
    const over = computeAttendance({ total: 20, attended: 25, threshold: 75, perWeek: 4 })
    assert.equal(over.percentage, 100)
    assert.equal(over.canSkip, 6)
  })

  it('handles custom thresholds and zero perWeek gracefully', () => {
    // 85% threshold with 0 perWeek
    const res = computeAttendance({ total: 100, attended: 90, threshold: 85, perWeek: 0 })
    assert.equal(res.percentage, 90)
    assert.equal(res.status, 'good')
    assert.equal(res.canSkip, 5) // 90 / 0.85 - 100 = 105.88 - 100 = 5
    assert.equal(res.canSkipWeeks, 0) // perWeek is 0, so weeks is 0

    // 100% threshold
    const full = computeAttendance({ total: 50, attended: 45, threshold: 100, perWeek: 5 })
    assert.equal(full.percentage, 90)
    assert.equal(full.status, 'need')
    assert.equal(full.canSkip, 0)
  })
})
