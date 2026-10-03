import { useEffect, useRef, useState } from 'react'
import {
  copyText,
  decodeFromBase64,
  encodeToBase64,
  SAMPLE_TEXT,
} from '../../domain/base64'

const MODES = [
  { key: 'encode', label: 'Encode' },
  { key: 'decode', label: 'Decode' },
]

function Base64EncoderDecoder() {
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
        message: encoding ? 'Enter some text to encode.' : 'Enter some Base64 to decode.',
      })
      return
    }
    const res = encoding ? encodeToBase64(input) : decodeFromBase64(input)
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
        ? `Encoded ${input.length} characters as UTF-8 Base64.`
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
    const sample = encoding ? SAMPLE_TEXT : encodeToBase64(SAMPLE_TEXT).output
    setInputValue(sample)
  }

  const statusText =
    status.kind === 'valid' ? 'Done' : status.kind === 'invalid' ? 'Error' : 'Waiting'

  return (
    <div className="tool-panel">
      <h2 className="tool-panel__title">Encode and decode Base64</h2>

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

      <div className="codec-grid">
        <div className="tool-field">
          <div className="codec-input-head">
            <label className="tool-field__label" htmlFor="codec-input">
              {encoding ? 'Text to encode' : 'Base64 to decode'}
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
              id="codec-input"
              className="tool-textarea codec-input"
              value={input}
              spellCheck={false}
              placeholder={
                encoding
                  ? 'e.g. Hello AiO World!  Type or paste text here.'
                  : 'e.g. SGVsbG8gV29ybGQh'
              }
              onChange={(event) => setInputValue(event.target.value)}
            />
          </span>
          <span className="tool-field__hint">
            {encoding
              ? 'Input is encoded exactly as typed - newlines and spaces are kept, and Unicode is supported.'
              : 'Whitespace inside the Base64 is ignored when decoding.'}
          </span>
        </div>

        <div className="codec-output" aria-label={encoding ? 'Base64 output' : 'Decoded text output'}>
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
            aria-label={encoding ? 'Base64 output' : 'Decoded text output'}
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

export default Base64EncoderDecoder