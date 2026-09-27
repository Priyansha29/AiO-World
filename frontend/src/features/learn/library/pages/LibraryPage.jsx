/**
 * Library landing page — a real library, not a list of links.
 *
 * Hero, then search + subject/source filters + sort. When the student is just
 * browsing, the page shows home sections (Continue Reading, Featured, Popular
 * Subjects, Recently Added, External Resources) followed by the full shelf
 * grouped by subject. The moment they search, filter or sort, those sections
 * give way to a single flat results grid — one derivation of one state.
 *
 * Bookmarks and reading progress are localStorage-backed (see services/);
 * nothing here needs a backend yet.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from '../../../../components/Navbar'
import PlatformNav from '../../../../components/platform/PlatformNav'
import BookCard from '../components/BookCard'
import BookGrid from '../components/BookGrid'
import BookShelf from '../components/BookShelf'
import LibrarySearch from '../components/LibrarySearch'
import LibraryFilters from '../components/LibraryFilters'
import { BOOKS, getBook } from '../data/books'
import { CATEGORIES } from '../domain/library-types'
import { filterBooks, searchBooks, sortBooks, subjectCounts } from '../services/library'
import { getBookmarks, toggleBookmark } from '../services/bookmarks'
import { getAllProgress } from '../services/reading-progress'
import { navigate } from '../../../../router/hash-router'
import '../library.css'

export default function LibraryPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [source, setSource] = useState('all')
  const [sort, setSort] = useState('recent')
  // Bookmark/progress writes update localStorage synchronously; a bump forces
  // the plain derivations below to re-run so the shelf reflects them.
  const [, setRevision] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const progressMap = {}
  for (const [id, record] of Object.entries(getAllProgress())) {
    if (getBook(id)) progressMap[id] = record
  }

  const bookmarks = Object.fromEntries(getBookmarks().map((id) => [id, true]))

  const onToggleBookmark = useCallback((id) => {
    toggleBookmark(id)
    setRevision((n) => n + 1)
  }, [])

  const onPickSubject = useCallback((key) => {
    setCategory(key)
    setQuery('')
    document.getElementById('lib-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const isBrowsing = !query.trim() && category === 'all' && source === 'all' && sort === 'recent'

  const results = sortBooks(filterBooks(searchBooks(BOOKS, query), { category, source }), sort)

  const categories = useMemo(() => subjectCounts(BOOKS, 16), [])

  const continueReading = Object.entries(progressMap)
    .filter(([, record]) => !record.completed)
    .map(([id]) => getBook(id))
    .filter(Boolean)
    .sort((a, b) => (progressMap[a.id].lastOpened < progressMap[b.id].lastOpened ? 1 : -1))

  const featured = useMemo(() => sortBooks(BOOKS.filter((book) => book.featured), 'recent'), [])
  const recentAdded = useMemo(() => sortBooks(BOOKS, 'recent').slice(0, 6), [])
  const external = useMemo(() => BOOKS.filter((book) => book.sourceType === 'external'), [])

  const shelfGroups = useMemo(
    () =>
      CATEGORIES.map((entry) => ({
        ...entry,
        items: BOOKS.filter((book) => book.category === entry.key),
      })).filter((group) => group.items.length > 0),
    [],
  )

  const activeFilter = category !== 'all' ? categories.find((c) => c.key === category) : null

  const renderCard = (book) => (
    <BookCard
      key={book.id}
      book={book}
      progress={progressMap[book.id] ?? null}
      bookmarked={Boolean(bookmarks[book.id])}
      onToggleBookmark={() => onToggleBookmark(book.id)}
    />
  )

  return (
    <main className="lib-page" id="top">
      <Navbar />

      <div className="lib-shell">
        {/* 1 ── Hero ─────────────────────────────────────────────────────── */}
        <header className="lib-hero">
          <p className="lib-hero__eyebrow">Learn · Library</p>
          <h1 className="lib-hero__title">
            Your <em>learning library.</em>
          </h1>
          <p className="lib-hero__sub">
            Books, textbooks, references and technical reading for students — all in one place.
          </p>
          <button type="button" className="lib-hero__cta" onClick={() => navigate('/learn/library/my-library')}>
            My Library →
          </button>
        </header>

        <PlatformNav />

        {/* 2 ── Search + sort ────────────────────────────────────────────── */}
        <LibrarySearch query={query} onQuery={setQuery} sort={sort} onSort={setSort} />

        {/* 3 ── Subject + source filters ─────────────────────────────────── */}
        <LibraryFilters
          categories={categories}
          category={category}
          onCategory={setCategory}
          source={source}
          onSource={setSource}
        />

        {isBrowsing ? (
          <>
            {/* 4 ── Continue Reading ─────────────────────────────────────── */}
            {continueReading.length > 0 && (
              <section className="lib-section" aria-label="Continue reading">
                <div className="lib-section__head">
                  <h2 className="lib-section__title">Continue Reading</h2>
                </div>
                <BookShelf
                  books={continueReading}
                  progressMap={progressMap}
                  bookmarks={bookmarks}
                  onToggleBookmark={onToggleBookmark}
                  ariaLabel="Books you have started"
                />
              </section>
            )}

            {/* 5 ── Featured Books ───────────────────────────────────────── */}
            <section className="lib-section" aria-label="Featured books">
              <div className="lib-section__head">
                <h2 className="lib-section__title">Featured Books</h2>
              </div>
              <BookShelf
                books={featured}
                progressMap={progressMap}
                bookmarks={bookmarks}
                onToggleBookmark={onToggleBookmark}
                ariaLabel="Featured books"
              />
            </section>

            {/* 6 ── Popular Subjects ─────────────────────────────────────── */}
            <section className="lib-section" aria-label="Popular subjects">
              <div className="lib-section__head">
                <h2 className="lib-section__title">Popular Subjects</h2>
              </div>
              <div className="lib-subjects">
                {categories.map((subject) => (
                  <button
                    key={subject.key}
                    type="button"
                    className="lib-subject"
                    onClick={() => onPickSubject(subject.key)}
                  >
                    <strong className="lib-subject__name">{subject.title}</strong>
                    <span className="lib-subject__count">
                      {subject.count} book{subject.count === 1 ? '' : 's'}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* 7 ── Recently Added ───────────────────────────────────────── */}
            <section className="lib-section" aria-label="Recently added">
              <div className="lib-section__head">
                <h2 className="lib-section__title">Recently Added</h2>
              </div>
              <BookShelf
                books={recentAdded}
                progressMap={progressMap}
                bookmarks={bookmarks}
                onToggleBookmark={onToggleBookmark}
                ariaLabel="Recently added books"
              />
            </section>

            {/* 8 ── External Resources ───────────────────────────────────── */}
            <section className="lib-section" aria-label="External resources">
              <div className="lib-section__head">
                <h2 className="lib-section__title">External Resources</h2>
              </div>
              <BookShelf
                books={external}
                progressMap={progressMap}
                bookmarks={bookmarks}
                onToggleBookmark={onToggleBookmark}
                ariaLabel="Books hosted by their legitimate external source"
              />
            </section>

            {/* 9 ── The whole shelf, grouped ─────────────────────────────── */}
            <section className="lib-section" aria-label="Browse the shelf">
              <div className="lib-section__head">
                <h2 className="lib-section__title">Browse the Shelf</h2>
              </div>
              {shelfGroups.map((group) => (
                <div key={group.key} className="lib-group">
                  <h3 className="lib-group__title">{group.title}</h3>
                  <div className="lib-grid">{group.items.map(renderCard)}</div>
                </div>
              ))}
            </section>
          </>
        ) : (
          /* 4′ ── Results grid ──────────────────────────────────────────── */
          <section className="lib-section" id="lib-results" aria-label="Search results">
            <div className="lib-section__head">
              <h2 className="lib-section__title">
                {activeFilter
                  ? activeFilter.title
                  : query.trim()
                    ? `Results for “${query.trim()}”`
                    : 'Results'}
              </h2>
              <span className="lib-section__count">
                {results.length} book{results.length === 1 ? '' : 's'}
              </span>
            </div>
            <BookGrid
              books={results}
              progressMap={progressMap}
              bookmarks={bookmarks}
              onToggleBookmark={onToggleBookmark}
              emptyMessage="No books match that yet."
            />
          </section>
        )}
      </div>
    </main>
  )
}