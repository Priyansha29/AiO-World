import { useEffect, useRef, useState } from 'react'
import {
  copyText,
  DEFAULT_COLOR,
  parseColor,
  toHex,
  toHex8,
  toHsl,
  toHsla,
  toPicker,
  toRgb,
  toRgba,
} from '../../domain/color-converter'

const OUTPUTS = [
  { key: 'hex', label: 'HEX', value: (color) => toHex(color) },
  { key: 'rgb', label: 'RGB', value: (color) => toRgb(color) },
  { key: 'rgba', label: 'RGBA', value: (color) => toRgba(color) },
  { key: 'hsl', label: 'HSL', value: (color) => toHsl(color) },
  { key: 'hsla', label: 'HSLA', value: (color) => toHsla(color) },
]

const READY_IDLE = { kind: 'idle', message: 'Enter a color to convert.' }

function ColorConverter() {
  const [input, setInput] = useState('')
  const [color, setColor] = useState(null)
  const [status, setStatus] = useState(READY_IDLE)
  const [copied, setCopied] = useState({})
  const copyTimer = useRef(null)

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  const commitColor = (nextColor, nextInput) => {
    setColor(nextColor)
    setInput(nextInput)
    setStatus({ kind: 'valid', message: `Converted to ${OUTPUTS.length} formats.` })
    setCopied({})
  }

  const handleTextChange = (value) => {
    setInput(value)
    setCopied({})
    const res = parseColor(value)
    if (res.ok) {
      setColor(res.color)
      setStatus({ kind: 'valid', message: `Converted to ${OUTPUTS.length} formats.` })
    } else if (res.empty) {
      setColor(null)
      setStatus(READY_IDLE)
    } else {
      setStatus({ kind: 'invalid', message: 'Invalid color' })
    }
  }

  const handlePicker = (value) => {
    const res = parseColor(value)
    if (res.ok) commitColor({ ...res.color, a: 1 }, value)
  }

  const clearAll = () => {
    setInput('')
    setColor(null)
    setStatus(READY_IDLE)
    setCopied({})
  }

  const resetAll = () => {
    commitColor(DEFAULT_COLOR, toHex(DEFAULT_COLOR))
  }

  const runCopy = async (key, value) => {
    const ok = await copyText(value)
    if (ok) {
      setCopied((prev) => ({ ...prev, [key]: true }))
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied({}), 1500)
    } else {
      setCopied({ failed: true })
    }
  }

  const hasColor = color != null
  const statusText =
    status.kind === 'valid' ? 'Valid color' : status.kind === 'invalid' ? 'Invalid color' : 'Waiting'
  const pickerValue = hasColor ? toPicker(color) : toHex(DEFAULT_COLOR)
  const previewAlpha = hasColor ? Math.round(color.a * 1000) / 1000 : 1

  return (
    <div className="tool-panel">
      <h2 className="tool-panel__title">Color converter</h2>

      <p className="tool-note">
        All of this runs in your browser — colors never leave this page.
      </p>

      <div className="clr-pick">
        <div className="codec-input-head">
          <label className="tool-field__label" htmlFor="clr-picker">
            Choose a color
          </label>
          <span className="clr-pick__swatch">
            <input
              type="color"
              id="clr-picker"
              className="clr-picker"
              value={pickerValue}
              aria-label="Choose a color"
              onChange={(event) => handlePicker(event.target.value)}
            />
          </span>
        </div>
      </div>

      <div className="tool-field">
        <div className="codec-input-head">
          <label className="tool-field__label" htmlFor="clr-input">
            Color value
          </label>
          <div className="codec-input-tools">
            <button type="button" className="tool-btn" onClick={clearAll}>
              Clear
            </button>
            <button type="button" className="tool-btn" onClick={resetAll}>
              Reset
            </button>
          </div>
        </div>
        <span className="tool-field__control">
          <input
            id="clr-input"
            className="clr-input"
            type="text"
            value={input}
            spellCheck={false}
            placeholder="#3498db or hsl(204, 70%, 53%)"
            aria-invalid={status.kind === 'invalid'}
            onChange={(event) => handleTextChange(event.target.value)}
          />
        </span>
        <span className="tool-field__hint">HEX, RGB(A) and HSL(A) are all accepted.</span>
      </div>

      <div
        className="clr-preview"
        style={{ backgroundColor: hasColor ? `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${previewAlpha})` : 'var(--surface)' }}
      >
        <span className="clr-preview__label" aria-hidden="true">
          {hasColor ? color.a < 1 ? toHex8(color) : toHex(color) : '—'}
        </span>
      </div>

      <div className="codec-output">
        <div className="codec-output__head">
          <span className={`codec-status codec-status--${status.kind}`} role="status" aria-live="polite">
            {status.kind === 'valid' ? '✓' : status.kind === 'invalid' ? '✕' : ''}
            {statusText}
          </span>
        </div>
        {status.message && <p className="tool-result__note">{status.message}</p>}

        <ul className="clr-cards">
          {OUTPUTS.map((card) => {
            const value = hasColor ? card.value(color) : '—'
            return (
              <li className="clr-card" key={card.key}>
                <div className="clr-card__head">
                  <span className="json-controls__label">{card.label}</span>
                  <button
                    type="button"
                    className="tool-btn"
                    disabled={!hasColor}
                    onClick={() => runCopy(card.key, value)}
                  >
                    {copied[card.key] ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <code className="clr-card__value">{value}</code>
                {card.key === 'hex' && hasColor && color.a < 1 && (
                  <span className="clr-card__hint">{toHex8(color)} with alpha</span>
                )}
              </li>
            )
          })}
        </ul>

        {copied.failed && (
          <p className="tool-result__note">Could not copy automatically — copy the value manually.</p>
        )}
      </div>
    </div>
  )
}

export default ColorConverter