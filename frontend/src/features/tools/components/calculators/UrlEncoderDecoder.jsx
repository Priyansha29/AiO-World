import { useEffect, useRef, useState } from 'react'
import {
  copyText,
  decodeUrlComponent,
  encodeUrlComponent,
  SAMPLE_TEXT,
} from '../../domain/url-codec'

const MODES = [
  { key: 'encode', label: 'Encode' },
  { key: 'decode', label: 'Decode' },
]

function UrlEncoderDecoder() {
  const [mode, setMode] = useState('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState({ kind: 'idle' })
  const [copyState, setCopyState] = useState('idle')
  const copyTimer = useRef(null)

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  const encoding = mode === 'encode'

  const setInputValue = (next) => {
    setInput(next)
    setOutput('')
    setStatus({ kind: 'idle' })
    setCopyState('idle')
  }

  const selectMode = (nextMode) => {
    if (nextMode === mode) return
    setMode(nextMode)
    setOutput('')
    setStatus({ kind: 'idle' })
    setCopyState('idle')
  }

  const runOp = () => {
    if (input.trim() === '') {
      setOutput('')
      setCopyState('idle')
      setStatus({
        kind: 'idle',
        message: encoding ? 'Enter some text to encode.' : 'Enter some percent-encoded text to decode.',
      })
      return
    }
    const res = encoding ? encodeUrlComponent(input) : decodeUrlComponent(input)
    if (!res.ok) {
      setOutput('')
      setCopyState('idle')
      setStatus({ kind: 'invalid', error: res.error })
      return
    }
    setOutput(res.output)
    setCopyState('idle')
    setStatus({
      kind: 'valid',
      message: encoding
        ? `Encoded ${input.length} characters as a URL component.`
        : `Decoded ${res.output.length} characters.`,
    })
  }

  const swap = () => {
    if (output === '') return
    setInput(output)
    setOutput(input)
    setMode(encoding ? 'decode' : 'encode')
    setStatus({ kind: 'idle' })
    setCopyState('idle')
  }

  const runCopy = async () => {
    const ok = await copyText(output)
    if (ok) {
      setCopyState('copied')
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopyState('idle'), 1500)
    } else {
      setCopyState('failed')
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setStatus({ kind: 'idle' })
    setCopyState('idle')
  }

  const loadSample = () => {
    const sample = encoding ? SAMPLE_TEXT : encodeUrlComponent(SAMPLE_TEXT).output
    setInputValue(sample)
  }

  const statusText =
    status.kind === 'valid' ? 'Done' : status.kind === 'invalid' ? 'Error' : 'Waiting'

  return (
    <div className="tool-panel">
      <h2 className="tool-panel__title">Encode and decode URLs</h2>

      <p className="tool-note">All of this runs in your browser - nothing is uploaded.</p>

      <div className="codec-controls">
        <div className="tool-modes" role="group" aria-label="Operation">
          {MODES.map((item) => (
            <button
              type="button"
              key={item.key}
              className={`tool-mode${mode === item.key ? ' tool-mode--active' : ''}`}
              aria-pressed={mode === item.key}
              onClick={() => selectMode(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="tool-actions">
          <button type="button" className="tool-btn tool-btn--primary" onClick={runOp}>
            {encoding ? 'Encode' : 'Decode'}
          </button>
          <button type="button" className="tool-btn" onClick={swap} disabled={output === ''}>
            Swap
          </button>
        </div>
      </div>

      <div className="url-help" role="note">
        <span>
          Encode one value at a time - a URL component or a query-string value, not the whole
          address. So{' '}
        </span>
        <span className="url-help__eg">q=hello world</span>
        <span> becomes </span>
        <span className="url-help__eg">q=hello%20world</span>
        <span>, and </span>
        <span className="url-help__eg">hello world &amp; ai</span>
        <span> becomes </span>
        <span className="url-help__eg">hello%20world%20%26%20ai</span>
        <span>. Spaces become %20, &amp; becomes %26.</span>
      </div>

      <div className="codec-grid">
        <div className="tool-field">
          <div className="codec-input-head">
            <label className="tool-field__label" htmlFor="url-input">
              {encoding ? 'Text to encode' : 'Text to decode'}
            </label>
            <div className="codec-input-tools">
              <button type="button" className="tool-btn" onClick={loadSample}>
                Load sample
              </button>
              <button type="button" className="tool-btn" onClick={clearAll}>
                Clear
              </button>
            </div>
          </div>
          <span className="tool-field__control">
            <textarea
              id="url-input"
              className="tool-textarea codec-input"
              value={input}
              spellCheck={false}
              placeholder={
                encoding
                  ? 'e.g. hello world & ai'
                  : 'e.g. hello%20world%20%26%20ai'
              }
              onChange={(event) => setInputValue(event.target.value)}
            />
          </span>
          <span className="tool-field__hint">
            {encoding
              ? 'Percent-encodes a component or query value exactly - spaces, &, =, # and others become %xx, and newlines are kept.'
              : 'Decodes percent-encoded text. Malformed sequences such as hello%2 are reported instead of guessed.'}
          </span>
        </div>

        <div className="codec-output" aria-label={encoding ? 'Encoded output' : 'Decoded output'}>
          <div className="codec-output__head">
            <span
              className={`codec-status codec-status--${status.kind}`}
              role="status"
              aria-live="polite"
            >
              {status.kind === 'valid' ? '✓' : status.kind === 'invalid' ? '✕' : ''}
              {statusText}
            </span>
            <button
              type="button"
              className="tool-btn"
              onClick={runCopy}
              disabled={output === ''}
            >
              {copyState === 'copied' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            className="codec-output__text"
            readOnly
            value={output}
            spellCheck={false}
            aria-label={encoding ? 'Encoded output' : 'Decoded output'}
            placeholder="Encoded or decoded text appears here."
          />
          {status.kind !== 'invalid' && status.message && (
            <p className="tool-result__note">{status.message}</p>
          )}
          {status.kind === 'invalid' && status.error && <pre className="codec-error">{status.error}</pre>}
          {copyState === 'failed' && (
            <p className="tool-result__note">
              Could not copy automatically - select the text and copy manually.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default UrlEncoderDecoder