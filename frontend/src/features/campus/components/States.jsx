/**
 * Shared state components: empty / loading / error.
 */

export function EmptyState({ title, hint }) {
  return (
    <div className="campus-state" role="status">
      <div className="campus-state__orb" aria-hidden="true">
        <span />
      </div>
      <p className="campus-state__title">{title}</p>
      {hint ? <p className="campus-state__hint">{hint}</p> : null}
    </div>
  )
}

export function InfoSkeleton({ count = 4 }) {
  return (
    <div className="campus-card-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div className="campus-skeleton" key={index}>
          <span className="campus-skeleton__bar w-40" />
          <span className="campus-skeleton__bar w-full" />
          <span className="campus-skeleton__bar w-4/5" />
          <span className="campus-skeleton__bar w-24" />
        </div>
      ))}
    </div>
  )
}

export function ErrorState({ message = 'Couldn’t load campus updates.', onRetry }) {
  return (
    <div className="campus-state campus-state--error" role="alert">
      <div className="campus-state__orb campus-state__orb--error" aria-hidden="true">
        <span>!</span>
      </div>
      <p className="campus-state__title">{message}</p>
      <p className="campus-state__hint">
        Something went wrong on our side. Your information is safe.
      </p>
      {onRetry ? (
        <button type="button" className="campus-state__retry" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  )
}