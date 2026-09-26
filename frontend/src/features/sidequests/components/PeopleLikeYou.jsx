/**
 * "People with similar interests" — anonymous aggregate counts, and nothing more.
 *
 * This is the most privacy-sensitive section in the feature, so its limits are
 * structural rather than promised. The endpoint returns a count next to an
 * interest; there is no person object anywhere in the response to leak, no id,
 * no name, no avatar, no "view profile" link, and no way to go from a count to
 * an individual. The seed module cannot express one.
 *
 * Counts are bucketed, not exact. "120–149 people here pick up running" is
 * honest about being an estimate, and precise counts in a group this small are
 * closer to naming people than to describing a crowd — a count of 1 *is* a
 * person. Anything small enough to identify someone is shown as "a handful"
 * instead. The copy also deliberately avoids "students like you": this is shared
 * taste, not a suggestion that anybody is watching.
 *
 * The interest name and icon are read off the row's own `interest` object rather
 * than looked up by slug, so this section cannot drift out of step with the
 * catalogue the way a slug join would.
 */
import { motion } from 'framer-motion'
import { InterestIcon } from './Glyph'
import { ErrorState, Skeleton } from './States'

const ease = [0.25, 0.1, 0.25, 1]

/**
 * Round a count into a bucket wide enough that nobody is identified by it.
 * Small groups get a floor rather than a number.
 */
function bucket(count) {
  if (!Number.isFinite(count) || count <= 2) return 'A handful'
  if (count < 10) return `${Math.round(count / 5) * 5}–${Math.round(count / 5) * 5 + 4}`
  if (count < 50) return `${Math.round(count / 10) * 10}–${Math.round(count / 10) * 10 + 9}`
  return `${Math.round(count / 25) * 25}+`
}

/**
 * @param {{
 *   data: { yours: Array<object>, popular: Array<object> } | null,
 *   loading: boolean,
 *   error?: Error | null,
 *   onRetry?: () => void,
 * }} props
 */
export default function PeopleLikeYou({ data, loading, error = null, onRetry }) {
  if (loading && !data) {
    return (
      <div className="sq-people__loading" aria-hidden="true">
        {Array.from({ length: 2 }, (_, index) => (
          <Skeleton key={index} height="9rem" radius="var(--radius-lg)" />
        ))}
      </div>
    )
  }

  // Reached without an answer, and not waiting for one any more. Saying "pick an
  // interest" here would blame the student for a request that never succeeded.
  if (error && !data) {
    return <ErrorState onRetry={onRetry} what="the people counts" />
  }

  const yours = data?.yours ?? []
  const popular = data?.popular ?? []

  const rows = (list, index) =>
    list.map((row, position) => (
      <motion.li
        className="sq-people__row"
        key={row.interest?.id ?? index}
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.36, ease, delay: position * 0.05 }}
      >
        <span className="sq-people__icon">
          <InterestIcon icon={row.interest?.icon ?? 'sparkle'} size={17} />
        </span>
        <span className="sq-people__name">{row.interest?.name ?? 'Something'}</span>
        <span className="sq-people__count">{bucket(row.count)}</span>
      </motion.li>
    ))

  return (
    <div className="sq-people">
      <div className="sq-people__cols">
        <section className="sq-people__col" aria-labelledby="sq-people-yours">
          <h3 className="sq-people__heading" id="sq-people-yours">
            People here who picked the same
          </h3>
          {yours.length === 0 ? (
            <p className="sq-people__none" role="status">
              Nothing to show yet — pick an interest or two and this fills in.
            </p>
          ) : (
            <ul className="sq-people__list">{rows(yours)}</ul>
          )}
        </section>

        <section className="sq-people__col" aria-labelledby="sq-people-popular">
          <h3 className="sq-people__heading" id="sq-people-popular">
            Most common here
          </h3>
          <ul className="sq-people__list">{rows(popular)}</ul>
        </section>
      </div>

      <p className="sq-people__note">
        Counts only, rounded so small groups stay anonymous. No names, no
        profiles, no way to find a person from here.
      </p>
    </div>
  )
}
