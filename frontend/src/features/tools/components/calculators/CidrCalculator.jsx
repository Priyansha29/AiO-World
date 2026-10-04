import { useEffect, useRef, useState } from 'react'
import {
  calculate,
  copySummary,
  copyText,
  MAX_PREFIX,
  parseIpv4,
  parsePrefix,
  QUICK_REFERENCE,
  splitCombined,
} from '../../domain/cidr-ipv4'

const IDLE = { kind: 'idle', message: 'Enter an IPv4 address and prefix to expand the block.' }
const PREFIX_OPTIONS = Array.from({ length: MAX_PREFIX + 1 }, (_, i) => i)

function ResultCard({ label, value, copyKey, copied, onCopy }) {
  return (
    <div className="cidr-card">
      <div className="clr-card__head">
        <span className="json-controls__label">{label}</span>
        <button type="button" className="tool-btn" onClick={() => onCopy(copyKey, value)}>
          {copied === copyKey ? 'Copied' : 'Copy'}
        </button>
      </div>
      <code className="clr-card__value">{value}</code>
    </div>
  )
}

function CidrCalculator() {
  const [inputRaw, setInputRaw] = useState('')
  const [prefix, setPrefix] = useState(24)
  const [result, setResult] = useState(null)
  const [ipError, setIpError] = useState(null)
  const [prefixError, setPrefixError] = useState(null)
  const [status, setStatus] = useState(IDLE)
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

  const compute = (raw, prefixNum) => {
    const spl = splitCombined(raw)
    const ipSource = spl ? spl.ipPart : raw
    if (spl) {
      const p = parsePrefix(spl.prefixPart)
      setPrefixError(p.ok ? null : p.error)
    } else {
      setPrefixError(null)
    }
    if (ipSource === '') {
      setResult(null)
      setIpError(null)
      setStatus(IDLE)
      return
    }
    const ip = parseIpv4(ipSource)
    if (!ip.ok) {
      setResult(null)
      setIpError(ip.error)
      setStatus({ kind: 'invalid', message: ip.error })
      return
    }
    setIpError(null)
    const next = calculate(ip.value, prefixNum)
    setResult(next)
    setStatus({
      kind: 'valid',
      message: `Network ${next.networkText}/${prefixNum} — ${next.usableText} usable hosts.`,
    })
  }

  const handleIpChange = (raw) => {
    setInputRaw(raw)
    const spl = splitCombined(raw)
    if (spl) {
      const p = parsePrefix(spl.prefixPart)
      if (p.ok) {
        setPrefix(p.value)
        compute(raw, p.value)
      } else {
        compute(raw, prefix)
      }
    } else {
      compute(raw, prefix)
    }
  }

  const handlePrefixChange = (event) => {
    const next = Number(event.target.value)
    setPrefix(next)
    compute(inputRaw, next)
  }

  const runCalculate = () => compute(inputRaw, prefix)

  const clearAll = () => {
    setInputRaw('')
    setResult(null)
    setIpError(null)
    setPrefixError(null)
    setStatus(IDLE)
    setCopied('')
    setCopyFailed(false)
  }

  const resetExample = () => {
    setInputRaw('192.168.1.10')
    setPrefix(24)
    setCopied('')
    setCopyFailed(false)
    compute('192.168.1.10', 24)
  }

  const statusText =
    status.kind === 'valid' ? 'Valid' : status.kind === 'invalid' ? 'Invalid' : 'Waiting'

  return (
    <div className="tool-panel">
      <h2 className="tool-panel__title">IP / CIDR calculator</h2>

      <p className="tool-note">
        All of this runs in your browser — IP addresses never leave this page.
      </p>

      <div className="cidr-fields">
        <div className="tool-field">
          <div className="json-input-head">
            <label className="tool-field__label" htmlFor="cidr-ip">
              IPv4 address
            </label>
          </div>
          <span className="tool-field__control">
            <input
              id="cidr-ip"
              className="cidr-input"
              type="text"
              inputMode="numeric"
              spellCheck={false}
              value={inputRaw}
              placeholder="192.168.1.10"
              aria-invalid={ipError != null || status.kind === 'invalid'}
              aria-describedby={ipError ? 'cidr-ip-error' : undefined}
              onChange={(event) => handleIpChange(event.target.value)}
            />
          </span>
          <span className="tool-field__hint">Tip: paste 192.168.1.10/24 to fill in both.</span>
          {ipError && (
            <p className="cidr-error" id="cidr-ip-error" role="alert">
              ✕ {ipError}
            </p>
          )}
        </div>

        <div className="tool-field">
          <label className="tool-field__label" htmlFor="cidr-prefix">
            CIDR prefix
          </label>
          <span className="tool-field__control">
            <select
              id="cidr-prefix"
              className="cidr-prefix"
              value={prefix}
              aria-describedby={prefixError ? 'cidr-prefix-error' : undefined}
              onChange={handlePrefixChange}
            >
              {PREFIX_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  /{value}
                </option>
              ))}
            </select>
          </span>
          <span className="tool-field__hint">Host bits = 32 − prefix.</span>
          {prefixError && (
            <p className="cidr-error" id="cidr-prefix-error" role="alert">
              ✕ {prefixError}
            </p>
          )}
        </div>
      </div>

      <div className="tool-actions">
        <button type="button" className="tool-btn tool-btn--primary" onClick={runCalculate}>
          Calculate
        </button>
        <button type="button" className="tool-btn" onClick={clearAll}>
          Clear
        </button>
        <button type="button" className="tool-btn" onClick={resetExample}>
          Reset Example
        </button>
      </div>

      <div className="codec-output cidr-results">
        <div className="codec-output__head">
          <span className={`codec-status codec-status--${status.kind}`} role="status" aria-live="polite">
            {status.kind === 'valid' ? '✓' : status.kind === 'invalid' ? '✕' : ''}
            {status.kind === 'valid' || status.kind === 'invalid' ? `IP / CIDR — ${statusText}` : 'IP / CIDR — Waiting'}
          </span>
        </div>
        {status.message && <p className="tool-result__note">{status.message}</p>}

        {result && (
          <>
            <div className="cidr-meta">
              <span className="cidr-meta__item">
                <span className="json-controls__label">IP address</span>
                <code className="cidr-meta__value">{result.ipText}</code>
                <button type="button" className="tool-btn" onClick={() => runCopy('ip', result.ipText)}>
                  {copied === 'ip' ? 'Copied' : 'Copy'}
                </button>
              </span>
              <span className="cidr-meta__item">
                <span className="json-controls__label">CIDR</span>
                <code className="cidr-meta__value">/{result.prefix}</code>
                <button type="button" className="tool-btn" onClick={() => runCopy('cidr', `/${result.prefix}`)}>
                  {copied === 'cidr' ? 'Copied' : 'Copy'}
                </button>
              </span>
              <span className="cidr-meta__item">
                <span className="json-controls__label">Historical IP class</span>
                <code className="cidr-meta__value">Class {result.className}</code>
              </span>
              <span className="cidr-meta__item cidr-meta__item--wide">
                <span className="json-controls__label">Address type</span>
                <span className="cidr-meta__chips">
                  {result.types.map((type) => (
                    <span className="cidr-chip" key={type}>
                      {type}
                    </span>
                  ))}
                </span>
              </span>
            </div>

            <h3 className="cidr-section__title">Network information</h3>
            <ul className="cidr-grid">
              <ResultCard
                label="Network address"
                value={result.networkText}
                copyKey="net"
                copied={copied}
                onCopy={runCopy}
              />
              <ResultCard
                label="Broadcast address"
                value={result.broadcastText}
                copyKey="bcast"
                copied={copied}
                onCopy={runCopy}
              />
              <ResultCard
                label="Subnet mask"
                value={result.maskText}
                copyKey="mask"
                copied={copied}
                onCopy={runCopy}
              />
              <ResultCard
                label="Wildcard mask"
                value={result.wildcardText}
                copyKey="wild"
                copied={copied}
                onCopy={runCopy}
              />
            </ul>

            <h3 className="cidr-section__title">Host information</h3>
            <ul className="cidr-grid">
              <ResultCard
                label="First usable host"
                value={result.firstText}
                copyKey="first"
                copied={copied}
                onCopy={runCopy}
              />
              <ResultCard
                label="Last usable host"
                value={result.lastText}
                copyKey="last"
                copied={copied}
                onCopy={runCopy}
              />
              <ResultCard
                label="Total addresses"
                value={result.totalText}
                copyKey="total"
                copied={copied}
                onCopy={runCopy}
              />
              <ResultCard
                label="Usable host addresses"
                value={result.usableText}
                copyKey="usable"
                copied={copied}
                onCopy={runCopy}
              />
            </ul>

            {result.prefix === 32 && (
              <p className="tool-result__note">
                A /32 holds exactly one address — the IP itself is the only host (no separate
                network/broadcast pair, 1 usable host).
              </p>
            )}
            {result.prefix === 31 && (
              <p className="tool-result__note">
                A /31 is a modern point-to-point link (RFC 3021) — both addresses are usable hosts.
              </p>
            )}

            <details className="cidr-binary">
              <summary>Binary details</summary>
              <div className="cidr-binary__rows">
                <div className="cidr-binary__row">
                  <span className="cidr-binary__label">IP address</span>
                  <code className="cidr-binary__value">{result.binary.ip}</code>
                </div>
                <div className="cidr-binary__row">
                  <span className="cidr-binary__label">Subnet mask</span>
                  <code className="cidr-binary__value">{result.binary.mask}</code>
                </div>
                <div className="cidr-binary__row">
                  <span className="cidr-binary__label">Network</span>
                  <code className="cidr-binary__value">{result.binary.network}</code>
                </div>
                <div className="cidr-binary__row">
                  <span className="cidr-binary__label">Wildcard</span>
                  <code className="cidr-binary__value">{result.binary.wildcard}</code>
                </div>
                <div className="cidr-binary__row">
                  <span className="cidr-binary__label">Broadcast</span>
                  <code className="cidr-binary__value">{result.binary.broadcast}</code>
                </div>
              </div>
            </details>

            <div className="tool-actions">
              <button
                type="button"
                className="tool-btn tool-btn--primary"
                onClick={() => runCopy('summary', copySummary(result))}
              >
                {copied === 'summary' ? 'Copied' : 'Copy Summary'}
              </button>
            </div>
          </>
        )}

        {copyFailed && (
          <p className="tool-result__note">Could not copy automatically — copy the value manually.</p>
        )}
      </div>

      <details className="cidr-help">
        <summary>What is CIDR?</summary>
        <p className="tool-result__note">
          192.168.1.10/24 means the first 24 bits identify the network, leaving 8 bits for host
          addressing inside it. Modern routing uses CIDR prefixes instead of the old Class A/B/C
          system.
        </p>
      </details>

      <details className="cidr-help">
        <summary>CIDR quick reference</summary>
        <div className="cidr-ref">
          <div className="cidr-ref__head">
            <span>Prefix</span>
            <span>Subnet mask</span>
            <span>Total</span>
            <span>Usable</span>
          </div>
          {QUICK_REFERENCE.map((item) => (
            <div className="cidr-ref__row" key={item.prefix}>
              <code>/{item.prefix}</code>
              <code>{item.mask}</code>
              <code>{item.total}</code>
              <code>{item.usable}</code>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}

export default CidrCalculator