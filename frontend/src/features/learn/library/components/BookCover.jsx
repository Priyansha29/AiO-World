/**
 * Book cover: real cover image when provided, otherwise a deterministic
 * initials fallback tinted by category. Book-cover-focused cards need a
 * reliable visual, and most catalogue entries have no licensed cover image to
 * hotlink — hence a strong fallback.
 */
import { memo } from 'react'
import { categoryTitle } from '../domain/library-types'

// One warm tone per category key so covers read as a palette, built only from
// the existing design tokens.
const COVER_TONES = {
  'computer-science': 'accent',
  programming: 'peach',
  dsa: 'coral',
  ai: 'sand',
  cybersecurity: 'accent',
  mathematics: 'sand',
  networking: 'peach',
  os: 'coral',
  databases: 'sand',
  'software-engineering': 'peach',
  web: 'coral',
  cloud: 'sand',
  embedded: 'peach',
  business: 'coral',
  design: 'sand',
  career: 'accent',
}

function initialsOf(title) {
  return title
    .replace(/^Demo:\s*/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

function BookCover({ book, size = 'md' }) {
  const tone = COVER_TONES[book.category] ?? 'peach'

  if (book.coverUrl) {
    return (
      <div className={`lib-cover lib-cover--${size}`}>
        <img className="lib-cover__img" src={book.coverUrl} alt={`${book.title} cover`} loading="lazy" />
      </div>
    )
  }

  return (
    <div className={`lib-cover lib-cover--${size} lib-cover--${tone}`} aria-hidden>
      <span className="lib-cover__sub">{categoryTitle(book.category)}</span>
      <span className="lib-cover__initials">{initialsOf(book.title)}</span>
      <span className="lib-cover__source">{book.demo ? 'Demo' : book.format}</span>
    </div>
  )
}

export default memo(BookCover)