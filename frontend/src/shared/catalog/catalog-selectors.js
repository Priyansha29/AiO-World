/**
 * Catalog selectors — pure search/filter over any data-driven catalogue.
 *
 * These are the functions behind the generic CatalogExplorer. They never read
 * state and never look at the DOM, so they are safe to unit-test and reuse
 * from a page that wants its own layout. A record matches the shared
 * vocabulary when it carries `subjects` / `skills` key arrays; those are
 * turned into searchable labels through the shared taxonomy, so a query like
 * "react course" finds a course tagged with the react skill key.
 */
import { skillLabel, subjectLabel } from '../taxonomy'

/**
 * The flattened searchable text for one record.
 *
 * `fields` lists the record's own properties to include (title, description,
 * tags, …). `labelKeys` names the properties that hold shared subject/skill
 * keys, which are included by their human labels.
 */
export function catalogHaystack(
  record,
  { fields = ['title', 'description', 'tags'], labelKeys = ['subjects', 'skills'] } = {},
) {
  const own = fields.flatMap((field) => {
    const value = record[field]
    if (Array.isArray(value)) return value
    return value == null ? [] : [value]
  })

  const labels = labelKeys.flatMap((field) => {
    const keys = record[field]
    if (!Array.isArray(keys)) return []
    return keys.map((key) => (field === 'subjects' ? subjectLabel(key) : skillLabel(key)))
  })

  return [...own, ...labels].join(' ').toLowerCase()
}

/** Case-insensitive, all-tokens search over the haystack. Empty query matches everything. */
export function searchCatalog(items, query, haystack) {
  const needle = String(query ?? '').trim().toLowerCase()
  if (!needle) return items
  const tokens = needle.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return items
  return items.filter((item) => tokens.every((token) => haystack(item).includes(token)))
}

/**
 * Apply one filter group: `{ [group.key]: activeValue }` where activeValue is
 * a string recorded in the group's options (or 'all'). A record matches the
 * group when any of its values in that field equals the active value.
 */
export function applyFilterGroup(items, active, group) {
  if (!active || active === 'all') return items
  return items.filter((item) => {
    const value = item[group.valueField ?? group.key]
    if (Array.isArray(value)) return value.includes(active)
    return value === active
  })
}

/** Apply every filter group in order, returning the surviving catalogue. */
export function filterCatalog(items, activeGroups, groups) {
  return groups.reduce(
    (acc, group) => applyFilterGroup(acc, activeGroups[group.key], group),
    items,
  )
}

/** Turn a list of records into { value, label, count } options for a filter group. */
export function buildFilterOptions(items, field) {
  const counts = new Map()
  for (const item of items) {
    const value = item[field]
    const keys = Array.isArray(value) ? value : [value]
    for (const key of keys) {
      if (key == null) continue
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([key, count]) => ({
      value: key,
      label: field === 'subjects' ? subjectLabel(key) : field === 'skills' ? skillLabel(key) : key,
      count,
    }))
}