/**
 * Income-tax rules for the Salary / CTC estimate, centralized in one place.
 *
 * Verified sources (checked Oct 2026; public summaries, not tax advice):
 * - The Union Budget 2025-26 changed the new-regime slabs for FY 2025-26 (AY 2026-27).
 * - Budget 2026 (announced Feb 2026) kept FY 2025-26 rates unchanged, so FY 2026-27
 *   uses the same slabs, ₹75,000 standard deduction and §87A rebate — confirmed by
 *   ITR Stats (itrstats.in, Apr 2026) and the BCAS 2025-26 Budget paper (surcharge
 *   and 4% cess unchanged for AY 2026-27).
 * - Surcharge: > ₹50L 10%, > ₹1cr 15%, > ₹2cr 25%, > ₹5cr 37% (old regime only;
 *   new regime is capped at 25%). Health & Education Cess is 4% of tax + surcharge.
 * - §87A rebate: new regime — nil tax up to ₹12,00,000 taxable income (max rebate
 *   ₹60,000); old regime — income up to ₹5,00,000 (max rebate ₹12,500).
 *
 * The estimate applies only the standard deduction for salaried income and the §87A
 * rebate. It does not model 80C/80D/NPS deductions, exemptions or alternate rules,
 * and it is not a substitute for actual payroll TDS.
 */

export const TAX_YEARS = [
  { key: 'fy2025-26', label: 'FY 2025-26', note: 'April 2025 – March 2026 (latest completed year).' },
  { key: 'fy2026-27', label: 'FY 2026-27', note: 'April 2026 – March 2027 (current year).' },
]

export const REGIMES = [
  { key: 'new', label: 'New regime', note: 'Default since FY 2020-21. Higher basic exemption, no old regime deductions.' },
  { key: 'old', label: 'Old regime', note: 'Lower exemption but 80C/80D etc. apply — those are NOT modeled here.' },
]

const NEW_SLABS = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 0.05 },
  { upTo: 1200000, rate: 0.1 },
  { upTo: 1600000, rate: 0.15 },
  { upTo: 2000000, rate: 0.2 },
  { upTo: 2400000, rate: 0.25 },
  { upTo: Infinity, rate: 0.3 },
]

const OLD_SLABS = [
  { upTo: 250000, rate: 0 },
  { upTo: 500000, rate: 0.05 },
  { upTo: 1000000, rate: 0.2 },
  { upTo: Infinity, rate: 0.3 },
]

const REGIME_RULES = {
  new: {
    slabs: NEW_SLABS,
    standardDeduction: 75000,
    rebate: { upTo: 1200000, max: 60000 },
  },
  old: {
    slabs: OLD_SLABS,
    standardDeduction: 50000,
    rebate: { upTo: 500000, max: 12500 },
  },
}

// Both supported FYs use identical rules (Budget 2026 made no changes).
const RULES = {
  'fy2025-26': REGIME_RULES,
  'fy2026-27': REGIME_RULES,
}

export const CESS_RATE = 0.04

/**
 * Surcharge steps, highest threshold first. `rate` is the rate that applies to the
 * tax when taxable income crosses `above`. The final step (37%) applies to the old
 * regime only — the new regime caps surcharge at 25%.
 */
export const SURCHARGE_STEPS = [
  { above: 50000000, rate: 0.37, oldOnly: true },
  { above: 20000000, rate: 0.25, oldOnly: false },
  { above: 10000000, rate: 0.15, oldOnly: false },
  { above: 5000000, rate: 0.1, oldOnly: false },
]

export function taxYearByKey(key) {
  return TAX_YEARS.find((year) => year.key === key) ?? null
}

export function regimeByKey(key) {
  return REGIMES.find((regime) => regime.key === key) ?? null
}

export function regimeConfig(fyKey, regimeKey) {
  return RULES[fyKey]?.[regimeKey] ?? null
}

export function surchargeRateFor(taxableIncome, regimeKey) {
  for (const step of SURCHARGE_STEPS) {
    if (taxableIncome > step.above) {
      if (step.oldOnly && regimeKey !== 'old') continue
      return step.rate
    }
  }
  return 0
}