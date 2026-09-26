/**
 * Sidequests loading / empty / error states.
 *
 * Same roles and tone as `features/campus/components/States.jsx` — a polite
 * `role="status"` for things that are merely absent, an assertive
 * `role="alert"` when something failed — but written for this section's voice.
 *
 * The error copy is fixed and calm on purpose. "Something got lost somewhere."
 * is a sentence about the site, not a stack trace, and it is paired with a
 * working "Try again." because every state here has a real retry behind it.
 */

/** A quiet placeholder block, shaped like the content it stands in for. */
export function Skeleton({ height = '1rem', width = '100%', radius = 'var(--radius-sm)' }) {
  return (
    <span
      className="sq-skeleton"
      style={{ display: 'block', height, width, borderRadius: radius }}
      aria-hidden="true"
    />
  )
}

/** Card-shaped skeleton, so the shelf does not reflow when data lands. */
export function CardSkeleton({ count = 3 }) {
  return (
    <div className="sq-card-row" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        // Index is a stable position in a fixed-length list, not a real key.
        <div className="sq-card sq-card--skeleton" key={index}>
          <Skeleton height="7.5rem" radius="var(--radius-md)" />
          <Skeleton height="0.7rem" width="30%" />
          <Skeleton height="1.1rem" width="88%" />
          <Skeleton height="0.7rem" width="70%" />
        </div>
      ))}
    </div>
  )
}

/** Nothing here yet, and that is genuinely fine. */
export function EmptyState({ title, hint }) {
  return (
    <div className="sq-state" role="status">
      <div className="sq-state__mark" aria-hidden="true">
        <span />
      </div>
      <p className="sq-state__title">{title}</p>
      {hint ? <p className="sq-state__hint">{hint}</p> : null}
    </div>
  )
}

/**
 * Something failed. The cause is deliberately not shown: the API withholds
 * internals, so surfacing them would be leaking, and a student does not need a
 * 500 to tell them the page did not load.
 */
export function ErrorState({ onRetry, what = 'this' }) {
  return (
    <div className="sq-state sq-state--error" role="alert">
      <div className="sq-state__mark sq-state__mark--error" aria-hidden="true">
        <span>!</span>
      </div>
      <p className="sq-state__title">Something got lost somewhere.</p>
      <p className="sq-state__hint">
        We could not load {what}. Nothing you saved is affected.
      </p>
      {onRetry ? (
        <button type="button" className="sq-state__retry" onClick={onRetry}>
          Try again.
        </button>
      ) : null}
    </div>
  )
}

/**
 * A short inline failure for a secondary action (a save, a join) that failed
 * while the rest of the page is fine. Announced, but not alarming.
 */
export function InlineError({ children }) {
  return (
    <p className="sq-inline-error" role="alert">
      {children}
    </p>
  )
}
