import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  parseAmount,
  parsePercent,
  formatINR,
  computeIncomeTax,
  evaluateOffer,
} from '../../src/features/tools/domain/salary-ctc.js'

describe('Career - Salary / CTC Calculator (salary-ctc.js)', () => {
  describe('Input parsers & formatters', () => {
    it('parses amounts with commas and currency signs', () => {
      assert.deepEqual(parseAmount('18,00,000'), { ok: true, value: 1800000 })
      assert.deepEqual(parseAmount('₹ 12,50,000.50'), { ok: true, value: 1250000.5 })
      assert.deepEqual(parseAmount('   '), { empty: true })
      assert.equal(parseAmount('-5000').ok, false)
      assert.equal(parseAmount('abc').ok, false)
    })

    it('parses valid percentages within [0, 100]', () => {
      assert.deepEqual(parsePercent('40'), { ok: true, value: 40 })
      assert.deepEqual(parsePercent('50.5'), { ok: true, value: 50.5 })
      assert.deepEqual(parsePercent(''), { empty: true })
      assert.equal(parsePercent('-5').ok, false)
      assert.equal(parsePercent('105').ok, false)
    })

    it('formats numbers into Indian currency representation', () => {
      assert.equal(formatINR(1200000), '₹12,00,000')
      assert.equal(formatINR(null), '—')
      assert.equal(formatINR(NaN), '—')
    })
  })

  describe('Tax computation engine (computeIncomeTax)', () => {
    it('yields zero tax when income is within the Section 87A rebate limit in the new regime', () => {
      // 12 LPA gross salary -> 75,000 standard deduction -> 11,25,000 taxable
      // Taxable is <= 12,00,000 rebate ceiling -> Net tax is ₹0
      const tax = computeIncomeTax({
        salaryIncome: 1200000,
        otherIncome: 0,
        fyKey: 'fy2025-26',
        regime: 'new',
      })
      assert.equal(tax.available, true)
      assert.equal(tax.gross, 1200000)
      assert.equal(tax.taxable, 1125000)
      assert.equal(tax.rebate, tax.slabTax)
      assert.equal(tax.total, 0)
    })

    it('computes graduated tax and 4% cess when income exceeds the rebate limit', () => {
      // 15 LPA gross salary -> 75,000 standard deduction -> 14,25,000 taxable
      // 0 - 4L @ 0% = 0
      // 4L - 8L @ 5% = 20,000
      // 8L - 12L @ 10% = 40,000
      // 12L - 14.25L @ 15% = 33,750
      // Total slab tax = 93,750
      // Rebate = 0 (taxable > 12L)
      // Surcharge = 0
      // Cess = 93,750 * 0.04 = 3,750
      // Total = 97,500
      const tax = computeIncomeTax({
        salaryIncome: 1500000,
        otherIncome: 0,
        fyKey: 'fy2025-26',
        regime: 'new',
      })
      assert.equal(tax.slabTax, 93750)
      assert.equal(tax.rebate, 0)
      assert.equal(tax.cess, 3750)
      assert.equal(tax.total, 97500)
    })
  })

  describe('Offer evaluation (evaluateOffer)', () => {
    it('evaluates a standard offer and calculates monthly take-home', () => {
      const offer = {
        ctc: '1200000',
        basicPct: '40',
        hraPct: '50',
        variable: '100000',
        employerPf: '57600',
        gratuity: '23000',
        otherBenefits: '0',
        employeePf: '4800',
        profTax: '200',
        otherMonthly: '0',
      }
      const evalRes = evaluateOffer(offer, null)
      assert.equal(evalRes.status.kind, 'valid')
      assert.ok(evalRes.result)
      assert.equal(evalRes.result.annualCtc, 1200000)
      assert.equal(evalRes.result.annualBasic, 480000)
      assert.equal(evalRes.result.annualHra, 240000)
      // Fixed cash = CTC (12L) - variable (1L) - employer contribs (80.6k) = 10,19,400
      assert.equal(evalRes.result.annualFixedCash, 1019400)
      // Monthly gross = 1019400 / 12 = 84,950
      assert.equal(evalRes.result.monthlyGross, 84950)
      // Monthly deductions = 4800 + 200 = 5000
      assert.equal(evalRes.result.monthlyDeductions, 5000)
      // Take home before tax = 84,950 - 5000 = 79,950
      assert.equal(evalRes.result.monthlyTakeHomeBeforeTax, 79950)
    })

    it('flags invalid salary structure when components exceed the CTC', () => {
      // 10 LPA CTC with 80% Basic and 50% HRA
      // Basic = 8L, HRA = 4L => 12L > 10L CTC!
      const invalidOffer = {
        ctc: '1000000',
        basicPct: '80',
        hraPct: '50',
        variable: '0',
        employerPf: '0',
        gratuity: '0',
        otherBenefits: '0',
        employeePf: '0',
        profTax: '0',
        otherMonthly: '0',
      }
      const res = evaluateOffer(invalidOffer, null)
      assert.equal(res.status.kind, 'invalid')
      assert.ok(res.formError.includes('exceeds this CTC'))
    })

    it('rejects zero or negative CTC values', () => {
      const zeroCtc = {
        ctc: '0',
        basicPct: '40',
        hraPct: '40',
      }
      const res = evaluateOffer(zeroCtc, null)
      assert.equal(res.status.kind, 'invalid')
      assert.ok(res.status.message.includes('must be more than zero'))
    })
  })
})
