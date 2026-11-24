import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  parseClassMarks,
  validateRelativeGrading,
  computeStatistics,
  rankInfo,
  estimateGrade,
  analyzeRelative,
  formatSignedNumber,
} from '../../src/features/tools/domain/relative-grading.js'

describe('Academic - Relative Grading Calculator (relative-grading.js)', () => {
  it('parses valid comma- or space-separated marks list', () => {
    const res = parseClassMarks('50, 60, 70 80\n90')
    assert.equal(res.ok, true)
    assert.deepEqual(res.marks, [50, 60, 70, 80, 90])
  })

  it('rejects invalid non-numeric tokens when parsing class marks', () => {
    const res = parseClassMarks('50, abc, 70')
    assert.equal(res.ok, false)
    assert.equal(res.invalid, 'abc')
  })

  it('computes accurate statistical metrics (mean, median, SD, min, max)', () => {
    // Dataset: [10, 20, 30, 40, 50]
    // n = 5
    // sum = 150, mean = 30
    // median = 30
    // min = 10, max = 50
    // variance = (( -20^2 + -10^2 + 0 + 10^2 + 20^2 )) / 5 = (400 + 100 + 0 + 100 + 400) / 5 = 1000 / 5 = 200
    // sd = sqrt(200) ≈ 14.1421356
    const stats = computeStatistics([10, 20, 30, 40, 50])
    assert.equal(stats.n, 5)
    assert.equal(stats.mean, 30)
    assert.equal(stats.median, 30)
    assert.equal(stats.lowest, 10)
    assert.equal(stats.highest, 50)
    assert.ok(Math.abs(stats.sd - Math.sqrt(200)) < 1e-6)

    // Even count dataset: [10, 20, 30, 40]
    // median = (20 + 30) / 2 = 25
    const even = computeStatistics([10, 20, 30, 40])
    assert.equal(even.median, 25)
  })

  it('computes rank and percentile relative to classmates', () => {
    const marks = [50, 60, 70, 80, 90]
    // Student scored 80:
    // marks above 80: [90] (1 person) => Rank 2 out of 5
    // marks at or below 80: [50, 60, 70, 80] (4 people) => Percentile = 4/5 * 100 = 80%
    const r1 = rankInfo(marks, 80)
    assert.equal(r1.rank, 2)
    assert.equal(r1.percentile, 80)

    // Highest score (90): Rank 1, 100th percentile
    const rTop = rankInfo(marks, 90)
    assert.equal(rTop.rank, 1)
    assert.equal(rTop.percentile, 100)
  })

  it('determines boundary-based letter grades correctly', () => {
    const boundaries = [
      { id: '1', label: 'A', min: 80 },
      { id: '2', label: 'B', min: 65 },
      { id: '3', label: 'C', min: 50 },
      { id: '4', label: 'F', min: null }, // catch-all
    ]

    assert.equal(estimateGrade(boundaries, 85).label, 'A')
    assert.equal(estimateGrade(boundaries, 80).label, 'A')
    assert.equal(estimateGrade(boundaries, 72).label, 'B')
    assert.equal(estimateGrade(boundaries, 55).label, 'C')
    assert.equal(estimateGrade(boundaries, 42).label, 'F')
    assert.equal(estimateGrade(boundaries, 42).catchAll, true)
  })

  it('computes z-score and full relative analysis', () => {
    const marks = [20, 40, 60, 80, 100] // mean = 60, sd = sqrt(800) ≈ 28.284
    const student = 80
    const boundaries = []
    const analysis = analyzeRelative(student, marks, boundaries, 'normal')

    assert.equal(analysis.diff, 20) // 80 - 60
    assert.ok(Math.abs(analysis.z - (20 / Math.sqrt(800))) < 1e-6)
    assert.equal(analysis.rank.rank, 2)
  })

  it('validates bounds and flags marks exceeding maximum', () => {
    const valid = validateRelativeGrading({
      max: '100',
      student: '85',
      classRaw: '60, 70, 80',
    })
    assert.equal(valid.ok, true)

    const overMax = validateRelativeGrading({
      max: '100',
      student: '110',
      classRaw: '60, 70, 80',
    })
    assert.equal(overMax.ok, false)
    assert.ok(overMax.errors.student.includes('cannot exceed the maximum'))
  })

  it('formats signed numbers correctly', () => {
    assert.equal(formatSignedNumber(5.2), '+5.20')
    assert.equal(formatSignedNumber(-3.14), '-3.14')
    assert.equal(formatSignedNumber(0), '0.00')
    assert.equal(formatSignedNumber(null), '')
  })
})
