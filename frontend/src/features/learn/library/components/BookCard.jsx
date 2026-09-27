/**
 * Reusable book card for grids, shelves and My Library rows.
 *
 * Supports cover, titles, subject, description, format, source type, reading
 * progress, a bookmark toggle and a Read/Open action. Clicking anywhere on
 * the card opens the book; the bookmark button stops propagation so it can be
 * toggled in place.
 */
import { memo } from 'react'
import { navigate } from '../../../../router/hash-router'
import { categoryTitle } from '../domain/library-types'
import { SOURCE_LABELS } from '../domain/library-types'
import BookCover from './BookCover'
import ReadingProgress from './ReadingProgress'

function BookCard({ book, progress, bookmarked, onToggleBookmark, compact = false }) {
  const open = () => navigate(`/learn/library/book/${book.id}`)

  return (
    <article className={`lib-card${compact ? ' lib-card--compact' : ''}`} onClick={open} role="button" tabIndex={0} onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        open()
      }
    }}>
      {!compact && (
        <div className="lib-card__top">
          <span className="lib-card__badge lib-card__badge--source">
            {book.demo ? 'Demo' : SOURCE_LABELS[book.sourceType]}
          </span>
          <span className="lib-card__badge">{book.format}</span>
        </div>
      )}

      <div className="lib-card__cover">
        <BookCover book={book} size={compact ? 'sm' : 'md'} />
      </div>

      <div className="lib-card__body">
        <h3 className="lib-card__title">{book.title}</h3>
        <p className="lib-card__author">{book.author}</p>
        <p className="lib-card__subject">{categoryTitle(book.category)}</p>
        {!compact && <p className="lib-card__desc">{book.description}</p>}

        <div className="lib-card__foot">
          <ReadingProgress progress={progress} />
          <div className="lib-card__actions">
            <button
              type="button"
              className={`lib-card__bookmark${bookmarked ? ' lib-card__bookmark--on' : ''}`}
              onClick={(event) => {
                event.stopPropagation()
                onToggleBookmark()
              }}
              aria-pressed={bookmarked}
              aria-label={bookmarked ? `Remove ${book.title} from My Library` : `Save ${book.title} to My Library`}
            >
              <svg className="lib-card__bookmark-ic" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z"
                  fill={bookmarked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button type="button" className="lib-card__cta" onClick={(event) => {
              event.stopPropagation()
              open()
            }}>
              {book.sourceType === 'external' ? 'Open' : 'Read'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default memo(BookCard)