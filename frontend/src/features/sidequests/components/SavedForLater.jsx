/**
 * "Save for later".
 *
 * Loaded only when the section approaches the viewport, because an empty list is
 * not worth a request on page load. The bookmark state is mirrored into
 * `localStorage` on every write, so the button on a card is already correct on
 * the next visit before any request resolves.
 *
 * When nothing is saved the section says so plainly and points at discovery,
 * rather than showing an illustration of an empty box. There is no "your saved
 * items" login prompt: there is no account, and pretending otherwise would be
 * the section's first lie.
 */
import { motion } from 'framer-motion'
import ContentCard from './ContentCard'
import { EmptyState, CardSkeleton, ErrorState, InlineError } from './States'
import { formatRelative } from '../domain/sidequest-types'

const ease = [0.25, 0.1, 0.25, 1]

/**
 * @param {{
 *   items: Array<{ content: object, savedAt: string }>,
 *   loading: boolean,
 *   error: Error | null,
 *   onRetry: () => void,
 *   onSave: (item: object) => void,
 *   busyId: string | null,
 *   interestNameFor: (slug: string) => string,
 * }} props
 */
export default function SavedForLater({
  items,
  loading,
  error,
  onRetry,
  onSave,
  busyId,
  interestNameFor,
}) {
  const nothing = items.length === 0

  return (
    <div className="sq-saved">
      {error && nothing ? (
        <ErrorState onRetry={onRetry} what="your saved list" />
      ) : loading && nothing ? (
        <CardSkeleton count={2} />
      ) : nothing ? (
        <EmptyState
          title="Nothing saved yet."
          hint="Hit Save on anything you like and it will wait for you here."
        />
      ) : (
        <>
          <div className="sq-card-grid">
            {items.map((entry, index) => (
              <motion.div
                key={entry.content.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, ease, delay: Math.min(index, 6) * 0.05 }}
              >
                <ContentCard
                  item={entry.content}
                  saved
                  saveBusy={busyId === entry.content.id}
                  onSave={onSave}
                  interestName={interestNameFor(entry.content.interestSlug)}
                />
                {entry.savedAt ? (
                  <p className="sq-saved__when">Saved {formatRelative(entry.savedAt)}</p>
                ) : null}
              </motion.div>
            ))}
          </div>
          <p className="sq-saved__note">
            Kept on this device. No account, nothing sent anywhere else.
          </p>
        </>
      )}

      {error && !nothing ? (
        <InlineError>
          The latest change did not save.{' '}
          <button type="button" onClick={onRetry}>
            Try again.
          </button>
        </InlineError>
      ) : null}
    </div>
  )
}
