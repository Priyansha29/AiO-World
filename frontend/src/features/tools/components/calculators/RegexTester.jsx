import { useMemo, useRef, useState } from 'react'
import {
  copyResultsText,
  copyText,
  DEFAULT_FLAGS,
  FLAGS,
  testRegex,
} from '../../domain/regex-tester'

const DEFAULT_PATTERN = '\\b[A-Z][a-z]+\\b'
const DEFAULT_TEXT = 'Hello World.\nHello AiO World.\nThis is a Regex Tester example.'

const EXAMPLES = [
  {
    key: 'email',
    label: 'Email',
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    text: 'test@example.com',
  },
  {
    key: 'phone',
    label: 'Phone',
    pattern: '^\\+?[0-9\\s-]{7,15}$',
    text: '+91 98765 43210',
  },
  {
    key: 'numbers',
    label: 'Numbers',
    pattern: '\\d+',
    text: 'There are 12 apples and 25 oranges.',
  },
  {
    key: 'words',
    label: 'Words',
    pattern: '\\b\\w+\\b',
    text: 'Hello World.',
  },
]

function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [text, setText] = useState('')
  const [flags, setFlags] = useState(() => {
    const state = { g: false, i: false, m: false, s: false, u: false }
    DEFAULT_FLAGS.forEach((key) => {
      state[key] = true
    })
    return state
  })
  const [copied, setCopied] = useState({ pattern: false, results: false, failed: false })
  const copyTimer = useRef(null)

  const flagString = FLAGS.filter((flag) => flags[flag.key])
    .map((flag) => flag.key)
    .join('')

  const result = useMemo(
    () => testRegex(pattern, flagString.split(''), text),
    [pattern, flagString, text],
  )

  const toggleFlag = (key) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const applyExample = (example) => {
    setPattern(example.pattern)
    setText(example.text)
  }

  const clearAll = () => {
    setPattern('')
    setText('')
  }

  const resetExample = () => {
    setPattern(DEFAULT_PATTERN)
    setText(DEFAULT_TEXT)
  }

  const runCopy = async (what, content) => {
    const ok = await copyText(content)
    clearTimeout(copyTimer.current)
    if (ok) {
      setCopied({ pattern: false, results: false, failed: false, [what]: true })
      copyTimer.current = setTimeout(
        () => setCopied((prev) => ({ ...prev, [what]: false })),
        1500,
      )
    } else {
      setCopied((prev) => ({ ...prev, failed: true }))
    }
  }

  const statusKind = result.empty ? 'idle' : result.valid ? 'valid' : 'invalid'
  const statusText = result.empty ? 'Waiting' : result.valid ? 'Valid' : 'Invalid'

  const countText =
    result.empty
      ? 'Enter a pattern to get started.'
      : result.valid
        ? `${result.count} ${result.count === 1 ? 'match' : 'matches'} - ${
            result.global ? 'global (g)' : 'non-global (g off - only the first match)'
          }`
        : 'Invalid pattern - no matches can be found.'

  const segments = []
  if (result.valid) {
    let cursor = 0
    result.matches.forEach((match) => {
      if (match.index > cursor) {
        segments.push({ text: text.slice(cursor, match.index), match: false })
      }
      segments.push({ text: text.slice(match.index, match.index + match.length), match: true, empty: match.length === 0 })
      cursor = match.index + match.length
    })
    if (cursor < text.length) {
      segments.push({ text: text.slice(cursor), match: false })
    }
  }

  return (
    <div className="tool-panel">
      <h2 className="tool-panel__title">Regex tester</h2>

      <p className="tool-note">
        Runs entirely in your browser - the pattern and test text never leave this page.
      </p>

      <div className="rex-examples">
        <span className="json-controls__label" id="rex-examples-label">
          Examples
        </span>
        <div className="rex-examples__buttons">
          {EXAMPLES.map((example) => (
            <button
              type="button"
              key={example.key}
              className="tool-btn"
              aria-label={`Load ${example.label} example`}
              onClick={() => applyExample(example)}
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-field">
        <label className="tool-field__label" htmlFor="rex-pattern">
          Regex pattern
        </label>
        <span className="tool-field__control">
          <input
            id="rex-pattern"
            className="rex-pattern__input"
            type="text"
            value={pattern}
            spellCheck={false}
            autoComplete="off"
            placeholder={'\\b[A-Z][a-z]+\\b'}
            aria-describedby="rex-pattern-hint"
            onChange={(event) => setPattern(event.target.value)}
          />
        </span>
        <span className="tool-field__hint" id="rex-pattern-hint">
          A JavaScript regular expression - set the i/m/s/u options below, not inside the pattern.
        </span>
      </div>

      <div className="rex-flags" role="group" aria-label="Regex flags">
        <span className="json-controls__label" id="rex-flags-label">
          Flags
        </span>
        <div className="tool-modes" role="group" aria-labelledby="rex-flags-label">
          {FLAGS.map((flag) => (
            <button
              type="button"
              key={flag.key}
              className={`tool-mode${flags[flag.key] ? ' tool-mode--active' : ''}`}
              aria-pressed={flags[flag.key]}
              title={flag.title}
              aria-label={`${flag.title} flag (${flag.key})`}
              onClick={() => toggleFlag(flag.key)}
            >
              {flag.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-field">
        <div className="codec-input-head">
          <label className="tool-field__label" htmlFor="rex-text">
            Test text
          </label>
          <div className="codec-input-tools">
            <button type="button" className="tool-btn" onClick={clearAll}>
              Clear
            </button>
            <button type="button" className="tool-btn" onClick={resetExample}>
              Reset Example
            </button>
          </div>
        </div>
        <span className="tool-field__control">
          <textarea
            id="rex-text"
            className="tool-textarea rex-text__input"
            value={text}
            spellCheck={false}
            placeholder={'Hello World.\nHello AiO World.\nThis is a Regex Tester example.'}
            onChange={(event) => setText(event.target.value)}
          />
        </span>
      </div>

      <div className="rex-results">
        <div className="rex-results__head">
          <span className={`codec-status codec-status--${statusKind}`} role="status" aria-live="polite">
            {statusKind === 'valid' ? '✓' : statusKind === 'invalid' ? '✕' : ''}
            {statusText}
          </span>
          <div className="tool-actions">
            <button
              type="button"
              className="tool-btn"
              disabled={pattern === ''}
              onClick={() => runCopy('pattern', pattern)}
            >
              {copied.pattern ? 'Copied' : 'Copy pattern'}
            </button>
            <button
              type="button"
              className="tool-btn"
              disabled={!result.valid || result.count === 0}
              onClick={() => runCopy('results', copyResultsText(result))}
            >
              {copied.results ? 'Copied' : 'Copy results'}
            </button>
          </div>
        </div>

        <p className="rex-count" role="status">
          {countText}
        </p>

        {result.valid && (
          <div className="rex-hitbox">
            <span className="json-controls__label">Highlighted matches</span>
            <pre className="rex-hitbox__pre">
              {text === ''
                ? ''
                : segments.map((segment, i) =>
                    segment.match ? (
                      <mark
                        key={i}
                        className={`rex-hit${segment.empty ? ' rex-hit--empty' : ''}`}
                        aria-label={`Match ${segment.text === '' ? 'at this position' : JSON.stringify(segment.text)}`}
                      >
                        {segment.text}
                      </mark>
                    ) : (
                      <span key={i}>{segment.text}</span>
                    ),
                  )}
            </pre>
          </div>
        )}

        {result.valid && result.count > 0 && (
          <ol className="rex-matches">
            {result.matches.map((match, i) => (
              <li key={`${match.index}-${i}`} className="rex-match">
                <span className="rex-match__line">
                  <span className="rex-match__value">{JSON.stringify(match.value)}</span>
                  <span className="rex-match__meta">
                    index {match.index}
                    {match.length > 0 ? ` - length ${match.length}` : ''}
                  </span>
                </span>
                {match.groups && (
                  <span className="rex-match__groups">
                    groups - {match.groups.map((group, gi) => (
                      <span key={gi}>
                        ({gi + 1}) {group === null ? 'undefined' : JSON.stringify(group)}
                      </span>
                    ))}
                  </span>
                )}
                {match.named && (
                  <span className="rex-match__groups">
                    named - {Object.entries(match.named).map(([key, value]) => (
                      <span key={key}>
                        {key}={value === null ? 'undefined' : JSON.stringify(value)}
                      </span>
                    ))}
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}

        {result.valid && result.count === 0 && text !== '' && (
          <p className="tool-result__note">No matches found in the test text.</p>
        )}

        {result.truncated && (
          <p className="tool-result__note">Stopped after 5,000 matches to keep the page responsive.</p>
        )}

        {!result.valid && result.error && <pre className="codec-error">{result.error}</pre>}

        {copied.failed && (
          <p className="tool-result__note">
            Could not copy automatically - select the text and copy manually.
          </p>
        )}
      </div>
    </div>
  )
}

export default RegexTester