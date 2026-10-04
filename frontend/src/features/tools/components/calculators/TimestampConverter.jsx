import { useEffect, useRef, useState } from 'react'
import {
  copyText,
  nowInfo,
  parseDateTime,
  timestampToInstant,
  zoneName,
} from '../../domain/timestamp-converter'

const TS_DEFAULT_SECONDS = '0'
const DT_DEFAULT_UTC = '2026-10-04T12:00:00Z'

const IDLE_TS = { kind: 'idle', message: 'Enter a Unix timestamp in seconds or milliseconds.' }
const IDLE_DT = { kind: 'idle', message: 'Enter a date/time — ISO 8601, with or without a time zone.' }

function ValueRow({ label, value, copyKey, copied, onCopy, zone }) {
  return (
    <div className="ts-row">
      <div className="ts-row__text">
        <span className="ts-row__label">
          {label}
          {zone && <span className="ts-row__zone">{zone}</span>}
        </span>
        <code className="ts-row__value">{value}</code>
      </div>
      <button
        type="button"
        className="tool-btn"
        disabled={value === ''}
        onClick={() => onCopy(copyKey, value)}
      >
        {copied === copyKey ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

function TimestampConverter() {
  const [current, setCurrent] = useState(() => nowInfo())
  const [mode, setMode] = useState('ts')
  const [tsUnit, setTsUnit] = useState('seconds')
  const [tsInput, setTsInput] = useState('')
  const [tsResult, setTsResult] = useState(null)
  const [tsStatus, setTsStatus] = useState(IDLE_TS)
  const [dtInterpretation, setDtInterpretation] = useState('utc')
  const [dtInput, setDtInput] = useState('')
  const [dtResult, setDtResult] = useState(null)
  const [dtStatus, setDtStatus] = useState(IDLE_DT)
  const [copied, setCopied] = useState('')
  const [copyFailed, setCopyFailed] = useState(false)
  const copyTimer = useRef(null)

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  const runCopy = async (key, value) => {
    const ok = await copyText(value)
    if (ok) {
      setCopied(key)
      setCopyFailed(false)
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(''), 1500)
    } else {
      setCopyFailed(true)
    }
  }

  const refreshCurrent = () => setCurrent(nowInfo())

  const applyTs = (value, unit) => {
    const res = timestampToInstant(value, unit)
    setTsResult(res.ok ? res : null)
    if (!res.ok) {
      setTsStatus(res.empty ? IDLE_TS : { kind: 'invalid', message: res.error })
    } else {
      setTsStatus({ kind: 'valid', message: `${unit === 'seconds' ? 'Seconds' : 'Milliseconds'} → date.` })
    }
  }

  const handleTsInput = (value) => {
    setTsInput(value)
    applyTs(value, tsUnit)
  }

  const changeTsUnit = (unit) => {
    setTsUnit(unit)
    if (tsInput !== '') applyTs(tsInput, unit)
  }

  const applyDt = (value, interpretation) => {
    const res = parseDateTime(value, interpretation)
    setDtResult(res.ok ? res : null)
    if (!res.ok) {
      setDtStatus(res.empty ? IDLE_DT : { kind: 'invalid', message: res.error })
    } else {
      let message
      if (res.origin === 'explicit') {
        message = 'Input carries an explicit offset — treated as that instant.'
      } else if (interpretation === 'utc') {
        message = 'No zone given — interpreted as UTC.'
      } else {
        message = `No zone given — interpreted as local time (${res.offsetLabel}).`
      }
      setDtStatus({ kind: 'valid', message })
    }
  }

  const handleDtInput = (value) => {
    setDtInput(value)
    applyDt(value, dtInterpretation)
  }

  const changeDtInterpretation = (next) => {
    setDtInterpretation(next)
    if (dtInput !== '') applyDt(dtInput, next)
  }

  const clearActive = () => {
    if (mode === 'ts') {
      setTsInput('')
      setTsResult(null)
      setTsStatus(IDLE_TS)
    } else {
      setDtInput('')
      setDtResult(null)
      setDtStatus(IDLE_DT)
    }
    setCopied('')
    setCopyFailed(false)
  }

  const resetActive = () => {
    if (mode === 'ts') {
      setTsUnit('seconds')
      setTsInput(TS_DEFAULT_SECONDS)
      applyTs(TS_DEFAULT_SECONDS, 'seconds')
    } else {
      setDtInterpretation('utc')
      setDtInput(DT_DEFAULT_UTC)
      applyDt(DT_DEFAULT_UTC, 'utc')
    }
    setCopied('')
    setCopyFailed(false)
  }

  const tsInvalid = tsStatus.kind === 'invalid'
  const dtInvalid = dtStatus.kind === 'invalid'

  return (
    <div className="tool-panel">
      <h2 className="tool-panel__title">Timestamp converter</h2>

      <p className="tool-note">
        All of this runs in your browser — dates and timestamps never leave this page.
      </p>

      <section className="ts-current" aria-label="Current timestamp">
        <div className="codec-input-head">
          <h3 className="ts-title">Current timestamp</h3>
          <button type="button" className="tool-btn" onClick={refreshCurrent}>
            Refresh
          </button>
        </div>
        <p className="ts-zone">
          Time zone: {zoneName()} ({current?.offsetLabel ?? ''})
        </p>
        {current && (
          <div className="ts-values">
            <ValueRow
              label="Unix seconds"
              value={String(current.seconds)}
              copyKey="cur-sec"
              copied={copied}
              onCopy={runCopy}
            />
            <ValueRow
              label="Unix milliseconds"
              value={String(current.milliseconds)}
              copyKey="cur-ms"
              copied={copied}
              onCopy={runCopy}
            />
            <ValueRow
              label="Local date/time"
              zone={current.offsetLabel}
              value={current.localText}
              copyKey="cur-local"
              copied={copied}
              onCopy={runCopy}
            />
            <ValueRow
              label="UTC date/time"
              value={current.utcText}
              copyKey="cur-utc"
              copied={copied}
              onCopy={runCopy}
            />
          </div>
        )}
      </section>

      <div className="ts-modes">
        <div className="tool-modes" role="group" aria-label="Conversion direction">
          <button
            type="button"
            className={`tool-mode${mode === 'ts' ? ' tool-mode--active' : ''}`}
            aria-pressed={mode === 'ts'}
            onClick={() => setMode('ts')}
          >
            Timestamp → Date
          </button>
          <button
            type="button"
            className={`tool-mode${mode === 'dt' ? ' tool-mode--active' : ''}`}
            aria-pressed={mode === 'dt'}
            onClick={() => setMode('dt')}
          >
            Date → Timestamp
          </button>
        </div>
      </div>

      {mode === 'ts' ? (
        <section className="ts-convert" aria-label="Timestamp to date">
          <div className="tool-field">
            <div className="codec-input-head">
              <label className="tool-field__label" htmlFor="ts-input">
                Unix timestamp
              </label>
              <div className="codec-input-tools">
                <button type="button" className="tool-btn" onClick={clearActive}>
                  Clear
                </button>
                <button type="button" className="tool-btn" onClick={resetActive}>
                  Reset
                </button>
              </div>
            </div>
            <div className="ts-fields">
              <span className="tool-field__control ts-input-control">
                <input
                  id="ts-input"
                  className="ts-input"
                  type="text"
                  inputMode="numeric"
                  spellCheck={false}
                  value={tsInput}
                  placeholder="e.g. 1728000000"
                  aria-invalid={tsInvalid}
                  onChange={(event) => handleTsInput(event.target.value)}
                />
              </span>
              <div className="tool-modes" role="group" aria-label="Timestamp unit">
                {['seconds', 'ms'].map((unit) => (
                  <button
                    type="button"
                    key={unit}
                    className={`tool-mode${tsUnit === unit ? ' tool-mode--active' : ''}`}
                    aria-pressed={tsUnit === unit}
                    onClick={() => changeTsUnit(unit)}
                  >
                    {unit === 'seconds' ? 'Seconds' : 'Milliseconds'}
                  </button>
                ))}
              </div>
            </div>
            <span className="tool-field__hint">
              Negative values (before 1970) and fractional seconds are supported.
            </span>
          </div>

          <div className="codec-output">
            <div className="codec-output__head">
              <span
                className={`codec-status codec-status--${tsStatus.kind}`}
                role="status"
                aria-live="polite"
              >
                {tsStatus.kind === 'valid' ? '✓' : tsStatus.kind === 'invalid' ? '✕' : ''}
                {tsStatus.kind === 'valid'
                  ? 'Valid timestamp'
                  : tsStatus.kind === 'invalid'
                    ? 'Invalid timestamp'
                    : 'Waiting'}
              </span>
            </div>
            {tsStatus.message && <p className="tool-result__note">{tsStatus.message}</p>}
            {tsResult && (
              <div className="ts-values">
                <ValueRow
                  label="Local date/time"
                  zone={tsResult.offsetLabel}
                  value={tsResult.localText}
                  copyKey="ts-local"
                  copied={copied}
                  onCopy={runCopy}
                />
                <ValueRow
                  label="UTC date/time"
                  value={tsResult.utcText}
                  copyKey="ts-utc"
                  copied={copied}
                  onCopy={runCopy}
                />
                <ValueRow
                  label="ISO 8601 (UTC)"
                  value={tsResult.isoUtc}
                  copyKey="ts-iso"
                  copied={copied}
                  onCopy={runCopy}
                />
              </div>
            )}
            {copyFailed && (
              <p className="tool-result__note">Could not copy automatically — copy the value manually.</p>
            )}
          </div>
        </section>
      ) : (
        <section className="ts-convert" aria-label="Date to timestamp">
          <div className="tool-field">
            <div className="codec-input-head">
              <label className="tool-field__label" htmlFor="dt-input">
                Date / ISO 8601
              </label>
              <div className="codec-input-tools">
                <button type="button" className="tool-btn" onClick={clearActive}>
                  Clear
                </button>
                <button type="button" className="tool-btn" onClick={resetActive}>
                  Reset
                </button>
              </div>
            </div>
            <div className="ts-fields">
              <span className="tool-field__control ts-input-control">
                <input
                  id="dt-input"
                  className="ts-input"
                  type="text"
                  spellCheck={false}
                  value={dtInput}
                  placeholder="e.g. 2026-10-04T12:00:00Z"
                  aria-invalid={dtInvalid}
                  onChange={(event) => handleDtInput(event.target.value)}
                />
              </span>
              <div className="tool-modes" role="group" aria-label="Zoneless input interpretation">
                <button
                  type="button"
                  className={`tool-mode${dtInterpretation === 'local' ? ' tool-mode--active' : ''}`}
                  aria-pressed={dtInterpretation === 'local'}
                  onClick={() => changeDtInterpretation('local')}
                >
                  Local time
                </button>
                <button
                  type="button"
                  className={`tool-mode${dtInterpretation === 'utc' ? ' tool-mode--active' : ''}`}
                  aria-pressed={dtInterpretation === 'utc'}
                  onClick={() => changeDtInterpretation('utc')}
                >
                  UTC
                </button>
              </div>
            </div>
            <span className="tool-field__hint">
              An explicit Z or ±offset always wins; otherwise the toggle decides local vs UTC.
            </span>
          </div>

          <div className="codec-output">
            <div className="codec-output__head">
              <span
                className={`codec-status codec-status--${dtStatus.kind}`}
                role="status"
                aria-live="polite"
              >
                {dtStatus.kind === 'valid' ? '✓' : dtStatus.kind === 'invalid' ? '✕' : ''}
                {dtStatus.kind === 'valid'
                  ? 'Valid date/time'
                  : dtStatus.kind === 'invalid'
                    ? 'Invalid date/time'
                    : 'Waiting'}
              </span>
            </div>
            {dtStatus.message && <p className="tool-result__note">{dtStatus.message}</p>}
            {dtResult && (
              <div className="ts-values">
                <ValueRow
                  label="Unix seconds"
                  value={String(dtResult.seconds)}
                  copyKey="dt-sec"
                  copied={copied}
                  onCopy={runCopy}
                />
                <ValueRow
                  label="Unix milliseconds"
                  value={String(dtResult.milliseconds)}
                  copyKey="dt-ms"
                  copied={copied}
                  onCopy={runCopy}
                />
                <ValueRow
                  label="Local representation"
                  zone={dtResult.offsetLabel}
                  value={dtResult.localText}
                  copyKey="dt-local"
                  copied={copied}
                  onCopy={runCopy}
                />
                <ValueRow
                  label="UTC representation"
                  value={dtResult.utcText}
                  copyKey="dt-utc"
                  copied={copied}
                  onCopy={runCopy}
                />
              </div>
            )}
            {copyFailed && (
              <p className="tool-result__note">Could not copy automatically — copy the value manually.</p>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

export default TimestampConverter