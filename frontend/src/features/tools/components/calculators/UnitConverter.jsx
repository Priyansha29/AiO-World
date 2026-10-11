import { useEffect, useRef, useState } from 'react'
import { copyText } from '../../domain/cidr-ipv4'
import { CATEGORIES, categoryByKey, convertText, parseInput } from '../../domain/unit-converter'

function buildView(categoryKey, value, fromId, toId) {
  const parsed = parseInput(value)
  if (parsed.empty) {
    return { status: { kind: 'idle', message: 'Enter a value to convert.' }, result: null }
  }
  if (!parsed.ok) {
    return { status: { kind: 'invalid', message: parsed.error }, result: null }
  }
  const converted = convertText(categoryKey, fromId, toId, value)
  if (!converted.ok) {
    return { status: { kind: 'invalid', message: converted.error }, result: null }
  }
  const message = converted.same
    ? 'Source and destination units are the same — the result equals the input.'
    : `${converted.from.name} (${converted.from.symbol}) → ${converted.to.name} (${converted.to.symbol})`
  return { status: { kind: 'valid', message }, result: converted }
}

function UnitConverter() {
  const initial = CATEGORIES[0]
  const [category, setCategory] = useState(initial.key)
  const [value, setValue] = useState(initial.defaultValue)
  const [fromId, setFromId] = useState(initial.defaultFrom)
  const [toId, setToId] = useState(initial.defaultTo)
  const [data, setData] = useState(() =>
    buildView(initial.key, initial.defaultValue, initial.defaultFrom, initial.defaultTo),
  )
  const [copied, setCopied] = useState('')
  const [copyFailed, setCopyFailed] = useState(false)
  const copyTimer = useRef(null)

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  const refresh = (categoryKey, valueText, from, to) => setData(buildView(categoryKey, valueText, from, to))

  const runCopy = async (key, text) => {
    const ok = await copyText(text)
    if (ok) {
      setCopied(key)
      setCopyFailed(false)
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(''), 1500)
    } else {
      setCopyFailed(true)
    }
  }

  const activeUnits = categoryByKey(category)?.units ?? []
  const activeCategory = categoryByKey(category)
  const parsed = parseInput(value)
  const valueError = value.trim() ? (parsed.ok ? null : parsed.error) : null
  const { status, result } = data

  const statusText = status.kind === 'valid' ? 'Valid' : status.kind === 'invalid' ? 'Invalid' : 'Waiting'

  const changeCategory = (key) => {
    const cat = categoryByKey(key)
    setCategory(key)
    setFromId(cat.defaultFrom)
    setToId(cat.defaultTo)
    setCopied('')
    setCopyFailed(false)
    refresh(key, value, cat.defaultFrom, cat.defaultTo)
  }

  return (
    <div className="tool-panel">
      <h2 className="tool-panel__title">Unit Converter</h2>

      <p className="tool-note">Convert length, mass, temperature and more — exact factors, right in your browser.</p>

      <div className="uconv-fields">
        <div className="tool-field uconv-full">
          <label className="tool-field__label" htmlFor="uconv-category">
            Category
          </label>
          <span className="tool-field__control">
            <select id="uconv-category" className="cidr-prefix" value={category} onChange={(event) => changeCategory(event.target.value)}>
              {CATEGORIES.map((entry) => (
                <option key={entry.key} value={entry.key}>
                  {entry.label}
                </option>
              ))}
            </select>
          </span>
          {activeCategory?.note && <span className="tool-field__hint">{activeCategory.note}</span>}
        </div>

        <div className="tool-field uconv-full">
          <div className="json-input-head">
            <label className="tool-field__label" htmlFor="uconv-value">
              Value
            </label>
          </div>
          <span className="tool-field__control">
            <input
              id="uconv-value"
              className="cidr-input"
              type="text"
              inputMode="decimal"
              spellCheck={false}
              value={value}
              placeholder="1"
              aria-invalid={valueError != null}
              aria-describedby={valueError ? 'uconv-value-error' : undefined}
              onChange={(event) => {
                setValue(event.target.value)
                refresh(category, event.target.value, fromId, toId)
              }}
            />
          </span>
          <span className="tool-field__hint">
            Decimals and scientific notation (e.g. 1.5e3) are fine. Negative values are handled where they make sense.
          </span>
          {valueError && (
            <p className="cidr-error" id="uconv-value-error" role="alert">
              ✕ {valueError}
            </p>
          )}
        </div>

        <div className="tool-field">
          <label className="tool-field__label" htmlFor="uconv-from">
            From unit
          </label>
          <span className="tool-field__control">
            <select
              id="uconv-from"
              className="cidr-prefix"
              value={fromId}
              onChange={(event) => {
                setFromId(event.target.value)
                refresh(category, value, event.target.value, toId)
              }}
            >
              {activeUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          </span>
        </div>

        <div className="uconv-swap">
          <button
            type="button"
            className="tool-btn uconv-swap__btn"
            aria-label="Swap source and destination units"
            onClick={() => {
              setFromId(toId)
              setToId(fromId)
              refresh(category, value, toId, fromId)
            }}
          >
            ⇄ Swap
          </button>
        </div>

        <div className="tool-field">
          <label className="tool-field__label" htmlFor="uconv-to">
            To unit
          </label>
          <span className="tool-field__control">
            <select
              id="uconv-to"
              className="cidr-prefix"
              value={toId}
              onChange={(event) => {
                setToId(event.target.value)
                refresh(category, value, fromId, event.target.value)
              }}
            >
              {activeUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          </span>
        </div>
      </div>

      <div className="tool-actions">
        <button
          type="button"
          className="tool-btn"
          onClick={() => {
            setValue('')
            setCopied('')
            setCopyFailed(false)
            refresh(category, '', fromId, toId)
          }}
        >
          Clear
        </button>
        <button
          type="button"
          className="tool-btn"
          onClick={() => {
            const cat = categoryByKey('length')
            setCategory('length')
            setFromId(cat.defaultFrom)
            setToId(cat.defaultTo)
            setValue(cat.defaultValue)
            setCopied('')
            setCopyFailed(false)
            refresh('length', cat.defaultValue, cat.defaultFrom, cat.defaultTo)
          }}
        >
          Reset Example
        </button>
      </div>

      <div className="codec-output cidr-results">
        <div className="codec-output__head">
          <span className={`codec-status codec-status--${status.kind}`} role="status" aria-live="polite">
            {status.kind === 'valid' ? '✓' : status.kind === 'invalid' ? '✕' : ''}
            {status.kind === 'valid' || status.kind === 'invalid' ? `Unit — ${statusText}` : 'Unit — Waiting'}
          </span>
        </div>
        {status.message && <p className="tool-result__note">{status.message}</p>}
        {copyFailed && <p className="tool-result__note">Could not copy automatically — copy the value manually.</p>}

        {result && (
          <>
            <div className="uconv-quote">
              <span className="json-controls__label">Converted value</span>
              <p className="uconv-quote__line">{result.quote}</p>
              <p className="uconv-quote__expr">
                <span className="json-controls__label">Conversion</span> {result.unitLine}
              </p>
            </div>

            <div className="tool-actions">
              <button type="button" className="tool-btn tool-btn--primary" onClick={() => runCopy('result', result.quote)}>
                {copied === 'result' ? 'Copied' : 'Copy Result'}
              </button>
              <button type="button" className="tool-btn" onClick={() => runCopy('expression', result.unitLine)}>
                {copied === 'expression' ? 'Copied' : 'Copy Expression'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UnitConverter