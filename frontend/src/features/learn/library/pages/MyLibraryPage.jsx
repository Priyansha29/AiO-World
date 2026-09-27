/**
 * My Library — the student's four personal shelves.
 *
 *   Currently Reading — started, not completed, most recent open first.
 *   Saved Books      — bookmark list.
 *   Recently Opened  — everything opened, most recent first.
 *   Completed        — books marked complete.
 *
 * All from localStorage via services/reading-progress.js + bookmarks.js.
 * Values are derived on every render (the localStorage reads are cached), so
 * a single `revision` bump after a bookmark toggle re-derives everything.
 */
import { useCallback, useEffect, useState } from 'react'
import Navbar from '../../../../components/Navbar'
import PlatformNav from '../../../../components/platform/PlatformNav'
import BookShelf from '../components/BookShelf'
import { getBook } from '../data/books'
import { getBookmarks, toggleBookmark } from '../services/bookmarks'
import { getAllProgress } from '../services/reading-progress'
import { navigate } from '../../../../router/hash-router'
import '../library.css'

export default function MyLibraryPage() {
  const [, setRevision] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const onToggleBookmark = useCallback((id) => {
    toggleBookmark(id)
    setRevision((n) => n + 1)
  }, [])

  // Derived on every render; the localStorage reads are cached and cheap, and
  // `setRevision` above forces a re-render + re-derivation after a toggle.
  const progressMap = {}
  for (const [id, record] of Object.entries(getAllProgress())) {
    if (getBook(id)) progressMap[id] = record
  }

  const byId = Object.entries(getAllProgress()).filter(([id]) => getBook(id))
  const byLastOpened = [...byId].sort((a, b) => (a[1].lastOpened < b[1].lastOpened ? 1 : -1))

  const shelves = {
    reading: byLastOpened.filter(([, record]) => !record.completed && record.lastOpened).map(([id]) => getBook(id)),
    opened: byLastOpened.map(([id]) => getBook(id)),
    saved: getBookmarks().map(getBook).filter(Boolean),
    completed: byId.filter(([, record]) => record.completed).map(([id]) => getBook(id)),
  }

  const bookmarks = Object.fromEntries(getBookmarks().map((id) => [id, true]))

  const sectionDefs = [
    { key: 'reading', title: 'Currently Reading', books: shelves.reading, empty: 'Nothing in progress yet. Open a book from the Library to start.' },
    { key: 'saved', title: 'Saved Books', books: shelves.saved, empty: 'No saved books yet. Tap the bookmark on any book to keep it here.' },
    { key: 'opened', title: 'Recently Opened', books: shelves.opened, empty: 'Books you open will show up here.' },
    { key: 'completed', title: 'Completed', books: shelves.completed, empty: 'Books you mark as finished will live here.' },
  ]

  return (
    <main className="lib-page" id="top">
      <Navbar />

      <div className="lib-shell">
        <header className="lib-hero lib-hero--sm">
          <button type="button" className="lib-hero__back" onClick={() => navigate('/learn/library')}>
            ← Library
          </button>
          <h1 className="lib-hero__title">My Library</h1>
          <p className="lib-hero__sub">
            {shelves.saved.length} saved · {shelves.reading.length} reading · {shelves.completed.length} completed
          </p>
        </header>

        <PlatformNav />

        {sectionDefs.map((section) => (
          <section key={section.key} className="lib-section" aria-label={section.title}>
            <div className="lib-section__head">
              <h2 className="lib-section__title">{section.title}</h2>
              <span className="lib-section__count">{section.books.length}</span>
            </div>
            <BookShelf
              books={section.books}
              progressMap={progressMap}
              bookmarks={bookmarks}
              onToggleBookmark={onToggleBookmark}
              emptyMessage={section.empty}
              ariaLabel={section.title}
            />
          </section>
        ))}
      </div>
    </main>
  )
}