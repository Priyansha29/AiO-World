/**
 * CatalogExplorer — one searchable, filterable catalogue page, shared by every
 * Learn and Career section that is a plain list of data records.
 *
 * Courses, certifications, DSA problems, projects, jobs and companies all
 * render here: a section supplies its records plus a little configuration
 * (search fields, filter groups, link builder) and gets search + chips + a
 * card grid + an honest empty state. Adding a catalogue is adding data and
 * one block of config, never a new page component.
 *
 * Optional `groupBy` adds section headers (used by the Subjects index): when a
 * record field is named, results render under group headers instead of one
 * flat grid, ordered by `groupOrder`. Without it the behaviour is the plain
 * flat grid, so every other catalogue is unaffected.
 *
 * Everything is a pure derivation from the local view state, matching the
 * house style of the library and career pages.
 */
import { useMemo, useState } from 'react'
import {
  catalogHaystack,
  filterCatalog,
  searchCatalog,
} from './catalog-selectors'
import './catalog.css'

/**
 * @param {{
 *   eyebrow?: string,
 *   title?: string,
 *   sub?: string,
 *   items: object[],
 *   searchFields?: string[],
 *   labelKeys?: string[],
 *   groups?: Array<{ key: string, label: string, valueField?: string, options: Array<{ value: string, label: string }> }>,
 *   groupBy?: string,
 *   groupOrder?: string[],
 *   groupLabelFor?: (value: string) => string,
 *   hrefFor: (item: object) => string,
 *   renderMeta?: (item: object) => React.ReactNode,
 *   emptyTitle: string,
 *   emptyBody: string,
 *   keyField?: string,
 * }} props
 */
export default function CatalogExplorer({
  eyebrow,
  title,
  sub,
  items = [],
  searchFields = ['title', 'description', 'tags'],
  labelKeys = ['subjects', 'skills'],
  groups = [],
  groupBy,
  groupOrder = [],
  groupLabelFor = (value) => value,
  hrefFor,
  renderMeta,
  emptyTitle,
  emptyBody,
  keyField = 'id',
}) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState({})

  const haystack = useMemo(
    () => (item) => catalogHaystack(item, { fields: searchFields, labelKeys }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(searchFields), JSON.stringify(labelKeys)],
  )

  const matches = useMemo(() => {
    const searched = searchCatalog(items, query, haystack)
    const filtered = filterCatalog(searched, active, groups)
    return filtered.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, query, active, groups, haystack])

  const onToggle = (groupKey, value) => {
    setActive((current) => ({ ...current, [groupKey]: current[groupKey] === value ? 'all' : value }))
  }

  const renderGrid = (records) => (
    <ul className="cat-grid">
      {records.map((item) => (
        <li key={item[keyField]}>
          <a className="cat-card" href={hrefFor(item)}>
            <span className="cat-card__body">
              <span className="cat-card__title">{item.title}</span>
              {item.description && <span className="cat-card__desc">{item.description}</span>}
              {renderMeta ? renderMeta(item) : null}
            </span>
            <span className="cat-card__arrow" aria-hidden>→</span>
          </a>
        </li>
      ))}
    </ul>
  )

  const grouped = useMemo(() => {
    if (!groupBy) return null
    const buckets = new Map()
    for (const item of matches) {
      const value = item[groupBy] ?? null
      if (!buckets.has(value)) buckets.set(value, [])
      buckets.get(value).push(item)
    }
    const order = [...groupOrder.filter((key) => buckets.has(key))]
    for (const key of buckets.keys()) {
      if (!order.includes(key)) order.push(key)
    }
    return order.map((key) => ({
      key,
      label: key == null ? 'Other' : groupLabelFor(key),
      items: buckets.get(key),
    }))
  }, [matches, groupBy, groupOrder, groupLabelFor])

  return (
    <section className="cat" aria-label={title ? `${title} catalogue` : 'Catalogue'}>
      {eyebrow && <p className="cat__eyebrow">{eyebrow}</p>}
      {title && <h2 className="cat__title">{title}</h2>}
      {sub && <p className="cat__sub">{sub}</p>}

      <div className="cat__tools">
        <label className="cat__search">
          <span className="cat__search-icon" aria-hidden>⌕</span>
          <input
            type="search"
            className="cat__search-input"
            placeholder={title ? `Search ${title.toLowerCase()}` : 'Search'}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        {groups.map((group) => (
          <div className="cat__filters" role="group" aria-label={`Filter by ${group.label}`} key={group.key}>
            <span className="cat__filters-label">{group.label}</span>
            <div className="cat__chips">
              <button
                type="button"
                className={`cat-chip${!active[group.key] || active[group.key] === 'all' ? ' cat-chip--active' : ''}`}
                onClick={() => onToggle(group.key, 'all')}
              >
                All
              </button>
              {group.options.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={`cat-chip${active[group.key] === option.value ? ' cat-chip--active' : ''}`}
                  onClick={() => onToggle(group.key, option.value)}
                >
                  {option.label}
                  <span className="cat-chip__count">{option.count}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {matches.length === 0 ? (
        <div className="cat-empty">
          <p className="cat-empty__title">
            {items.length === 0 ? emptyTitle : 'Nothing matches that (yet).'}
          </p>
          <p className="cat-empty__body">
            {items.length === 0 ? emptyBody : 'Try a different search — or clear the filters and browse.'}
          </p>
        </div>
      ) : grouped ? (
        <div className="cat-groups">
          {grouped.map((group) => (
            <section className="cat-group" aria-label={group.label} key={group.key}>
              <h3 className="cat-group__title">
                {group.label}
                <span className="cat-group__count">{group.items.length}</span>
              </h3>
              {renderGrid(group.items)}
            </section>
          ))}
        </div>
      ) : (
        renderGrid(matches)
      )}
    </section>
  )
}