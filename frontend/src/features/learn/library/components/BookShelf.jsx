/**
 * BookShelf — a horizontally scrollable row of compact book cards, used by
 * home sections and My Library. Keeps sections content-rich without making
 * every block a giant grid.
 */
import { memo } from 'react'
import BookCard from './BookCard'

function BookShelf({ books, progressMap = {}, bookmarks = {}, onToggleBookmark, emptyMessage, ariaLabel }) {
  return (
    <div className="lib-shelf" role="list" aria-label={ariaLabel}>
      {books.length === 0 ? (
        <p className="lib-shelf__empty">{emptyMessage ?? 'Nothing here yet.'}</p>
      ) : (
        books.map((book) => (
          <div key={book.id} className="lib-shelf__item" role="listitem">
            <BookCard
              book={book}
              compact
              progress={progressMap[book.id] ?? null}
              bookmarked={bookmarks[book.id] ?? false}
              onToggleBookmark={() => onToggleBookmark(book.id)}
            />
          </div>
        ))
      )}
    </div>
  )
}

export default memo(BookShelf)