/**
 * Salary / CTC Calculator — pure, browser-local salary math.
 *
 * Model used (Indian CTC structure):
 *   CTC = basic + HRA + special allowance + variable + employer contributions
 *  where
 *   basic            = CTC × basic% / 100
 *   HRA              = basic × HRA% / 100
 *   employer contrib = employer PF + gratuity + other benefits (never cash)
 *   variable         = performance/bonus pay (never guaranteed monthly cash)
 *   fixed cash       = CTC − variable − employer contributions
 *   special allowance= fixed cash − basic − HRA (the balancing line)
 *
 * The monthly cash take-home is built from *fixed cash only* — variable pay and
 * employer contributions are separated out so a CTC is not over-promised as
 * in-hand salary. The estimate is exact for the inputs; actual payroll splits
 * and tax rules can differ, which the UI labels as an estimate.
 */

import { CESS_RATE, regimeConfig, surchargeRateFor } from './salary-tax-config.js'

const AMOUNT_RE = /^-?\d+(?:\.\d+)?$/
const PERCENT_RE = /^-?\d+(?:\.\d+)?$/

export const OFFER_FIELDS = {
  ctc: { label: 'Annual CTC', kind: 'amount', required: true, suffix: '/yr', hint: 'Cost-to-company for one year.' },
  basicPct: { label: 'Basic salary', kind: 'percent', required: true, suffix: '% of CTC', hint: 'Usually 40–50% of CTC.' },
  hraPct: { label: 'HRA', kind: 'percent', required: true, suffix: '% of Basic', hint: 'Usually 40–50% of Basic.' },
  variable: { label: 'Variable pay / bonus', kind: 'amount', required: false, suffix: '/yr', hint: 'Depends on performance — not guaranteed.' },
  employerPf: { label: 'Employer PF', kind: 'amount', required: false, suffix: '/yr', hint: 'Your employer’s PF share.' },
  gratuity: { label: 'Gratuity', kind: 'amount', required: false, suffix: '/yr', hint: 'Paid on exit, not monthly.' },
  otherBenefits: { label: 'Other benefits', kind: 'amount', required: false, suffix: '/yr', hint: 'Insurance, retention bonus, perks, welfare.' },
  employeePf: { label: 'Employee PF', kind: 'amount', required: false, suffix: '/mo', hint: 'Deducted from your monthly payslip.' },
  profTax: { label: 'Professional tax', kind: 'amount', required: false, suffix: '/mo', hint: 'State-wise; commonly ₹2,500/yr.' },
  otherMonthly: { label: 'Other monthly deductions', kind: 'amount', required: false, suffix: '/mo', hint: 'Loans, payroll adjustments, etc.' },
}

export const OFFER_KEYS = Object.keys(OFFER_FIELDS)

export function parseAmount(text) {
  const value = typeof text === 'string' ? text.trim().replace(/[,₹\s]/g, '') : ''
  if (value === '') return { empty: true }
  if (!AMOUNT_RE.test(value)) return { ok: false, error: 'Enter an amount as a number, e.g. 18,00,000.' }
  const number = Number(value)
  if (!Number.isFinite(number)) return { ok: false, error: 'Enter a valid amount.' }
  if (number < 0) return { ok: false, error: 'Amounts cannot be negative.' }
  return { ok: true, value: number }
}

export function parsePercent(text) {
  const value = typeof text === 'string' ? text.trim() : ''
  if (value === '') return { empty: true }
  if (!PERCENT_RE.test(value)) return { ok: false, error: 'Enter a percentage as a number, e.g. 40 or 40.5.' }
  const number = Number(value)
  if (!Number.isFinite(number)) return { ok: false, error: 'Enter a valid percentage.' }
  if (number < 0) return { ok: false, error: 'Percentages cannot be negative.' }
  if (number > 100) return { ok: false, error: 'Enter a percentage up to 100.' }
  return { ok: true, value: number }
}

const inr = (number, digits = 0) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: digits }).format(number)

export function formatINR(number, digits = 0) {
  if (typeof number !== 'number' || !Number.isFinite(number)) return '—'
  return `₹${inr(number, digits)}`
}

export function formatINRValue(number, digits = 0) {
  if (typeof number !== 'number' || !Number.isFinite(number)) return '—'
  return inr(number, digits)
}

function slabTax(slabs, taxableIncome) {
  let tax = 0
  let prevLimit = 0
  for (const slab of slabs) {
    const band = Math.max(0, Math.min(taxableIncome, slab.upTo) - prevLimit)
    tax += band * slab.rate
    prevLimit = slab.upTo
  }
  return tax
}

/**
 * Computes the full tax breakdown for a taxable income. Standard deduction and
 * §87A rebate are applied inside, and the result is rounded to whole rupees stage
 * by stage (as payroll estimates usually are).
 */
export function computeIncomeTax({ salaryIncome, otherIncome = 0, fyKey, regime }) {
  const config = regimeConfig(fyKey, regime)
  if (!config) return { available: false }

  const gross = Math.max(0, salaryIncome + otherIncome)
  const taxable = Math.max(0, gross - config.standardDeduction)

  const baseSlabTax = slabTax(config.slabs, taxable)

  let rebate = 0
  if (config.rebate && taxable <= config.rebate.upTo) {
    rebate = Math.min(baseSlabTax, config.rebate.max)
  }
  const afterRebate = baseSlabTax - rebate

  const rate = surchargeRateFor(taxable, regime)
  let surcharge = Math.round(afterRebate * rate)

  // Marginal relief — modeled only for the ₹50L-to-₹1cr transition: tax plus
  // surcharge must not climb more than the income that crosses ₹50L. Beyond ₹1cr
  // the bands are wider and relief is not modeled here.
  let marginalRelief = 0
  if (rate === 0.1 && taxable > 5000000 && taxable <= 10000000) {
    const taxAtCap = slabTax(config.slabs, 5000000)
    const cap = taxAtCap + (taxable - 5000000)
    const beforeRelief = afterRebate + surcharge
    marginalRelief = Math.max(0, beforeRelief - cap)
    surcharge = Math.max(0, surcharge - marginalRelief)
  }

  const cess = Math.round((afterRebate + surcharge) * CESS_RATE)
  const total = Math.round(afterRebate + surcharge + cess)

  return {
    available: true,
    fyKey,
    regime,
    gross: Math.round(gross),
    taxable,
    standardDeduction: config.standardDeduction,
    slabTax: Math.round(baseSlabTax),
    rebate: Math.round(rebate),
    surcharge,
    surchargeRate: rate,
    marginalRelief: Math.round(marginalRelief),
    cess,
    total,
  }
}

/**
 * Builds a salary view for one offer. `offer` is an object of text field values
 * keyed by OFFER_KEYS; `tax` is null (no estimate) or:
 *   { enabled, fyKey, regime, otherIncomeText }
 * Returns { status, result, errors, formError } mirroring the design used by the
 * other converter tools (identify → validate → derive).
 */
export function evaluateOffer(offer, tax) {
  const numbers = {}
  const errors = {}
  const missing = []

  for (const key of OFFER_KEYS) {
    const spec = OFFER_FIELDS[key]
    const parse = spec.kind === 'percent' ? parsePercent : parseAmount
    const res = parse(offer?.[key])
    if (res.empty) {
      numbers[key] = 0
      if (spec.required) missing.push(key)
    } else if (!res.ok) {
      numbers[key] = 0
      errors[key] = res.error
    } else {
      numbers[key] = res.value
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: { kind: 'invalid', message: 'Some inputs need attention — fix the highlighted fields.' },
      result: null,
      errors,
      formError: null,
    }
  }

  if (missing.length > 0) {
    const names = missing.map((key) => OFFER_FIELDS[key].label).join(', ')
    return {
      status: { kind: 'idle', message: `Enter the ${names} to see the breakdown.` },
      result: null,
      errors,
      formError: null,
    }
  }

  if (numbers.ctc <= 0) {
    return { status: { kind: 'invalid', message: 'Annual CTC must be more than zero.' }, result: null, errors, formError: null }
  }

  const annualBasic = (numbers.ctc * numbers.basicPct) / 100
  const annualHra = (annualBasic * numbers.hraPct) / 100
  const annualEmployerContribs = numbers.employerPf + numbers.gratuity + numbers.otherBenefits
  const annualFixedCash = numbers.ctc - numbers.variable - annualEmployerContribs
  const annualSpecialAllowance = annualFixedCash - annualBasic - annualHra

  if (annualSpecialAllowance < 0) {
    const over = Math.abs(annualSpecialAllowance)
    return {
      status: {
        kind: 'invalid',
        message: `These components exceed this CTC by ${formatINR(over)} — lower the Basic %, HRA %, variable pay or employer contributions, or raise the CTC.`,
      },
      result: null,
      errors,
      formError: 'Salary structure exceeds this CTC.',
    }
  }

  const monthlyGross = annualFixedCash / 12
  const monthlyDeductions = numbers.employeePf + numbers.profTax + numbers.otherMonthly
  const monthlyTakeHomeBeforeTax = monthlyGross - monthlyDeductions
  const annualTakeHomeBeforeTax = monthlyTakeHomeBeforeTax * 12 + numbers.variable

  let estimatedTax = null
  if (tax?.enabled) {
    const otherIncomeRes = parseAmount(tax.otherIncomeText)
    if (!otherIncomeRes.empty && !otherIncomeRes.ok) {
      errors.otherIncome = otherIncomeRes.error
      return { status: { kind: 'invalid', message: 'Some inputs need attention — fix the highlighted fields.' }, result: null, errors, formError: null }
    }
    const otherIncome = otherIncomeRes.ok ? otherIncomeRes.value : 0
    const computed = computeIncomeTax({
      salaryIncome: annualFixedCash + numbers.variable,
      otherIncome,
      fyKey: tax.fyKey,
      regime: tax.regime,
    })
    if (!computed.available) {
      return {
        status: { kind: 'invalid', message: 'Tax rules for this financial year and regime are not available yet.' },
        result: null,
        errors,
        formError: null,
      }
    }
    estimatedTax = computed
  }

  const monthlyTax = estimatedTax ? estimatedTax.total / 12 : 0
  const estimatedMonthlyTakeHome = monthlyTakeHomeBeforeTax - monthlyTax
  const annualTakeHomeAfterTax = annualTakeHomeBeforeTax - (estimatedTax?.total ?? 0)

  return {
    status: { kind: 'valid', message: 'Breakdown for this offer is below — figures are estimates, not a payslip.' },
    result: {
      annualCtc: numbers.ctc,
      annualBasic,
      annualHra,
      annualSpecialAllowance,
      annualFixedCash,
      annualVariable: numbers.variable,
      annualEmployerContribs,
      monthlyGross,
      monthlyDeductions,
      monthlyTakeHomeBeforeTax,
      annualTakeHomeBeforeTax,
      estimatedMonthlyTax: estimatedTax ? monthlyTax : null,
      estimatedMonthlyTakeHome,
      annualTakeHomeAfterTax,
      tax: estimatedTax,
    },
    errors,
    formError: null,
  }
}

const RULE_BLUEPRINT =
  'Assumptions: monthly take-home excludes variable pay unless it is actually paid; the income-tax estimate applies only the salaried standard deduction and §87A rebate (no 80C/80D/NPS deductions). Estimates are not tax advice and your payroll’s exact split may differ.'

export function salaryCopyFor(result) {
  const lines = [
    'Salary / CTC breakdown (estimate)',
    `Annual CTC: ${formatINR(result.annualCtc)}`,
    `Annual fixed cash: ${formatINR(result.annualFixedCash)}  (Basic ${formatINR(result.annualBasic)} + HRA ${formatINR(result.annualHra)} + allowance ${formatINR(result.annualSpecialAllowance)})`,
    `Annual variable pay: ${formatINR(result.annualVariable)}  (not guaranteed)`,
    `Annual employer contributions: ${formatINR(result.annualEmployerContribs)}  (PF + gratuity + benefits)`,
    `Monthly gross cash: ${formatINR(result.monthlyGross)}`,
    `Monthly deductions: ${formatINR(result.monthlyDeductions)}  (employee PF + professional tax + other)`,
    `Estimated monthly take-home (before income tax): ${formatINR(result.monthlyTakeHomeBeforeTax)}`,
    `Estimated annual take-home (before income tax): ${formatINR(result.annualTakeHomeBeforeTax)}`,
  ]
  if (result.tax) {
    const tax = result.tax
    lines.push(
      `Estimated income tax for ${tax.fyKey} (${tax.regime} regime): ${formatINR(tax.total)}  (taxable income ${formatINR(tax.taxable)} minus standard deduction ${formatINR(tax.standardDeduction)})`,
      `Estimated monthly income-tax provision: ${formatINR(result.estimatedMonthlyTax)}`,
      `Estimated monthly take-home (after income tax): ${formatINR(result.estimatedMonthlyTakeHome)}`,
      `Estimated annual take-home (after income tax): ${formatINR(result.annualTakeHomeAfterTax)}`,
    )
  }
  lines.push(RULE_BLUEPRINT)
  return lines.join('\n')
}

export function compareSalaryCopy(resultA, resultB) {
  const a = resultA.result
  const b = resultB.result
  const pick = (label, va, vb) => `  ${label}: A ${formatINR(va)} | B ${formatINR(vb)}`
  const lines = [
    'Offer comparison — A vs B',
    pick('Annual CTC', a.annualCtc, b.annualCtc),
    pick('Annual fixed cash', a.annualFixedCash, b.annualFixedCash),
    pick('Annual variable pay', a.annualVariable, b.annualVariable),
    pick('Annual employer contributions', a.annualEmployerContribs, b.annualEmployerContribs),
    pick('Estimated monthly take-home', a.estimatedMonthlyTakeHome, b.estimatedMonthlyTakeHome),
    pick('Estimated annual take-home', a.annualTakeHomeAfterTax, b.annualTakeHomeAfterTax),
    'A higher CTC does not always mean a higher take-home — fixed cash, deductions and tax posture matter too.',
  ]
  lines.push(RULE_BLUEPRINT)
  return lines.join('\n')
}