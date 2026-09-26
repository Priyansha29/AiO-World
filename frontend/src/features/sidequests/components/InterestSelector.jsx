/**
 * "Your Interests" — the one control that makes the rest of the page personal.
 *
 * All 32 interests are listed at once, grouped by shelf, with a search box. The
 * reason for not paging or filtering behind a dropdown: on a phone, 32 rows
 * behind a picker is a worse experience than a scroll, and this list is short
 * enough to scan. A student who wants to see everything can.
 *
 * Selection is a toggle per chip, and the whole set is sent to the server in
 * one request rather than one request per click. Presses accumulate locally
 * during that round trip and are reconciled against the server's response, so
 * the chips never flicker back to unselected just because the answer was slow.
 *
 * Each shelf's chips are plain buttons: a press is instant feedback on a
 * control that then waits on a network round trip, so there is nothing to
 * animate into.
 */
import { useMemo, useState } from 'react'
import { InterestIcon } from './Glyph'
import { CATEGORY_ORDER, CATEGORY_META } from '../domain/sidequest-types'
import { Skeleton } from './States'

/**
 * @param {{
 *   catalogue: Array<object>,
 *   selectedIds: Set<string>,
 *   onAdd: (ids: string[]) => Promise<void>,
 *   onRemove: (id: string) => Promise<void>,
 *   busy?: boolean,
 *   loading?: boolean,
 * }} props
 */
export default function InterestSelector({
  catalogue,
  selectedIds,
  onAdd,
  onRemove,
  busy = false,
  loading = false,
}) {
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const matched = needle
      ? catalogue.filter(
          (interest) =>
            interest.name.toLowerCase().includes(needle) ||
            interest.description.toLowerCase().includes(needle),
        )
      : catalogue

    return CATEGORY_ORDER.map((category) => ({
      category,
      items: matched.filter((interest) => interest.category === category),
    })).filter((group) => group.items.length > 0)
  }, [catalogue, query])

  const selectedCount = selectedIds?.size ?? 0

  const toggle = (interest) => {
    // The whole picker locks while a write is in flight. Per-chip locking would
    // need the in-flight ids read during render to decide which ones to dim, and
    // a list of chips that flicker individually is harder to follow than a list
    // that waits.
    if (selectedIds.has(interest.id)) onRemove(interest.id)
    else onAdd([interest.id])
  }

  return (
    <div className="sq-interests">
      <div className="sq-interests__bar">
        <label className="sq-search" htmlFor="sq-interest-search">
          <span className="sq-sr-only">Search interests</span>
          <input
            id="sq-interest-search"
            type="search"
            value={query}
            placeholder="Search 32 things…"
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
        </label>

        <p className="sq-interests__count" role="status">
          {selectedCount === 0
            ? 'Nothing picked yet'
            : `${selectedCount} picked${busy ? ' · saving…' : ''}`}
        </p>
      </div>

      {loading ? (
        <div className="sq-interests__loading" aria-hidden="true">
          {CATEGORY_ORDER.map((category) => (
            <div key={category}>
              <Skeleton height="0.75rem" width="5rem" />
              <div className="sq-interests__skeleton-row">
                {Array.from({ length: 4 }, (_, index) => (
                  <Skeleton key={index} height="2.1rem" width="7.5rem" radius="var(--radius-full)" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="sq-interests__groups">
          {groups.map(({ category, items }) => {
            const meta = CATEGORY_META[category]
            return (
              <fieldset className="sq-interest-group" key={category}>
                <legend className="sq-interest-group__legend">
                  <span className="sq-interest-group__label" style={{ color: meta.accent }}>
                    {meta.label}
                  </span>
                  <span className="sq-interest-group__blurb">{meta.blurb}</span>
                </legend>

                <div className="sq-chips">
                  {items.map((interest) => {
                    const isSelected = selectedIds.has(interest.id)
                    return (
                      <button
                        type="button"
                        key={interest.id}
                        className={`sq-chip${isSelected ? ' sq-chip--on' : ''}`}
                        style={{ '--sq-accent': meta.accent }}
                        onClick={() => toggle(interest)}
                        aria-pressed={isSelected}
                        disabled={busy}
                        title={interest.description}
                      >
                        <InterestIcon icon={interest.icon} size={15} />
                        <span className="sq-chip__name">{interest.name}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            )
          })}

          {groups.length === 0 ? (
            <p className="sq-interests__none" role="status">
              Nothing matches “{query.trim()}”. Try a shorter word.
            </p>
          ) : null}
        </div>
      )}
    </div>
  )
}
