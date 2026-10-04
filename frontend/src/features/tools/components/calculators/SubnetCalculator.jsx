import { useEffect, useRef, useState } from 'react'
import {
  copySummaryText,
  copyTableText,
  copyText,
  generateTable,
  parseParent,
  planSubnets,
  validateRequirement,
} from '../../domain/subnet-calculator'

const MODES = [
  { id: 'subnets', label: 'Number of Subnets' },
  { id: 'hosts', label: 'Hosts per Subnet' },
]

function runCompute(parentText, mode, requirement) {
  const parsed = parseParent(parentText)
  const req = validateRequirement(requirement, mode)
  const parentError = parsed.ok ? null : parsed.empty ? null : parsed.error
  const reqError = req.ok ? null : req.empty ? null : req.error

  if (!parsed.ok || !req.ok) {
    if (parsed.empty && req.empty) {
      return { parent: null, parentError, reqError, result: null, table: null, status: { kind: 'idle', message: 'Enter a parent network and a requirement to divide it into equal-sized subnets.' } }
    }
    if (!parsed.empty && !parsed.ok) {
      return { parent: null, parentError, reqError, result: null, table: null, status: { kind: 'invalid', message: parentError } }
    }
    if (req.empty) {
      return { parent: parsed, parentError, reqError, result: null, table: null, status: { kind: 'idle', message: 'Enter how many subnets or usable hosts the parent should be divided into.' } }
    }
    return { parent: parsed, parentError, reqError, result: null, table: null, status: { kind: 'invalid', message: reqError } }
  }

  const plan = planSubnets(parsed.ipValue, parsed.prefix, req.value, mode)
  if (!plan.ok) {
    return { parent: parsed, parentError, reqError, result: null, table: null, status: { kind: 'invalid', message: plan.error } }
  }

  const result = { ...plan, parentText: `${parsed.ipText}/${parsed.prefix}` }
  const table = generateTable(parsed.ipValue, parsed.prefix, plan.newPrefix)
  return {
    parent: parsed,
    parentError,
    reqError,
    result,
    table,
    status: {
      kind: 'valid',
      message: `${parsed.ipText}/${parsed.prefix} → ${plan.generated} × /${plan.newPrefix} subnets (${plan.usable} usable host${plan.usable === 1 ? '' : 's'} each).`,
    },
  }
}

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

function SubnetCalculator() {
  const [parentText, setParentText] = useState('192.168.1.0/24')
  const [mode, setMode] = useState('subnets')
  const [requirement, setRequirement] = useState('4')
  const [data, setData] = useState(() => runCompute('192.168.1.0/24', 'subnets', '4'))
  const [copied, setCopied] = useState('')
  const [copyFailed, setCopyFailed] = useState(false)
  const copyTimer = useRef(null)

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  const refresh = (parent, modeValue, req) => setData(runCompute(parent, modeValue, req))

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

  const { parentError, reqError, result, table, status } = data

  const reqFieldId = mode === 'subnets' ? 'sub-req-subnets' : 'sub-req-hosts'
  const reqLabel = mode === 'subnets' ? 'Required subnets' : 'Required hosts per subnet'
  const reqHint =
    mode === 'subnets'
      ? 'Powers of two give exact counts; otherwise the next power of two is generated.'
      : 'Uses the /31 and /32 host rules from the IP/CIDR calculator.'

  const statusText = status.kind === 'valid' ? 'Valid' : status.kind === 'invalid' ? 'Invalid' : 'Waiting'

  return (
    <div className="tool-panel">
      <h2 className="tool-panel__title">Subnet Calculator</h2>

      <p className="tool-note">Divide a parent network into equal-sized subnets — entirely in your browser.</p>

      <div className="tool-field">
        <span className="json-controls__label">Subnetting mode</span>
        <div className="tool-modes" role="group" aria-label="Subnetting mode">
          {MODES.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`tool-mode${mode === option.id ? ' tool-mode--active' : ''}`}
              aria-pressed={mode === option.id}
              onClick={() => {
                setMode(option.id)
                refresh(parentText, option.id, requirement)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sub-fields">
        <div className="tool-field">
          <div className="json-input-head">
            <label className="tool-field__label" htmlFor="sub-parent">
              Parent network / CIDR
            </label>
          </div>
          <span className="tool-field__control">
            <input
              id="sub-parent"
              className="cidr-input"
              type="text"
              spellCheck={false}
              value={parentText}
              placeholder="192.168.1.0/24"
              aria-invalid={parentError != null || status.kind === 'invalid'}
              aria-describedby={parentError ? 'sub-parent-error' : undefined}
              onChange={(event) => {
                setParentText(event.target.value)
                refresh(event.target.value, mode, requirement)
              }}
            />
          </span>
          <span className="tool-field__hint">A host address is normalised to its network, e.g. 192.168.1.10/24 → 192.168.1.0/24.</span>
          {parentError && (
            <p className="cidr-error" id="sub-parent-error" role="alert">
              ✕ {parentError}
            </p>
          )}
        </div>

        <div className="tool-field">
          <label className="tool-field__label" htmlFor={reqFieldId}>
            {reqLabel}
          </label>
          <span className="tool-field__control">
            <input
              id={reqFieldId}
              className="cidr-input"
              type="text"
              inputMode="numeric"
              spellCheck={false}
              value={requirement}
              placeholder={mode === 'subnets' ? '4' : '50'}
              aria-invalid={reqError != null || (!data.parentError && status.kind === 'invalid')}
              aria-describedby={reqError ? 'sub-req-error' : undefined}
              onChange={(event) => {
                setRequirement(event.target.value)
                refresh(parentText, mode, event.target.value)
              }}
            />
          </span>
          <span className="tool-field__hint">{reqHint}</span>
          {reqError && (
            <p className="cidr-error" id="sub-req-error" role="alert">
              ✕ {reqError}
            </p>
          )}
        </div>
      </div>

      <div className="tool-actions">
        <button type="button" className="tool-btn tool-btn--primary" onClick={() => refresh(parentText, mode, requirement)}>
          Calculate
        </button>
        <button
          type="button"
          className="tool-btn"
          onClick={() => {
            setParentText('')
            setRequirement('')
            setCopied('')
            setCopyFailed(false)
            setData(runCompute('', mode, ''))
          }}
        >
          Clear
        </button>
        <button
          type="button"
          className="tool-btn"
          onClick={() => {
            setParentText('192.168.1.0/24')
            setMode('subnets')
            setRequirement('4')
            setCopied('')
            setCopyFailed(false)
            setData(runCompute('192.168.1.0/24', 'subnets', '4'))
          }}
        >
          Reset Example
        </button>
      </div>

      <div className="codec-output cidr-results">
        <div className="codec-output__head">
          <span className={`codec-status codec-status--${status.kind}`} role="status" aria-live="polite">
            {status.kind === 'valid' ? '✓' : status.kind === 'invalid' ? '✕' : ''}
            {status.kind === 'valid' || status.kind === 'invalid' ? `Subnet — ${statusText}` : 'Subnet — Waiting'}
          </span>
        </div>
        {status.message && <p className="tool-result__note">{status.message}</p>}
        {data.parent && data.parent.normalized && (
          <p className="tool-result__note">
            Parent 192.168.1.10/24 style host address normalised to its network {data.parent.ipText}/{data.parent.prefix}.
          </p>
        )}
        {copyFailed && <p className="tool-result__note">Could not copy automatically — copy the value manually.</p>}

        {result && (
          <>
            {result.mode === 'subnets' && result.requested !== result.generated && (
              <p className="sub-requested">
                Requested: <strong>{result.requested}</strong> → generated: <strong>{result.generated}</strong> equal-sized subnets.
              </p>
            )}

            <h3 className="cidr-section__title">Subnet summary</h3>
            <ul className="cidr-grid">
              <ResultCard label="Parent network" value={result.parentText} copyKey="parent" copied={copied} onCopy={runCopy} />
              <ResultCard label="Original prefix" value={`/${result.parentPrefix}`} copyKey="orig" copied={copied} onCopy={runCopy} />
              <ResultCard label="New prefix" value={`/${result.newPrefix}`} copyKey="new" copied={copied} onCopy={runCopy} />
              <ResultCard label="Subnet mask" value={result.maskText} copyKey="mask" copied={copied} onCopy={runCopy} />
              <ResultCard label="Wildcard mask" value={result.wildcardText} copyKey="wild" copied={copied} onCopy={runCopy} />
              <ResultCard label="Subnets" value={String(result.generated)} copyKey="subnets" copied={copied} onCopy={runCopy} />
              <ResultCard label="Addresses per subnet" value={String(result.addressesPerSubnet)} copyKey="total" copied={copied} onCopy={runCopy} />
              <ResultCard label="Usable hosts per subnet" value={String(result.usable)} copyKey="usable" copied={copied} onCopy={runCopy} />
              <ResultCard label="Block size / increment" value={String(result.addressesPerSubnet)} copyKey="block" copied={copied} onCopy={runCopy} />
            </ul>

            {(result.newPrefix === 31 || result.newPrefix === 32) && (
              <p className="tool-result__note">
                {result.newPrefix === 32
                  ? 'A /32 subnet holds exactly one address — the IP itself is the only host (1 usable host, no separate network/broadcast pair).'
                  : 'A /31 subnet is a modern point-to-point link (RFC 3021) — both addresses are usable hosts.'}
              </p>
            )}

            <h3 className="cidr-section__title">How this was calculated</h3>
            <ul className="sub-explain">
              <li>{result.explanation.opening}</li>
              <li>{result.explanation.hostBits}</li>
              <li>{result.explanation.addresses}</li>
              <li>{result.explanation.usableHosts}</li>
            </ul>
            <p className="tool-result__note">Equal-size subnetting only — every subnet uses the same /{result.newPrefix} prefix (VLSM is not applied).</p>

            <h3 className="cidr-section__title">
              Subnet table <span className="sub-table-count">({table.total} {table.total === 1 ? 'subnet' : 'subnets'})</span>
            </h3>
            <div className="sub-table-wrap">
              <table className="sub-table">
                <thead>
                  <tr>
                    <th scope="col">Subnet</th>
                    <th scope="col">Network</th>
                    <th scope="col">First Host</th>
                    <th scope="col">Last Host</th>
                    <th scope="col">Broadcast</th>
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row) => (
                    <tr key={row.network}>
                      <td>{row.index}</td>
                      <td>{row.network}</td>
                      <td>{row.first}</td>
                      <td>{row.last}</td>
                      <td>{row.broadcast}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {table.truncated && (
              <p className="tool-result__note">
                Showing first {table.rows.length} of {table.total} subnets to keep the page responsive.
              </p>
            )}

            <div className="tool-actions">
              <button
                type="button"
                className="tool-btn tool-btn--primary"
                onClick={() => runCopy('summary', copySummaryText(result.parentText, result))}
              >
                {copied === 'summary' ? 'Copied' : 'Copy Summary'}
              </button>
              <button
                type="button"
                className="tool-btn"
                onClick={() => runCopy('table', copyTableText(table))}
              >
                {copied === 'table' ? 'Copied' : 'Copy Subnet Table'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SubnetCalculator