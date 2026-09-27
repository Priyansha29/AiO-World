/**
 * BookReader — the reading surface.
 *
 * One component, three honest modes:
 *
 *   text    — hosted demo books (original AiO text). Chapter navigation,
 *             previous/next, real progress, font-size zoom, reading modes.
 *   pdf     — hosted authorized file. when a public URL resolves (Supabase
 *             configured + storagePath), renders it in a native PDF frame; a
 *             cross-origin viewer cannot report pages, so page-level progress
 *             is never faked. Without a URL it shows an honest "file not
 *             uploaded yet" state.
 *   external— never downloads the book; explains it lives at a legitimate
 *             source and offers [Open Book →] straight to that site.
 *
 * Reading mode (light/sepia/dark), fullscreen and font size are local chrome
 * state — the book's content is never altered.
 */
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { READING_MODES } from '../domain/library-types'
import { getDemoContent } from '../data/demo-books'
import { getPublicFileUrl } from '../services/storage'

const FONT_RANGE = { min: 85, max: 145, step: 10 }

function Toolbar({ book, bookmarked, onToggleBookmark, onBack, mode, onMode, children }) {
  return (
    <header className="lib-reader__bar">
      {children}
      <label className="lib-reader__meta">
        <span className="lib-reader__title">{book.title}</span>
        <span className="lib-reader__author">{book.author}</span>
      </label>
      <div className="lib-reader__controls">
        <button
          type="button"
          className={`lib-reader__control${bookmarked ? ' lib-reader__control--active' : ''}`}
          onClick={onToggleBookmark}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path
              d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z"
              fill={bookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <label className="lib-reader__mode" aria-label="Reading mode">
          <select
            className="lib-reader__mode-select"
            value={mode}
            onChange={(event) => onMode(event.target.value)}
          >
            {READING_MODES.map((option) => (
              <option key={option.key} value={option.key}>{option.label}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="lib-reader__control lib-reader__control--exit"
          onClick={onBack}
          aria-label="Back to library"
        >
          Exit
        </button>
      </div>
    </header>
  )
}

function TextBody({ book, progress, onProgress }) {
  const chapters = useMemo(
    () => getDemoContent(book.demoContentRef)?.chapters ?? [],
    [book.demoContentRef],
  )
  const [index, setIndex] = useState(() => {
    const fromProgress = chapters.findIndex(
      (chapter) => chapter.id === progress?.chapterId,
    )
    return fromProgress >= 0 ? fromProgress : 0
  })
  const [fontPct, setFontPct] = useState(100)
  const [contentsOpen, setContentsOpen] = useState(false)

  const chapter = chapters[index]
  const total = chapters.length

  const goTo = useCallback(
    (next) => {
      if (next < 0 || next >= total) return
      const target = chapters[next]
      setIndex(next)
      setContentsOpen(false)
      onProgress({
        chapterId: target.id,
        chapterTitle: target.title,
        progress: Math.round(((next + 1) / total) * 100) / 100,
      })
    },
    [chapters, total, onProgress],
  )

  // Text demos are the only format with a real reportable position. The
  // initial index resumes from the last chapter saved in progress (set above);
  // after that the reader owns index and reports changes back up.
  if (chapters.length === 0) {
    return (
      <div className="lib-reader__empty">
        <p>This demo book has no chapters yet.</p>
      </div>
    )
  }

  return (
    <div className="lib-reader__text" style={{ '--lib-font-scale': `${fontPct}%` }}>
      <div className="lib-reader__textbar">
        <button type="button" className="lib-reader__link" onClick={() => setContentsOpen(true)}>
          Contents
        </button>
        <span className="lib-reader__page">
          Chapter {index + 1} of {total}
        </span>
        <div className="lib-reader__zoom" role="group" aria-label="Text size">
          <button type="button" onClick={() => setFontPct((p) => Math.max(FONT_RANGE.min, p - FONT_RANGE.step))} aria-label="Smaller text">
            A−
          </button>
          <span>{fontPct}%</span>
          <button type="button" onClick={() => setFontPct((p) => Math.min(FONT_RANGE.max, p + FONT_RANGE.step))} aria-label="Larger text">
            A+
          </button>
        </div>
      </div>

      <article className="lib-reader__chapter">
        <p className="lib-reader__chapter-kicker">{book.title}</p>
        <h2 className="lib-reader__chapter-title">{chapter.title}</h2>
        {chapter.body.map((paragraph, i) => (
          <p key={i} className="lib-reader__paragraph">{paragraph}</p>
        ))}
      </article>

      {contentsOpen && (
        <div className="lib-reader__drawer" role="dialog" aria-modal="true" onClick={(event) => {
          if (event.target === event.currentTarget) setContentsOpen(false)
        }}>
          <div className="lib-reader__drawer-card">
            <h3 className="lib-reader__drawer-title">Contents</h3>
            <ol className="lib-reader__toc">
              {chapters.map((chap, i) => (
                <li key={chap.id}>
                  <button
                    type="button"
                    className={`lib-reader__toc-item${i === index ? ' lib-reader__toc-item--active' : ''}`}
                    onClick={() => goTo(i)}
                  >
                    <span>{i + 1}.</span> {chap.title}
                  </button>
                </li>
              ))}
            </ol>
            <button type="button" className="lib-reader__close" onClick={() => setContentsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <footer className="lib-reader__pager">
        <button type="button" className="lib-reader__nav" disabled={index === 0} onClick={() => goTo(index - 1)}>
          ← Previous chapter
        </button>
        <button type="button" className="lib-reader__nav" disabled={index === total - 1} onClick={() => goTo(index + 1)}>
          Next chapter →
        </button>
      </footer>
    </div>
  )
}

function ExternalBody({ book }) {
  return (
    <div className="lib-reader__external">
      <span className="lib-reader__external-ic" aria-hidden>📖</span>
      <h2 className="lib-reader__external-title">This book is available from an external source.</h2>
      <p className="lib-reader__external-sub">
        {book.title} by {book.author} is not hosted by AiO, so we never download or mirror it —
        we send you to its legitimate home to read or buy it.
      </p>
      <a className="lib-reader__external-cta" href={book.externalUrl} target="_blank" rel="noopener noreferrer">
        Open Book →
      </a>
    </div>
  )
}

function PdfBody({ book, fileUrl }) {
  if (!fileUrl) {
    return (
      <div className="lib-reader__empty">
        <h2 className="lib-reader__empty-title">The file isn’t uploaded yet.</h2>
        <p className="lib-reader__empty-sub">
          {book.demo
            ? 'This is a demo record for the library pipeline — an authorized file will replace it.'
            : 'AiO has the permission, but the file has not been published to the library bucket yet.'}
        </p>
      </div>
    )
  }

  return (
    <div className="lib-reader__pdf">
      {/* Native browser PDF view: no bespoke renderer, no added dependency.
          A cross-origin document cannot report page numbers, so progress here
          stays at the opened/completed granularity — never faked. */}
      <iframe className="lib-reader__iframe" src={fileUrl} title={`${book.title} — PDF`} />
    </div>
  )
}

function BookReader({ book, progress, bookmarked, onToggleBookmark, onProgress, onBack }) {
  const [mode, setMode] = useState('light')
  const [, setFullscreen] = useState(false)
  const frameRef = useRef(null)

  const fileUrl = useMemo(
    () => (book.fileType === 'pdf' ? getPublicFileUrl(book.storagePath) : null),
    [book.fileType, book.storagePath],
  )

  const content = useMemo(() => {
    if (book.sourceType === 'external') return 'external'
    if (book.fileType === 'text') return 'text'
    return 'pdf'
  }, [book.sourceType, book.fileType])

  const body = content === 'text'
    ? <TextBody book={book} progress={progress} onProgress={onProgress} />
    : content === 'pdf'
      ? <PdfBody book={book} fileUrl={fileUrl} />
      : <ExternalBody book={book} />

  const toggleFullscreen = () => {
    const root = frameRef.current
    if (!root) return
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {})
      setFullscreen(false)
    } else {
      root.requestFullscreen?.().then(() => setFullscreen(true)).catch(() => {})
    }
  }

  return (
    <div
      ref={frameRef}
      className={`lib-reader lib-reader--${mode}`}
      id="reader"
    >
      <Toolbar
        book={book}
        bookmarked={bookmarked}
        onToggleBookmark={onToggleBookmark}
        onBack={onBack}
        mode={mode}
        onMode={setMode}
      >
        <button type="button" className="lib-reader__control lib-reader__control--back" onClick={onBack} aria-label="Back to Library">
          ← Library
        </button>
        <button type="button" className="lib-reader__control" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
          ⤢
        </button>
      </Toolbar>

      <div className="lib-reader__body">{body}</div>
    </div>
  )
}

export default memo(BookReader)