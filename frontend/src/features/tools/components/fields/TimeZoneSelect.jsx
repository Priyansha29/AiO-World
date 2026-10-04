import { useMemo, useRef, useState } from 'react'
import { friendlyName, listZones } from '../../domain/timezone-converter'

const VISIBLE_LIMIT = 60

function normalize(value) {
  return value.toLowerCase().replace(/_/g, ' ').replace(/\s+/g, ' ')
}

function TimeZoneSelect({ id, label, value, onChange, referenceDate }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)

  const allZones = useMemo(() => listZones(), [])

  const matches = useMemo(() => {
    const term = normalize(query).trim()
    if (!term) return allZones
    return allZones
      .filter((zone) => {
        if (normalize(zone).includes(term)) return true
        return normalize(friendlyName(zone, referenceDate)).includes(term)
      })
      .slice(0, VISIBLE_LIMIT)
  }, [query, allZones, referenceDate])

  const selectedLabel = value ? `${value} — ${friendlyName(value, referenceDate)}` : ''

  const commit = (zone) => {
    onChange(zone)
    setQuery('')
    setOpen(false)
    setActiveIndex(0)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((index) => Math.min(index + 1, matches.length - 1))
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((index) => Math.max(index - 1, 0))
      return
    }
    if (event.key === 'Enter') {
      if (open && matches[activeIndex]) {
        event.preventDefault()
        commit(matches[activeIndex])
      }
      return
    }
    if (event.key === 'Escape') {
      setOpen(false)
      setQuery('')
      setActiveIndex(0)
    }
  }

  const displayed = query.trim() ? query : selectedLabel

  return (
    <div className="tz-select">
      <input
        ref={inputRef}
        id={id}
        type="text"
        className="cidr-input tz-select__input"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={open && matches[activeIndex] ? `${id}-opt-${activeIndex}` : undefined}
        aria-label={label}
        placeholder="Search zones, e.g. India, London, New York…"
        value={displayed}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
          setActiveIndex(0)
        }}
        onFocus={() => {
          setQuery('')
          setOpen(true)
          setActiveIndex(0)
        }}
        onBlur={() => {
          setOpen(false)
          setQuery('')
          setActiveIndex(0)
        }}
        onKeyDown={handleKeyDown}
      />
      {open && (
        <ul className="tz-select__list" id={`${id}-list`} role="listbox" aria-label={`${label} choices`}>
          {matches.length === 0 && (
            <li className="tz-select__empty" role="option" aria-disabled="true">
              No matches for “{query.trim()}”.
            </li>
          )}
          {matches.map((zone, index) => {
            const isActive = index === activeIndex
            const isSelected = zone === value
            return (
              <li
                key={zone}
                id={`${id}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                className={`tz-select__option${isActive ? ' tz-select__option--active' : ''}${isSelected ? ' tz-select__option--selected' : ''}`}
                onMouseDown={(event) => {
                  event.preventDefault()
                  commit(zone)
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <code className="tz-select__id">{zone}</code>
                <span className="tz-select__name">{friendlyName(zone, referenceDate)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default TimeZoneSelect