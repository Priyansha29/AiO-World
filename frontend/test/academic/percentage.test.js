import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  validateMarksPercentage,
  validatePercentOfNumber,
  validateReversePercentage,
  marksPercentage,
  percentOfNumber,
  percentageChange,
  reversePercentage,
  formatNumber,
  formatPercent,
  formatSignedPercent,
} from '../../src/features/tools/domain/percentage.js'

describe('Academic - Marks / Percentage Calculator (percentage.js)', () => {
  describe('marksPercentage & validation', () => {
    it('calculates obtained to total percentage correctly', () => {
      assert.equal(marksPercentage(85, 100), 85)
      assert.equal(marksPercentage(45, 60), 75)
      assert.equal(marksPercentage(0, 100), 0)
    })

    it('returns null when total denominator is zero or negative', () => {
      assert.equal(marksPercentage(50, 0), null)
      assert.equal(marksPercentage(50, -10), null)
    })

    it('validates marks inputs and flags negative or excessive marks', () => {
      const valid = validateMarksPercentage({ obtained: '85', total: '100' })
      assert.equal(valid.ok, true)
      assert.deepEqual(valid.values, { obtained: 85, total: 100 })

      const negObtained = validateMarksPercentage({ obtained: '-5', total: '100' })
      assert.equal(negObtained.ok, false)
      assert.equal(negObtained.errors.obtained, 'Obtained marks cannot be negative.')

      const zeroTotal = validateMarksPercentage({ obtained: '50', total: '0' })
      assert.equal(zeroTotal.ok, false)
      assert.equal(zeroTotal.errors.total, 'Total marks must be greater than zero.')

      const overTotal = validateMarksPercentage({ obtained: '105', total: '100' })
      assert.equal(overTotal.ok, false)
      assert.equal(overTotal.errors.obtained, 'Obtained marks cannot exceed the total.')
    })
  })

  describe('percentOfNumber & validation', () => {
    it('computes percent of a given number', () => {
      assert.equal(percentOfNumber(20, 250), 50)
      assert.equal(percentOfNumber(0, 500), 0)
      assert.equal(percentOfNumber(100, 75), 75)
    })

    it('validates percent bounds within [0, 100]', () => {
      const valid = validatePercentOfNumber({ percent: '25', number: '200' })
      assert.equal(valid.ok, true)

      const outOfBounds = validatePercentOfNumber({ percent: '150', number: '200' })
      assert.equal(outOfBounds.ok, false)
      assert.equal(outOfBounds.errors.percent, 'Percentage must be between 0 and 100.')
    })
  })

  describe('percentageChange & reversePercentage', () => {
    it('calculates positive and negative percentage changes', () => {
      // 100 -> 125 is +25%
      assert.equal(percentageChange(100, 125), 25)
      // 200 -> 150 is -25%
      assert.equal(percentageChange(200, 150), -25)
      // Same value is 0%
      assert.equal(percentageChange(50, 50), 0)
    })

    it('returns null for percentage change when original is zero or negative', () => {
      assert.equal(percentageChange(0, 100), null)
      assert.equal(percentageChange(-50, 50), null)
    })

    it('calculates reverse percentage (base from percent and value)', () => {
      // If 20% of X is 50, then X = 250
      assert.equal(reversePercentage(50, 20), 250)
      assert.equal(reversePercentage(0, 50), 0)
      assert.equal(reversePercentage(50, 0), null)
    })

    it('validates reverse percentage inputs', () => {
      const valid = validateReversePercentage({ value: '50', percent: '20' })
      assert.equal(valid.ok, true)
      assert.deepEqual(valid.values, { value: 50, percent: 20 })

      const zeroPercent = validateReversePercentage({ value: '50', percent: '0' })
      assert.equal(zeroPercent.ok, false)
      assert.equal(zeroPercent.errors.percent, 'Percentage must be greater than zero.')
    })
  })

  describe('formatting utilities', () => {
    it('formats plain numbers, percentages, and signed percentages', () => {
      assert.equal(formatNumber(12.3456), '12.35')
      assert.equal(formatNumber(12.0), '12')
      assert.equal(formatNumber(0), '0')
      assert.equal(formatNumber(null), '')

      assert.equal(formatPercent(75), '75.00%')
      assert.equal(formatPercent(0), '0.00%')

      assert.equal(formatSignedPercent(15.5), '+15.50%')
      assert.equal(formatSignedPercent(-8.25), '-8.25%')
      assert.equal(formatSignedPercent(0), '0.00%')
    })
  })
})
