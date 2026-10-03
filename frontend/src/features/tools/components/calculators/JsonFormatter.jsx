import { useEffect, useRef, useState } from 'react'
import {
  analyzeJson,
  copyText,
  formatJson,
  minifyJson,
  SAMPLE_JSON,
} from '../../domain/json'

const INDENTS = [
  { value: 2, label: '2 spaces' },
  { value: 4, label: '4 spaces' },
]

function JsonFormatter() {
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState(2)
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState({ kind: 'idle' })
  const [copyState, setCopyState] = useState('idle')
  const copyTimer = useRef(null)

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  const setInputValue = (next) => {
    setInput(next)
    setOutput('')
    setStatus({ kind: 'idle' })
    setCopyState('idle')
  }

  const changeIndent = (value) => {
    setIndent(value)
    if (output !== '') {
      const res = formatJson(input, value)
      if (res.ok) {
        setOutput(res.output)
        setStatus({
          kind: 'valid',
          message: `Valid JSON — pretty-printed with ${value}-space indentation.`,
        })
      }
    }
  }

  const runFormat = () => {
    const res = formatJson(input, indent)
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
      message: `Valid JSON — pretty-printed with ${indent}-space indentation.`,
    })
  }

  const runMinify = () => {
    const res = minifyJson(input)
    if (!res.ok) {
      setOutput('')
      setCopyState('idle')
      setStatus({ kind: 'invalid', error: res.error })
      return
    }
    setOutput(res.output)
    setCopyState('idle')
    setStatus({ kind: 'valid', message: `Valid JSON — minified to ${res.output.length} characters.` })
  }

  const runValidate = () => {
    const res = analyzeJson(input)
    setOutput('')
    setCopyState('idle')
    if (res.empty) setStatus({ kind: 'idle', message: 'Enter some JSON to validate it.' })
    else if (res.ok) setStatus({ kind: 'valid', message: 'Valid JSON.' })
    else setStatus({ kind: 'invalid', error: res.error })
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

  const loadSample = () => setInputValue(SAMPLE_JSON)

  const statusText =
    status.kind === 'valid' ? 'Valid JSON' : status.kind === 'invalid' ? 'Invalid JSON' : 'Waiting'
  const outputPlaceholder =
    'Formatted or minified JSON appears here.'

  return (
    <div className="tool-panel">
      <h2 className="tool-panel__title">Format, minify and validate JSON</h2>

      <p className="tool-note">
        All of this runs in your browser — the JSON never leaves this page.
      </p>

      <div className="json-controls">
        <div className="json-indent" role="group" aria-label="Indentation">
          <span className="json-controls__label" id="json-indent-label">
            Indentation
          </span>
          <div className="tool-modes" role="group" aria-labelledby="json-indent-label">
            {INDENTS.map((item) => (
              <button
                type="button"
                key={item.value}
                className={`tool-mode${indent === item.value ? ' tool-mode--active' : ''}`}
                aria-pressed={indent === item.value}
                onClick={() => changeIndent(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="tool-actions">
          <button type="button" className="tool-btn tool-btn--primary" onClick={runFormat}>
            Format
          </button>
          <button type="button" className="tool-btn" onClick={runMinify}>
            Minify
          </button>
          <button type="button" className="tool-btn" onClick={runValidate}>
            Validate
          </button>
        </div>
      </div>

      <div className="json-grid">
        <div className="tool-field">
          <div className="json-input-head">
            <label className="tool-field__label" htmlFor="json-input">
              JSON input
            </label>
            <div className="json-input-tools">
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
              id="json-input"
              className="tool-textarea tool-textarea--json"
              value={input}
              spellCheck={false}
              placeholder='{"name": "Alex", "skills": ["C++", "Python"]}'
              onChange={(event) => setInputValue(event.target.value)}
            />
          </span>
          <span className="tool-field__hint">Paste raw or minified JSON, or load a sample.</span>
        </div>

        <div className="json-output" aria-label="Formatted output">
          <div className="json-output__head">
            <span className={`json-status json-status--${status.kind}`} role="status" aria-live="polite">
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
            className="json-output__text"
            readOnly
            value={output}
            spellCheck={false}
            aria-label="Formatted JSON output"
            placeholder={outputPlaceholder}
          />
          {status.kind === 'valid' && status.message && (
            <p className="tool-result__note">{status.message}</p>
          )}
          {status.kind === 'idle' && status.message && (
            <p className="tool-result__note">{status.message}</p>
          )}
          {status.kind === 'invalid' && status.error && (
            <pre className="json-error">
              {status.error.message}
              {status.error.line != null && (
                <span>
                  {'\n'}Approximate location — line {status.error.line}, column {status.error.column}
                  {status.error.position != null && ` (offset ${status.error.position})`}.
                </span>
              )}
              {status.error.snippet && (
                <span>
                  {'\n'}
                  {status.error.snippet.line}
                  {'\n'}
                  {status.error.snippet.caret}
                </span>
              )}
            </pre>
          )}
          {copyState === 'failed' && (
            <p className="tool-result__note">Could not copy automatically — select the text and copy manually.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default JsonFormatter