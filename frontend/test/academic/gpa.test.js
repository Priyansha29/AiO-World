import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  gradePoints,
  calculateSemesterGpa,
  projectCgpa,
  requiredSgpaForTarget,
} from '../../src/features/tools/domain/gpa.js'

describe('Academic - GPA Calculator (gpa.js)', () => {
  it('maps valid grades to grade points and defaults unknown grades to 0', () => {
    assert.equal(gradePoints('A+'), 10)
    assert.equal(gradePoints('A'), 9)
    assert.equal(gradePoints('B+'), 8)
    assert.equal(gradePoints('B'), 7)
    assert.equal(gradePoints('C+'), 6)
    assert.equal(gradePoints('C'), 5)
    assert.equal(gradePoints('D'), 4)
    assert.equal(gradePoints('F'), 0)
    assert.equal(gradePoints('UNKNOWN'), 0)
    assert.equal(gradePoints(null), 0)
  })

  it('calculates weighted semester SGPA accurately for valid subjects', () => {
    const rows = [
      { credit: 4, grade: 'A+' }, // 4 * 10 = 40
      { credit: 3, grade: 'A' },  // 3 * 9  = 27
      { credit: 3, grade: 'B+' }, // 3 * 8  = 24
      { credit: 2, grade: 'B' },  // 2 * 7  = 14
    ]
    // Total credits = 12. Total earned = 105. SGPA = 105 / 12 = 8.75
    const result = calculateSemesterGpa(rows)
    assert.equal(result.totalCredits, 12)
    assert.equal(result.earned, 105)
    assert.equal(result.sgpa, 8.75)
  })

  it('ignores invalid, zero, or negative credits in semester calculation', () => {
    const rows = [
      { credit: 4, grade: 'A' },    // valid: 36
      { credit: 0, grade: 'A+' },   // 0 credit ignored
      { credit: -3, grade: 'A+' },  // negative credit ignored
      { credit: 'invalid', grade: 'B' }, // non-numeric ignored
    ]
    const result = calculateSemesterGpa(rows)
    assert.equal(result.totalCredits, 4)
    assert.equal(result.earned, 36)
    assert.equal(result.sgpa, 9.0)
  })

  it('returns null SGPA when total credits is zero', () => {
    const emptyRows = []
    assert.deepEqual(calculateSemesterGpa(emptyRows), { totalCredits: 0, earned: 0, sgpa: null })

    const zeroCredits = [{ credit: 0, grade: 'A' }]
    assert.deepEqual(calculateSemesterGpa(zeroCredits), { totalCredits: 0, earned: 0, sgpa: null })
  })

  it('projects overall CGPA accurately', () => {
    // Current: 8.0 CGPA over 40 credits (320 grade points earned previously)
    // New semester: 40 grade points earned over 5 credits
    // Total = 360 / 45 = 8.0
    const projected = projectCgpa(8.0, 40, 40, 5)
    assert.equal(projected, 8.0)

    // Higher new semester: 50 grade points earned over 5 credits (10.0 SGPA)
    // Total = 370 / 45 = 8.2222...
    const higher = projectCgpa(8.0, 40, 50, 5)
    assert.ok(Math.abs(higher - (370 / 45)) < 1e-9)

    // Zero total credits returns null
    assert.equal(projectCgpa(8.0, 0, 0, 0), null)
  })

  it('computes required SGPA to hit target CGPA', () => {
    // Current: 7.5 CGPA over 60 credits (= 450 points).
    // Target: 8.0 CGPA across 80 total credits (20 new credits).
    // Total points needed = 8.0 * 80 = 640.
    // Points needed in new semester = 640 - 450 = 190.
    // Required SGPA = 190 / 20 = 9.5
    const needed = requiredSgpaForTarget(7.5, 60, 20, 8.0)
    assert.equal(needed, 9.5)

    // If new credits is 0, returns null
    assert.equal(requiredSgpaForTarget(7.5, 60, 0, 8.0), null)
  })
})
