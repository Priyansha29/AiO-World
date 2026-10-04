import { useEffect, useRef, useState } from 'react'
import { copyText } from '../../domain/cidr-ipv4'
import {
  POPULAR_TIMEZONES,
  convertDateTime,
  copySummaryText,
  formatClockSeconds,
  formatLongDate,
  localTimeZone,
  offsetLabel,
  parseDatePart,
  parseTimePart,
} from '../../domain/timezone-converter'
import TimeZoneSelect from '../fields/TimeZoneSelect'

const EXAMPLE = { date: '2026-10-04', time: '12:00', from: 'Asia/Kolkata', to: 'America/New_York' }

function buildView(date, time, fromZone, toZone) {
  if (!date.trim() || !time.trim()) {
    return { status: { kind: 'idle', message: 'Enter a date and time to convert.' }, result: null }
  }
  const converted = convertDateTime(date, time, fromZone, toZone)
  if (!converted.ok) {
    return { status: { kind: 'invalid', message: converted.error }, result: null }
  }
  return { status: { kind: 'valid', message: `${fromZone} → ${toZone}` }, result: converted }
}

function rolloverBadge(dayDiff) {
  if (dayDiff === 1) return { text: 'Next day', kind: 'next' }
  if (dayDiff === -1) return { text: 'Previous day', kind: 'prev' }
  if (dayDiff > 1) return { text: `+${dayDiff} days`, kind: 'next' }
  if (dayDiff < -1) return { text: `${dayDiff} days`, kind: 'prev' }
  return null
}

function TzResultBlock({ label, entry, zone, dayDiff, copied, onCopy }) {
  const badge = rolloverBadge(dayDiff)
  return (
    <div className="tz-result">
      <div className="tz-result__head">
        <span className="json-controls__label">{label}</span>
        <button type="button" className="tool-btn" onClick={() => onCopy(`${zone}-time`, `${entry.shortDate} ${entry.clock}`)}>
          {copied === `${zone}-time` ? 'Copied' : 'Copy time'}
        </button>
      </div>
      <p className="tz-result__clock">{entry.clock}</p>
      <p className="tz-result__date">
        {entry.date}
        {badge && <span className={`tz-badge tz-badge--${badge.kind}`}>{badge.text}</span>}
      </p>
      <div className="tz-result__meta">
        <span className="tz-result__zone" title={zone}>
          {zone}
        </span>
        <span className="tz-result__offset">{entry.offset}</span>
      </div>
      <div className="tz-result__acts">
        <button type="button" className="tool-btn tool-btn--tiny" onClick={() => onCopy(`${zone}-zone`, zone)}>
          {copied === `${zone}-zone` ? 'Copied' : 'Copy zone'}
        </button>
        <button type="button" className="tool-btn tool-btn--tiny" onClick={() => onCopy(`${zone}-offset`, entry.offset)}>
          {copied === `${zone}-offset` ? 'Copied' : 'Copy offset'}
        </button>
      </div>
    </div>
  )
}

function TimezoneConverter() {
  const [date, setDate] = useState(EXAMPLE.date)
  const [time, setTime] = useState(EXAMPLE.time)
  const [from, setFrom] = useState(EXAMPLE.from)
  const [to, setTo] = useState(EXAMPLE.to)
  const [data, setData] = useState(() => buildView(EXAMPLE.date, EXAMPLE.time, EXAMPLE.from, EXAMPLE.to))
  const [copied, setCopied] = useState('')
  const [copyFailed, setCopyFailed] = useState(false)
  const [now, setNow] = useState(null)
  const copyTimer = useRef(null)
  const nowTimer = useRef(null)

  useEffect(() => {
    const tick = () => setNow(new Date())
    const kickoff = setTimeout(tick, 0)
    nowTimer.current = setInterval(tick, 30000)
    return () => {
      clearTimeout(kickoff)
      clearTimeout(copyTimer.current)
      clearInterval(nowTimer.current)
    }
  }, [])

  const refresh = (dateValue, timeValue, fromZone, toZone) => setData(buildView(dateValue, timeValue, fromZone, toZone))

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

  const { status, message, result } = data
  const dateError = date.trim() && !parseDatePart(date) ? 'Enter a valid date.' : null
  const timeError = time.trim() && !parseTimePart(time) ? 'Enter a valid time.' : null
  const referenceDate = date.trim() && parseDatePart(date) ? date : undefined
  const statusText = status.kind === 'valid' ? 'Valid' : status.kind === 'invalid' ? 'Invalid' : 'Waiting'
  const local = localTimeZone()

  return (
    <div className="tool-panel">
      <h2 className="tool-panel__title">Time Zone Converter</h2>

      <p className="tool-note">Compare times across zones before you schedule anything.</p>

      <div className="tz-fields">
        <div className="tool-field">
          <label className="tool-field__label" htmlFor="tz-date">
            Date
          </label>
          <span className="tool-field__control">
            <input
              id="tz-date"
              className="cidr-input"
              type="date"
              value={date}
              aria-invalid={dateError != null}
              aria-describedby={dateError ? 'tz-date-error' : undefined}
              onChange={(event) => {
                setDate(event.target.value)
                refresh(event.target.value, time, from, to)
              }}
            />
          </span>
          {dateError && (
            <span className="tool-field__error" id="tz-date-error" role="alert">
              {dateError}
            </span>
          )}
        </div>

        <div className="tool-field">
          <label className="tool-field__label" htmlFor="tz-time">
            Time
          </label>
          <span className="tool-field__control">
            <input
              id="tz-time"
              className="cidr-input"
              type="time"
              value={time}
              step="60"
              aria-invalid={timeError != null}
              aria-describedby={timeError ? 'tz-time-error' : undefined}
              onChange={(event) => {
                setTime(event.target.value)
                refresh(date, event.target.value, from, to)
              }}
            />
          </span>
          {timeError && (
            <span className="tool-field__error" id="tz-time-error" role="alert">
              {timeError}
            </span>
          )}
        </div>

        <div className="tool-field">
          <span className="json-controls__label">From (source) time zone</span>
          <TimeZoneSelect id="tz-from" label="From time zone" value={from} onChange={(zone) => { setFrom(zone); refresh(date, time, zone, to) }} referenceDate={referenceDate} />
        </div>

        <div className="tool-field">
          <span className="json-controls__label">To (target) time zone</span>
          <TimeZoneSelect id="tz-to" label="To time zone" value={to} onChange={(zone) => { setTo(zone); refresh(date, time, from, zone) }} referenceDate={referenceDate} />
        </div>
      </div>

      <div className="tz-local">
        <button
          type="button"
          className="tool-btn"
          onClick={() => {
            const detected = localTimeZone()
            setFrom(detected)
            refresh(date, time, detected, to)
          }}
        >
          Use My Local Time Zone{from === local ? ` (${local})` : ''}
        </button>
        <span className="tool-field__hint">Sets the source zone to this device&apos;s zone, detected as {local || '—'}.</span>
      </div>

      <div className="tool-actions">
        <button type="button" className="tool-btn tool-btn--primary" onClick={() => refresh(date, time, from, to)}>
          Convert
        </button>
        <button
          type="button"
          className="tool-btn"
          onClick={() => {
            setFrom(to)
            setTo(from)
            refresh(date, time, to, from)
          }}
        >
          Swap
        </button>
        <button
          type="button"
          className="tool-btn"
          onClick={() => {
            setDate('')
            setTime('')
            setCopied('')
            setCopyFailed(false)
            setData(buildView('', '', from, to))
          }}
        >
          Clear
        </button>
        <button
          type="button"
          className="tool-btn"
          onClick={() => {
            setDate(EXAMPLE.date)
            setTime(EXAMPLE.time)
            setFrom(EXAMPLE.from)
            setTo(EXAMPLE.to)
            setCopied('')
            setCopyFailed(false)
            setData(buildView(EXAMPLE.date, EXAMPLE.time, EXAMPLE.from, EXAMPLE.to))
          }}
        >
          Reset Example
        </button>
      </div>

      <div className="codec-output tz-output">
        <div className="codec-output__head">
          <span className={`codec-status codec-status--${status.kind}`} role="status" aria-live="polite">
            {status.kind === 'valid' ? '✓' : status.kind === 'invalid' ? '✕' : ''}
            {status.kind === 'valid' || status.kind === 'invalid' ? `Time zone — ${statusText}` : 'Time zone — Waiting'}
          </span>
        </div>
        {message && <p className="tool-result__note">{message}</p>}
        {copyFailed && <p className="tool-result__note">Could not copy automatically — copy the value manually.</p>}

        {result && (
          <>
            <div className="tz-results">
              <TzResultBlock label="Source time" entry={result.source} zone={result.fromZone} dayDiff={0} copied={copied} onCopy={runCopy} />
              <TzResultBlock label="Converted time" entry={result.target} zone={result.toZone} dayDiff={result.dayDiff} copied={copied} onCopy={runCopy} />
            </div>
            {result.sameZone && <p className="tool-result__note">Both zones are the same — the times shown are identical.</p>}
            {!result.sameZone && result.dayDiff !== 0 && (
              <p className="tool-result__note">
                The target is on a different calendar date — check the badge on its date line.
              </p>
            )}

            <div className="tool-actions">
              <button type="button" className="tool-btn tool-btn--primary" onClick={() => runCopy('summary', copySummaryText(result))}>
                {copied === 'summary' ? 'Copied' : 'Copy Summary'}
              </button>
            </div>
          </>
        )}
      </div>

      <h3 className="cidr-section__title">Popular time zones</h3>
      <div className="tz-popular" aria-label="Popular time zones">
        {POPULAR_TIMEZONES.map((zone) => (
          <button
            key={zone}
            type="button"
            className={`tz-chip${zone === from ? ' tz-chip--active' : ''}`}
            aria-pressed={zone === from}
            onClick={() => {
              setFrom(zone)
              refresh(date, time, zone, to)
            }}
          >
            {zone === from ? '✓ ' : ''}
            {zone}
          </button>
        ))}
      </div>
      <p className="tool-field__hint">Click a popular zone to make it the source zone.</p>

      <h3 className="cidr-section__title">Current time</h3>
      <div className="tz-now">
        <div className="tz-now__card">
          <span className="tool-field__hint">Source · {from}</span>
          <code className="tz-now__clock">{now ? formatClockSeconds(now, from) : '—'}</code>
          <code className="tz-now__date">{now ? formatLongDate(now, from) : 'Loading…'}</code>
          <code className="tz-now__meta">{now ? offsetLabel(from, now) : ''}</code>
        </div>
        <div className="tz-now__card">
          <span className="tool-field__hint">Target · {to}</span>
          <code className="tz-now__clock">{now ? formatClockSeconds(now, to) : '—'}</code>
          <code className="tz-now__date">{now ? formatLongDate(now, to) : 'Loading…'}</code>
          <code className="tz-now__meta">{now ? offsetLabel(to, now) : ''}</code>
        </div>
      </div>
      <p className="tool-field__hint">The current time refreshes automatically every 30 seconds.</p>
    </div>
  )
}

export default TimezoneConverter