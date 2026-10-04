import { useCallback, useEffect, useRef, useState } from 'react'
import {
  CURRENCIES,
  convertAmount,
  currencyByCode,
  formatAmount,
  formatRate,
  formatTimestamp,
  rateFor,
} from '../../domain/currency-converter'
import { CurrencyApiError, fetchRates } from '../../services/currency-api'

const AMOUNT_RE = /^\d+(?:\.\d+)?$/

function loadPref(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = window.localStorage.getItem(key)
    return stored && currencyByCode(stored) ? stored : fallback
  } catch {
    return fallback
  }
}

function savePref(key, value) {
  try {
    const store = window.localStorage
    if (value) store.setItem(key, value)
    else store.removeItem(key)
  } catch {
    // Storage unavailable (private mode) — preferences simply do not persist.
  }
}

function parseAmount(text) {
  const value = typeof text === 'string' ? text.trim() : ''
  if (value === '') return { ok: false, error: 'Amount is required.' }
  if (/^-?\d/.test(value) && !AMOUNT_RE.test(value)) {
    return { ok: false, error: 'Enter an amount greater than or equal to 0.' }
  }
  if (!AMOUNT_RE.test(value)) return { ok: false, error: 'Enter a valid number.' }
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0) {
    return { ok: false, error: 'Enter an amount greater than or equal to 0.' }
  }
  return { ok: true, value: number }
}

function errorMessage(ratesError) {
  if (ratesError?.kind === 'network') {
    return 'Unable to retrieve current exchange rates. Check your connection and try again.'
  }
  return 'Exchange rates are temporarily unavailable.'
}

function CurrencyConverter() {
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState(() => loadPref('aioworld-currency-from', 'USD'))
  const [to, setTo] = useState(() => loadPref('aioworld-currency-to', 'INR'))
  const [rates, setRates] = useState(null)
  const [ratesError, setRatesError] = useState(null)
  const [fetching, setFetching] = useState(false)
  const mountedRef = useRef(false)
  const fetchToken = useRef(0)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    savePref('aioworld-currency-from', from)
    savePref('aioworld-currency-to', to)
  }, [from, to])

  const loadRates = useCallback(async () => {
    const token = fetchToken.current + 1
    fetchToken.current = token
    try {
      const data = await fetchRates()
      if (mountedRef.current && token === fetchToken.current) {
        setRates(data)
        setRatesError(null)
        setFetching(false)
      }
    } catch (error) {
      if (mountedRef.current && token === fetchToken.current) {
        setRatesError({
          kind: error instanceof CurrencyApiError ? error.kind : 'unavailable',
          message: errorMessage(error instanceof CurrencyApiError ? error : { kind: 'unavailable' }),
        })
        setFetching(false)
      }
    }
  }, [])

  const startFetch = useCallback(() => {
    setFetching(true)
    setRatesError(null)
    loadRates()
  }, [loadRates])

  useEffect(() => {
    if (from === to) return
    const timerId = setTimeout(startFetch, 0)
    return () => clearTimeout(timerId)
  }, [from, to, startFetch])

  const parsed = parseAmount(amount)
  const sameCurrency = from === to
  const pairRate = sameCurrency ? 1 : rateFor(from, to, rates?.rates)
  const rateMissing = !sameCurrency && !pairRate && rates != null
  const converted = parsed.ok && pairRate != null ? convertAmount(parsed.value, from, to, rates?.rates) : null

  let status = { kind: 'idle', message: null }
  if (parsed.error) {
    status = { kind: 'invalid', message: parsed.error }
  } else if (sameCurrency) {
    status = { kind: 'valid', message: `${from} → ${to} is always 1:1 — no rate lookup needed.` }
  } else if (ratesError) {
    status = { kind: 'invalid', message: errorMessage(ratesError) }
  } else if (fetching && !rates) {
    status = { kind: 'idle', message: 'Fetching the latest exchange rate...' }
  } else if (rateMissing) {
    status = { kind: 'invalid', message: `The exchange rate for ${from} or ${to} is unavailable right now.` }
  } else if (rates) {
    status = { kind: 'valid', message: `${formatAmount(parsed.value, from)} ${from} ${sameCurrency ? '=' : '≈'} ${formatAmount(converted, to)} ${to}` }
  }

  const statusText =
    status.kind === 'valid' ? 'Valid' : status.kind === 'invalid' ? 'Invalid' : fetching ? 'Loading' : 'Waiting'

  const swapCurrencies = () => {
    setFrom(to)
    setTo(from)
  }

  const convert = () => {
    if (sameCurrency) return
    startFetch()
  }

  return (
    <div className="tool-panel">
      <h2 className="tool-panel__title">Currency Converter</h2>

      <p className="tool-note">
        Rates come through the app&apos;s server from a real provider — nothing is hard-coded in your browser.
      </p>

      <div className="ccur-fields">
        <div className="tool-field ccur-amount">
          <div className="json-input-head">
            <label className="tool-field__label" htmlFor="ccur-amount">
              Amount
            </label>
          </div>
          <span className="tool-field__control">
            <input
              id="ccur-amount"
              className="cidr-input"
              type="text"
              inputMode="decimal"
              spellCheck={false}
              value={amount}
              placeholder="100"
              aria-invalid={parsed.error != null}
              aria-describedby={parsed.error ? 'ccur-amount-error' : undefined}
              onChange={(event) => setAmount(event.target.value)}
            />
          </span>
          <span className="tool-field__hint">Decimal amounts are fine. Negative amounts are not converted.</span>
          {parsed.error && (
            <p className="cidr-error" id="ccur-amount-error" role="alert">
              ✕ {parsed.error}
            </p>
          )}
        </div>

        <div className="tool-field">
          <label className="tool-field__label" htmlFor="ccur-from">
            From
          </label>
          <span className="tool-field__control">
            <select id="ccur-from" className="cidr-prefix" value={from} onChange={(event) => setFrom(event.target.value)}>
              {CURRENCIES.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.code} — {entry.name}
                </option>
              ))}
            </select>
          </span>
        </div>

        <div className="ccur-swap">
          <button type="button" className="tool-btn ccur-swap__btn" aria-label="Swap From and To currencies" onClick={swapCurrencies}>
            ⇄ Swap
          </button>
        </div>

        <div className="tool-field">
          <label className="tool-field__label" htmlFor="ccur-to">
            To
          </label>
          <span className="tool-field__control">
            <select id="ccur-to" className="cidr-prefix" value={to} onChange={(event) => setTo(event.target.value)}>
              {CURRENCIES.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.code} — {entry.name}
                </option>
              ))}
            </select>
          </span>
        </div>
      </div>

      <div className="tool-actions">
        <button
          type="button"
          className="tool-btn tool-btn--primary"
          aria-busy={fetching}
          onClick={convert}
        >
          Convert
        </button>
      </div>

      <div className="codec-output cidr-results">
        <div className="codec-output__head">
          <span className={`codec-status codec-status--${status.kind === 'idle' ? 'idle' : status.kind}`} role="status" aria-live="polite">
            {status.kind === 'valid' ? '✓' : status.kind === 'invalid' ? '✕' : ''}
            {`Currency — ${statusText}`}
          </span>
          {fetching && rates && (
            <span className="tool-result__note ccur-refreshing">Refreshing rate...</span>
          )}
        </div>
        {status.message && <p className="tool-result__note">{status.message}</p>}

        {converted != null && pairRate != null && !ratesError && (
          <>
            <div className="ccur-quote">
              <span className="json-controls__label">Converted amount</span>
              <p className="ccur-quote__line">
                {formatAmount(parsed.value, from)} {from}
                <span className="ccur-quote__approx" aria-hidden>
                  {' '}
                  {sameCurrency ? '=' : '≈'}{' '}
                </span>
                {formatAmount(converted, to)} {to}
              </p>
            </div>

            <ul className="cidr-grid">
              <li className="cidr-card">
                <div className="clr-card__head">
                  <span className="json-controls__label">Exchange rate</span>
                </div>
                <code className="clr-card__value">
                  1 {from} = {pairRate === 1 ? '1' : formatRate(pairRate)} {to}
                </code>
              </li>
              <li className="cidr-card">
                <div className="clr-card__head">
                  <span className="json-controls__label">Inverse</span>
                </div>
                <code className="clr-card__value">
                  1 {to} = {pairRate === 1 ? '1' : formatRate(1 / pairRate)} {from}
                </code>
              </li>
            </ul>

            {rates && (
              <div className="ccur-meta">
                <span className="ccur-meta__item">
                  <span className="json-controls__label">Source</span>
                  <code className="ccur-meta__value">{rates.source}</code>
                </span>
                <span className="ccur-meta__item">
                  <span className="json-controls__label">Rate updated</span>
                  <code className="ccur-meta__value">{formatTimestamp(rates.updatedAt)}</code>
                </span>
              </div>
            )}
            {rates?.cached && (
              <p className="tool-result__note">
                This rate was served from a short server-side cache to keep provider calls light.
              </p>
            )}
            {!rates?.cached && rates && (
              <p className="tool-result__note">
                Rates refresh roughly hourly from the provider — the timestamp above is theirs.
              </p>
            )}
          </>
        )}

        {ratesError && (
          <div className="ccur-error">
            <p className="tool-result__note">{errorMessage(ratesError)}</p>
            <button type="button" className="tool-btn tool-btn--primary" onClick={convert}>
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CurrencyConverter