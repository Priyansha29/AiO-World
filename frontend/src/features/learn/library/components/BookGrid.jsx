/**
 * Responsive grid of book cards with an optional empty/loading state.
 */
import { memo } from 'react'
import BookCard from './BookCard'

function BookGrid({ books, progressMap = {}, onToggleBookmark, bookmarks, emptyMessage, loading = false }) {
  if (loading) {
    return (
      <div className="lib-grid" aria-busy="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="lib-card lib-card--skeleton">
            <div className="lib-card__cover lib-card__cover--skeleton" />
            <div className="lib-card__body">
              <div className="lib-skeleton lib-skeleton--title" />
              <div className="lib-skeleton lib-skeleton--line" />
              <div className="lib-skeleton lib-skeleton--line" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="lib-empty">
        <p className="lib-empty__title">{emptyMessage ?? 'Nothing here yet.'}</p>
        <p className="lib-empty__sub">Try a different search or filter.</p>
      </div>
    )
  }

  return (
    <div className="lib-grid">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          progress={progressMap[book.id] ?? null}
          bookmarked={bookmarks[book.id] ?? false}
          onToggleBookmark={() => onToggleBookmark(book.id)}
        />
      ))}
    </div>
  )
}

export default memo(BookGrid)