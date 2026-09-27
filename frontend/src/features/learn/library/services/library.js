/**
 * Pure selectors over the catalogue: search, filter, sort and shelf helpers.
 *
 * Everything here is a function of `BOOKS` and the caller's view state, so
 * adding a book (or a hundred) needs no selector changes.
 */
import { BOOKS, getBook } from '../data/books'
import { categoryTitle, CATEGORY_KEYS, SORTS } from '../domain/library-types'

/** Lower-cased haystack a query is matched against. */
export function bookSearchText(book) {
  return [
    book.title,
    book.author,
    book.description,
    categoryTitle(book.category),
    ...book.subjects.map(categoryTitle),
    ...book.tags,
    book.format,
  ]
    .join(' ')
    .toLowerCase()
}

/** Case-insensitive, multi-token search over title/author/description/category/subjects/tags. */
export function searchBooks(books, query) {
  const needle = query.trim().toLowerCase()
  if (!needle) return books
  const tokens = needle.split(/\s+/).filter(Boolean)
  return books.filter((book) => {
    const haystack = bookSearchText(book)
    return tokens.every((token) => haystack.includes(token))
  })
}

/**
 * Filter by a category chip key and/or a hosted/external source.
 * A category chip matches the primary category OR any listed subject, so
 * "Programming" finds the Python/JS books too.
 */
export function filterBooks(books, { category = 'all', source = 'all' } = {}) {
  let result = books
  if (category && category !== 'all') {
    result = result.filter(
      (book) => book.category === category || book.subjects.includes(category),
    )
  }
  if (source && source !== 'all') {
    result = result.filter((book) => book.sourceType === source)
  }
  return result
}

export function sortBooks(books, sortKey) {
  const sorted = [...books]
  if (sortKey === 'title') {
    return sorted.sort((a, b) => a.title.localeCompare(b.title))
  }
  if (sortKey === 'author') {
    return sorted.sort((a, b) => a.author.localeCompare(b.author))
  }
  // SORT default: 'recent' — newest addedAt first.
  return sorted.sort((a, b) => (a.addedAt < b.addedAt ? 1 : a.addedAt > b.addedAt ? -1 : 0))
}

/** Truthy-valued subset of SORTS, exposed for the sort control. */
export function validSortKeys() {
  return SORTS.map((sort) => sort.key)
}

export function featuredBooks() {
  return BOOKS.filter((book) => book.featured)
}

export function externalBooks() {
  return BOOKS.filter((book) => book.sourceType === 'external')
}

export function recentlyAdded(limit = 6) {
  return sortBooks(BOOKS, 'recent').slice(0, limit)
}

/**
 * Subject cards for the landing: categories present in the catalogue, sorted
 * by book count. Only categories with at least one book are shown.
 */
export function subjectCounts(books = BOOKS, limit = 8) {
  return CATEGORY_KEYS.map((key) => ({
    key,
    title: categoryTitle(key),
    count: books.filter((book) => book.category === key || book.subjects.includes(key)).length,
  }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export { getBook }