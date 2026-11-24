import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  taxYearByKey,
  regimeByKey,
  regimeConfig,
  surchargeRateFor,
  CESS_RATE,
} from '../../src/features/tools/domain/salary-tax-config.js'

describe('Career - Salary Tax Configuration (salary-tax-config.js)', () => {
  it('retrieves valid tax years and regimes by key', () => {
    assert.equal(taxYearByKey('fy2025-26')?.key, 'fy2025-26')
    assert.equal(taxYearByKey('fy2026-27')?.key, 'fy2026-27')
    assert.equal(taxYearByKey('invalid'), null)

    assert.equal(regimeByKey('new')?.key, 'new')
    assert.equal(regimeByKey('old')?.key, 'old')
    assert.equal(regimeByKey('unknown'), null)
  })

  it('provides correct standard deductions and rebates for new and old regimes', () => {
    const newRegime = regimeConfig('fy2025-26', 'new')
    assert.ok(newRegime)
    assert.equal(newRegime.standardDeduction, 75000)
    assert.equal(newRegime.rebate.upTo, 1200000)
    assert.equal(newRegime.rebate.max, 60000)

    const oldRegime = regimeConfig('fy2025-26', 'old')
    assert.ok(oldRegime)
    assert.equal(oldRegime.standardDeduction, 50000)
    assert.equal(oldRegime.rebate.upTo, 500000)
    assert.equal(oldRegime.rebate.max, 12500)
  })

  it('computes graduated surcharge rates and enforces the 25% cap in the new regime', () => {
    // Under 50 Lakhs: 0% surcharge
    assert.equal(surchargeRateFor(3000000, 'new'), 0)
    assert.equal(surchargeRateFor(5000000, 'old'), 0)

    // Above 50 Lakhs up to 1 Crore: 10%
    assert.equal(surchargeRateFor(6000000, 'new'), 0.1)
    assert.equal(surchargeRateFor(6000000, 'old'), 0.1)

    // Above 1 Crore up to 2 Crores: 15%
    assert.equal(surchargeRateFor(15000000, 'new'), 0.15)
    assert.equal(surchargeRateFor(15000000, 'old'), 0.15)

    // Above 2 Crores up to 5 Crores: 25%
    assert.equal(surchargeRateFor(25000000, 'new'), 0.25)
    assert.equal(surchargeRateFor(25000000, 'old'), 0.25)

    // Above 5 Crores:
    // Capped at 25% in the new regime
    assert.equal(surchargeRateFor(60000000, 'new'), 0.25)
    // 37% in the old regime
    assert.equal(surchargeRateFor(60000000, 'old'), 0.37)
  })

  it('verifies standard health & education cess rate is 4%', () => {
    assert.equal(CESS_RATE, 0.04)
  })
})
