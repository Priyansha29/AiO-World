import { useEffect, useRef, useState } from 'react'
import { REGIMES, TAX_YEARS } from '../../domain/salary-tax-config'
import {
  OFFER_FIELDS,
  compareSalaryCopy,
  evaluateOffer,
  formatINR,
  formatINRValue,
  salaryCopyFor,
} from '../../domain/salary-ctc'
import { copyText } from '../../utils/copy'

const EXAMPLE_A = {
  ctc: '18,00,000',
  basicPct: '40',
  hraPct: '50',
  variable: '1,50,000',
  employerPf: '1,00,000',
  gratuity: '50,000',
  otherBenefits: '0',
  employeePf: '7,200',
  profTax: '200',
  otherMonthly: '0',
}

const EXAMPLE_B = {
  ctc: '20,00,000',
  basicPct: '35',
  hraPct: '50',
  variable: '3,00,000',
  employerPf: '1,20,000',
  gratuity: '60,000',
  otherBenefits: '20,000',
  employeePf: '7,000',
  profTax: '200',
  otherMonthly: '0',
}

const EMPTY_OFFER = {
  ctc: '',
  basicPct: '',
  hraPct: '',
  variable: '',
  employerPf: '',
  gratuity: '',
  otherBenefits: '',
  employeePf: '',
  profTax: '',
  otherMonthly: '',
}

function SalInput({ id, label, value, onChange, prefix = '₹', suffix, hint, error, optional }) {
  return (
    <div className="tool-field">
      <div className="json-input-head">
        <label className="tool-field__label" htmlFor={id}>
          {label}
        </label>
        {optional && <span className="sal-optional">optional</span>}
      </div>
      <span className={`tool-field__control${error ? ' tool-field__control--invalid' : ''}`}>
        {prefix && (
          <span className="tool-field__prefix" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={id}
          className="tool-input"
          type="text"
          inputMode="decimal"
          spellCheck={false}
          autoComplete="off"
          placeholder="0"
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix && <span className="tool-field__suffix">{suffix}</span>}
      </span>
      {hint && <span className="tool-field__hint">{hint}</span>}
      {error && (
        <span id={`${id}-error`} className="tool-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

function FieldGroup({ title, children }) {
  return (
    <div className="sal-group">
      <h3 className="sal-group__title">{title}</h3>
      <div className="sal-fields">{children}</div>
    </div>
  )
}

function OfferFields({ idPrefix, title, offer, onChange, errors }) {
  const renderField = (key) => {
    const spec = OFFER_FIELDS[key]
    return (
      <SalInput
        key={key}
        id={`${idPrefix}-${key}`}
        label={spec.label}
        value={offer[key] ?? ''}
        prefix={spec.kind === 'percent' ? null : '₹'}
        suffix={spec.kind === 'percent' ? '%' : spec.suffix}
        hint={spec.hint}
        error={errors[key]}
        optional={!spec.required}
        onChange={(value) => onChange(key, value)}
      />
    )
  }

  const structure = ['ctc', 'basicPct', 'hraPct', 'variable', 'employerPf', 'gratuity', 'otherBenefits']
  const deductions = ['employeePf', 'profTax', 'otherMonthly']

  return (
    <div className="sal-offer">
      {title && <h3 className="sal-offer__title">{title}</h3>}
      <FieldGroup title="Salary structure">{structure.map(renderField)}</FieldGroup>
      <FieldGroup title="Monthly deductions">{deductions.map(renderField)}</FieldGroup>
    </div>
  )
}

function TaxControls({ idPrefix, taxEnabled, setTaxEnabled, fyKey, setFyKey, regime, setRegime, otherIncomeText, setOtherIncomeText, errors }) {
  return (
    <div className="sal-tax">
      <label className="sal-toggle">
        <input
          type="checkbox"
          checked={taxEnabled}
          onChange={(event) => setTaxEnabled(event.target.checked)}
        />
        <span>Estimate income tax for an Indian financial year</span>
      </label>
      <p className="tool-field__hint">
        Uses verified FY rules — slabs, salaried standard deduction, §87A rebate, surcharge and 4% cess.
        Old-regime 80C/80D/NPS deductions and exemptions are not modeled, and the result is an estimate, not tax advice.
      </p>
      {taxEnabled && (
        <div className="sal-fields sal-fields--tax">
          <div className="tool-field">
            <label className="tool-field__label" htmlFor={`${idPrefix}-fy`}>
              Financial year
            </label>
            <span className="tool-field__control">
              <select id={`${idPrefix}-fy`} className="tool-select" value={fyKey} onChange={(event) => setFyKey(event.target.value)}>
                {TAX_YEARS.map((year) => (
                  <option key={year.key} value={year.key}>
                    {year.label}
                  </option>
                ))}
              </select>
            </span>
          </div>
          <div className="tool-field">
            <label className="tool-field__label" htmlFor={`${idPrefix}-regime`}>
              Tax regime
            </label>
            <span className="tool-field__control">
              <select id={`${idPrefix}-regime`} className="tool-select" value={regime} onChange={(event) => setRegime(event.target.value)}>
                {REGIMES.map((entry) => (
                  <option key={entry.key} value={entry.key}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </span>
          </div>
          <SalInput
            id={`${idPrefix}-other-income`}
            label="Other taxable income"
            suffix="/yr"
            hint="Interest, rentals, etc. — used only in the income-tax estimate."
            value={otherIncomeText}
            error={errors.otherIncome}
            onChange={setOtherIncomeText}
          />
        </div>
      )}
    </div>
  )
}

function OfferCard({ side, result, taxEnabled }) {
  return (
    <div className={`sal-card sal-card--${side.toLowerCase()}`}>
      <h4 className="sal-card__title">Offer {side}</h4>
      <div className="sal-card__row">
        <span>Annual CTC</span>
        <strong>{formatINR(result.annualCtc)}</strong>
      </div>
      <div className="sal-card__row">
        <span>Fixed cash</span>
        <strong>{formatINR(result.annualFixedCash)}</strong>
      </div>
      <div className="sal-card__row">
        <span>Variable</span>
        <strong>{formatINR(result.annualVariable)}</strong>
      </div>
      <div className="sal-card__row">
        <span>Employer contributions</span>
        <strong>{formatINR(result.annualEmployerContribs)}</strong>
      </div>
      <div className="sal-card__row sal-card__row--hero">
        <span>Est. monthly take-home</span>
        <strong>{formatINR(result.estimatedMonthlyTakeHome)}</strong>
      </div>
      <p className="sal-card__note">{taxEnabled ? 'after estimated income tax' : 'before income tax'} · variable pay excluded</p>
    </div>
  )
}

const COMPARE_ROWS = [
  { label: 'Annual CTC', value: (r) => formatINR(r.annualCtc), diff: (r) => r.annualCtc },
  { label: 'Annual fixed cash', value: (r) => formatINR(r.annualFixedCash), diff: (r) => r.annualFixedCash },
  { label: 'Annual variable pay', value: (r) => formatINR(r.annualVariable), diff: (r) => r.annualVariable },
  { label: 'Annual employer contributions', value: (r) => formatINR(r.annualEmployerContribs), diff: (r) => r.annualEmployerContribs },
  { label: 'Est. monthly take-home', value: (r) => formatINR(r.estimatedMonthlyTakeHome), diff: (r) => r.estimatedMonthlyTakeHome, strong: true },
  { label: 'Est. annual take-home', value: (r) => formatINR(r.annualTakeHomeAfterTax), diff: (r) => r.annualTakeHomeAfterTax },
]

function deltaText(value) {
  if (value === 0) return <span className="sal-delta sal-delta--same">same</span>
  const sign = value > 0 ? '+' : '−'
  return (
    <span className={value > 0 ? 'sal-delta sal-delta--b' : 'sal-delta sal-delta--a'}>
      B is {sign}
      {formatINRValue(Math.abs(value))}
    </span>
  )
}

function CompareTable({ resultA, resultB, taxEnabled }) {
  const a = resultA
  const b = resultB
  const dCtc = b.annualCtc - a.annualCtc
  const dTake = b.estimatedMonthlyTakeHome - a.estimatedMonthlyTakeHome

  const verdict =
    dCtc === 0 && dTake === 0
      ? 'Both offers are identical on these inputs.'
      : dCtc > 0 && dTake < 0
        ? 'Offer B has the higher CTC but the lower estimated monthly take-home — check fixed cash, variable pay and tax posture, not just the headline number.'
        : dCtc < 0 && dTake > 0
          ? 'Offer A has the higher CTC but the lower estimated monthly take-home — check fixed cash, variable pay and tax posture, not just the headline number.'
          : dCtc >= 0 && dTake >= 0
            ? 'Offer B leads on both CTC and estimated monthly take-home.'
            : 'Offer A leads on both CTC and estimated monthly take-home.'

  return (
    <>
      <div className="sal-compare-cards">
        <OfferCard side="A" result={a} taxEnabled={taxEnabled} />
        <OfferCard side="B" result={b} taxEnabled={taxEnabled} />
      </div>
      <h4 className="sal-group__title">What differs</h4>
      <div className="sal-diff" role="table" aria-label="Offer comparison differences">
        <div className="sal-diff__head" role="row">
          <span role="columnheader">Item</span>
          <span role="columnheader">Offer A</span>
          <span role="columnheader">Change</span>
          <span role="columnheader">Offer B</span>
        </div>
        {COMPARE_ROWS.map((row) => (
          <div className="sal-diff__row" role="row" key={row.label}>
            <span role="cell" className={row.strong ? 'sal-diff__strong' : ''}>{row.label}</span>
            <span role="cell" className={row.strong ? 'sal-diff__strong' : ''}>{row.value(a)}</span>
            <span role="cell">{deltaText(row.diff(b) - row.diff(a))}</span>
            <span role="cell" className={row.strong ? 'sal-diff__strong' : ''}>{row.value(b)}</span>
          </div>
        ))}
      </div>
      <p className="tool-result__verdict sal-verdict">{verdict}</p>
    </>
  )
}

function Breakdown({ result, taxEnabled }) {
  const tax = result.tax
  const rows = [
    { label: 'Annual CTC', value: formatINR(result.annualCtc), hint: 'Your cost-to-company for the year.' },
    {
      label: 'Annual fixed cash',
      value: formatINR(result.annualFixedCash),
      hint: `Basic ${formatINR(result.annualBasic)} + HRA ${formatINR(result.annualHra)} + allowance ${formatINR(result.annualSpecialAllowance)}`,
    },
    { label: 'Annual variable pay', value: formatINR(result.annualVariable), hint: 'Not guaranteed — adds to take-home only when actually paid.' },
    { label: 'Annual employer contributions', value: formatINR(result.annualEmployerContribs), hint: 'PF + gratuity + benefits — never in the monthly payslip.' },
    { label: 'Monthly gross cash', value: formatINR(result.monthlyGross), hint: 'Annual fixed cash ÷ 12.' },
    { label: 'Monthly deductions', value: `− ${formatINR(result.monthlyDeductions)}`, hint: 'Employee PF + professional tax + other monthly deductions.' },
    { label: 'Est. monthly take-home (before income tax)', value: formatINR(result.monthlyTakeHomeBeforeTax) },
    { label: 'Est. annual take-home (before income tax)', value: formatINR(result.annualTakeHomeBeforeTax) },
  ]

  if (tax) {
    rows.push(
      { label: 'Gross salary income', value: formatINR(tax.gross), hint: 'Fixed cash + variable (when received) + other taxable income.' },
      { label: 'Less: standard deduction', value: `− ${formatINR(tax.standardDeduction)}` },
      { label: 'Taxable income', value: formatINR(tax.taxable) },
      { label: 'Income tax on slabs', value: formatINR(tax.slabTax) },
      { label: 'Rebate under §87A', value: tax.rebate > 0 ? `− ${formatINR(tax.rebate)}` : formatINR(0) },
      { label: `Surcharge${tax.surchargeRate > 0 ? ` (${Math.round(tax.surchargeRate * 100)}%)` : ''}`, value: formatINR(tax.surcharge) },
      { label: 'Health & Education Cess (4%)', value: formatINR(tax.cess) },
      { label: 'Estimated annual income tax', value: formatINR(tax.total), strong: true },
      { label: 'Estimated monthly income-tax provision', value: formatINR(result.estimatedMonthlyTax), hint: 'Annual estimate ÷ 12 — actual TDS varies.' },
      { label: 'Est. monthly take-home (after income tax)', value: formatINR(result.estimatedMonthlyTakeHome), strong: true },
      { label: 'Est. annual take-home (after income tax)', value: formatINR(result.annualTakeHomeAfterTax) },
    )
  }

  return (
    <>
      <div className="sal-hero">
        <span className="sal-hero__label">Estimated monthly take-home</span>
        <span className="sal-hero__value">{formatINR(result.estimatedMonthlyTakeHome)}</span>
        <span className="sal-hero__sub">{taxEnabled ? 'after estimated income tax' : 'before income tax'} · variable pay excluded</span>
      </div>
      <div className="sal-breakdown" role="table" aria-label="Salary breakdown">
        {rows.map((row) => (
          <div className={`sal-breakdown__row${row.strong ? ' sal-breakdown__row--strong' : ''}`} role="row" key={row.label}>
            <span role="cell">{row.label}</span>
            <span role="cell">{row.value}</span>
            {row.hint && <span role="cell" className="sal-breakdown__hint">{row.hint}</span>}
          </div>
        ))}
      </div>
    </>
  )
}

function SalaryCtcCalculator() {
  const [mode, setMode] = useState('single')
  const [single, setSingle] = useState(EXAMPLE_A)
  const [offerA, setOfferA] = useState(EXAMPLE_A)
  const [offerB, setOfferB] = useState(EXAMPLE_B)
  const [taxEnabled, setTaxEnabled] = useState(true)
  const [fyKey, setFyKey] = useState('fy2026-27')
  const [taxRegime, setTaxRegime] = useState('new')
  const [otherIncomeText, setOtherIncomeText] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const copyTimer = useRef(null)

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  const taxSettings = { enabled: taxEnabled, fyKey, regime: taxRegime, otherIncomeText }

  const singleView = evaluateOffer(single, taxSettings)
  const viewA = evaluateOffer(offerA, taxSettings)
  const viewB = evaluateOffer(offerB, taxSettings)

  const runCopy = async (text) => {
    const ok = await copyText(text)
    if (ok) {
      setCopied(true)
      setCopyFailed(false)
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 1600)
    } else {
      setCopyFailed(true)
    }
  }

  const reset = () => {
    setSingle(EXAMPLE_A)
    setOfferA(EXAMPLE_A)
    setOfferB(EXAMPLE_B)
    setTaxEnabled(true)
    setFyKey('fy2026-27')
    setTaxRegime('new')
    setOtherIncomeText('')
    setCopied(false)
  }

  const clear = () => {
    setSingle(EMPTY_OFFER)
    setOfferA(EMPTY_OFFER)
    setOfferB(EMPTY_OFFER)
    setCopied(false)
    setCopyFailed(false)
  }

  const _activeView = mode === 'single' ? singleView : { a: viewA, b: viewB }
  const status = mode === 'single' ? singleView.status : viewA.status.kind === 'valid' && viewB.status.kind === 'valid' ? viewA.status : viewA.status.kind === 'invalid' || viewB.status.kind === 'invalid' ? { kind: 'invalid', message: 'Fix the highlighted fields in both offers.' } : { kind: 'idle', message: 'Fill in both offers to compare them.' }

  return (
    <div className="tool-stack">
      <section className="tool-panel">
        <h2 className="tool-panel__title">Salary / CTC Calculator</h2>
        <p className="tool-note">
          Break an offer into probable in-hand monthly pay — structure, deductions and an optional income-tax
          estimate for an Indian financial year. All numbers are estimates computed locally in your browser.
        </p>

        <div className="tool-modes" role="group" aria-label="Calculation mode">
          <button
            type="button"
            className={`tool-mode${mode === 'single' ? ' tool-mode--active' : ''}`}
            aria-pressed={mode === 'single'}
            onClick={() => setMode('single')}
          >
            Single offer
          </button>
          <button
            type="button"
            className={`tool-mode${mode === 'compare' ? ' tool-mode--active' : ''}`}
            aria-pressed={mode === 'compare'}
            onClick={() => setMode('compare')}
          >
            Compare offers
          </button>
        </div>

        {mode === 'single' ? (
          <>
            <OfferFields
              idPrefix="sal"
              title={null}
              offer={single}
              onChange={(key, value) => setSingle((current) => ({ ...current, [key]: value }))}
              errors={singleView.errors}
            />
            <TaxControls
              idPrefix="sal"
              taxEnabled={taxEnabled}
              setTaxEnabled={setTaxEnabled}
              fyKey={fyKey}
              setFyKey={setFyKey}
              regime={taxRegime}
              setRegime={setTaxRegime}
              otherIncomeText={otherIncomeText}
              setOtherIncomeText={setOtherIncomeText}
              errors={singleView.errors}
            />
          </>
        ) : (
          <>
            <TaxControls
              idPrefix="sal-cmp"
              taxEnabled={taxEnabled}
              setTaxEnabled={setTaxEnabled}
              fyKey={fyKey}
              setFyKey={setFyKey}
              regime={taxRegime}
              setRegime={setTaxRegime}
              otherIncomeText={otherIncomeText}
              setOtherIncomeText={setOtherIncomeText}
              errors={viewA.errors}
            />
            <div className="sal-compare">
              <OfferFields
                idPrefix="sal-a"
                title="Offer A"
                offer={offerA}
                onChange={(key, value) => setOfferA((current) => ({ ...current, [key]: value }))}
                errors={viewA.errors}
              />
              <OfferFields
                idPrefix="sal-b"
                title="Offer B"
                offer={offerB}
                onChange={(key, value) => setOfferB((current) => ({ ...current, [key]: value }))}
                errors={viewB.errors}
              />
            </div>
          </>
        )}

        <div className="tool-actions">
          <button type="button" className="tool-btn" onClick={clear}>
            Clear
          </button>
          <button type="button" className="tool-btn" onClick={reset}>
            Reset Example
          </button>
        </div>
      </section>

      <section className="tool-panel">
        <div className="codec-output__head">
          <h2 className="tool-panel__title">Results</h2>
          <span className={`codec-status codec-status--${status.kind}`} role="status" aria-live="polite">
            {status.kind === 'valid' ? '✓' : status.kind === 'invalid' ? '✕' : ''}
            Salary — {status.kind === 'valid' ? 'Ready' : status.kind === 'invalid' ? 'Invalid' : 'Waiting'}
          </span>
        </div>

        {copyFailed && <p className="tool-result__note">Could not copy automatically — copy the summary manually.</p>}

        {mode === 'single' ? (
          singleView.result ? (
            <>
              <Breakdown result={singleView.result} taxEnabled={taxEnabled} />
              <button type="button" className="tool-btn tool-btn--primary sal-copy" onClick={() => runCopy(salaryCopyFor(singleView.result))}>
                {copied ? 'Copied' : 'Copy salary breakdown'}
              </button>
            </>
          ) : (
            <p className="tool-result__note">{singleView.status.message}</p>
          )
        ) : viewA.result && viewB.result ? (
          <>
            <CompareTable resultA={viewA.result} resultB={viewB.result} taxEnabled={taxEnabled} />
            <button type="button" className="tool-btn tool-btn--primary sal-copy" onClick={() => runCopy(compareSalaryCopy(viewA, viewB))}>
              {copied ? 'Copied' : 'Copy comparison'}
            </button>
          </>
        ) : (
          <p className="tool-result__note">{status.message}</p>
        )}

        <p className="tool-result__note sal-assumptions">
          Estimates only — not a payslip, an offer or tax advice. Actual payroll splits, variable payouts and taxing can differ.
          The monthly take-home always excludes variable pay unless it is actually paid.
        </p>
      </section>
    </div>
  )
}

export default SalaryCtcCalculator