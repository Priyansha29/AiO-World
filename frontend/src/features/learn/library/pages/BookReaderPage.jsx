/**
 * Book reader page — one route, reused by every book id.
 *
 * Reads the book from the catalogue, wires the reader to the localStorage
 * progress + bookmark services, records the open, and owns the small state
 * the BookReader chrome needs.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from '../../../../components/Navbar'
import BookReader from '../components/BookReader'
import { getBook } from '../data/books'
import { navigate } from '../../../../router/hash-router'
import { getBookmarks, toggleBookmark } from '../services/bookmarks'
import { getBookProgress, recordOpen, setBookProgress } from '../services/reading-progress'
import '../library.css'

export default function BookReaderPage({ bookId }) {
  const book = useMemo(() => getBook(bookId), [bookId])
  const [progress, setProgress] = useState(() => getBookProgress(bookId))
  const [bookmarked, setBookmarked] = useState(() => getBookmarks().includes(bookId))

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [bookId])

  useEffect(() => {
    if (!book) return
    recordOpen(bookId)
  }, [book, bookId])

  const onToggleBookmark = useCallback(() => {
    setBookmarked(toggleBookmark(bookId))
  }, [bookId])

  const onProgress = useCallback((patch) => {
    setBookProgress(bookId, patch)
    setProgress(getBookProgress(bookId))
  }, [bookId])

  const onBack = useCallback(() => navigate('/learn/library'), [])

  if (!book) {
    return (
      <main className="lib-page">
        <Navbar />
        <div className="lib-shell">
          <div className="lib-missing">
            <h1 className="lib-missing__title">Book not found</h1>
            <p className="lib-missing__sub">
              That book is not in the library yet. Head back and pick another one.
            </p>
            <button type="button" className="lib-missing__cta" onClick={onBack}>
              ← Back to Library
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="lib-page">
      <BookReader
        book={book}
        progress={progress}
        bookmarked={bookmarked}
        onToggleBookmark={onToggleBookmark}
        onProgress={onProgress}
        onBack={onBack}
      />
    </main>
  )
}