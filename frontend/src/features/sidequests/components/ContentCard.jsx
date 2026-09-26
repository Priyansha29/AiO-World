/**
 * A sidequest card — the recurring unit of every content shelf.
 *
 * One component, three densities. `lead` is the single big card in the
 * discovery section, `wide` is the horizontal-scroll unit, and `default` fills a
 * grid. Keeping them one component rather than three is what stops the page
 * drifting into three different card designs.
 *
 * Every field is optional in the domain model, so each is rendered only when the
 * seed actually has it. A recipe without ingredients and a fact with no duration
 * both look deliberate here rather than half-empty.
 *
 * The whole card is not a link. The seed is content metadata, not a URL, so the
 * title is a heading and the only interactive parts are the save button and the
 * source link — making the entire card clickable would imply somewhere to go.
 */
import ContentVisual from './ContentVisual'
import SaveButton from './SaveButton'
import {
  CATEGORY_META,
  contentTypeLabel,
  difficultyLabel,
  hasDifficulty,
} from '../domain/sidequest-types'

/**
 * @param {{
 *   item: object,
 *   size?: 'lead' | 'wide' | 'default',
 *   saved?: boolean,
 *   saveBusy?: boolean,
 *   onSave?: (item: object) => void,
 *   interestName?: string,
 *   showReasons?: boolean,
 * }} props
 */
export default function ContentCard({
  item,
  size = 'default',
  saved = false,
  saveBusy = false,
  onSave,
  interestName,
  showReasons = false,
}) {
  const meta = CATEGORY_META[item.category] ?? CATEGORY_META.explore
  const hasSource = Boolean(item.sourceName || item.sourceUrl)
  const hasMeta =
    hasDifficulty(item) || Boolean(item.duration) || Boolean(item.sourceName)

  return (
    <article
      className={`sq-card sq-card--${size}`}
      style={{ '--sq-accent': meta.accent }}
      aria-labelledby={`sq-t-${item.id}`}
    >
      <ContentVisual item={item} size={size === 'lead' ? 'lg' : 'sm'} />

      <div className="sq-card__body">
        <p className="sq-card__kicker">
          {/* The type glyph already appears in the generated visual, so the
              label here is text only. */}
          <span className="sq-card__type">{contentTypeLabel(item.type)}</span>
          <span className="sq-card__dot" aria-hidden="true">
            ·
          </span>
          <span className="sq-card__interest">{interestName ?? item.interestSlug}</span>
        </p>

        <h3 className="sq-card__title" id={`sq-t-${item.id}`}>
          {item.title}
        </h3>

        <p className="sq-card__desc">{item.description}</p>

        {showReasons && item.reasons?.length ? (
          <p className="sq-card__reasons">
            {item.reasons.map((reason) => (
              <span className="sq-card__reason" key={reason}>
                {reason}
              </span>
            ))}
          </p>
        ) : null}

        <div className="sq-card__foot">
          {hasMeta ? (
            <p className="sq-card__meta">
              {hasDifficulty(item) ? (
                <span className="sq-tag">{difficultyLabel(item.difficulty)}</span>
              ) : null}
              {item.duration ? <span className="sq-tag">{item.duration}</span> : null}
              {item.sourceName && !item.sourceUrl ? (
                <span className="sq-card__source">{item.sourceName}</span>
              ) : null}
            </p>
          ) : null}

          <div className="sq-card__actions">
            {hasSource ? (
              <a
                className="sq-card__link"
                href={item.sourceUrl || '#'}
                target={item.sourceUrl ? '_blank' : undefined}
                rel={item.sourceUrl ? 'noreferrer noopener' : undefined}
              >
                {item.sourceName || 'Source'}
                {item.sourceUrl ? <span className="sq-sr-only"> (opens in a new tab)</span> : null}
              </a>
            ) : null}
            {onSave ? (
              <SaveButton saved={saved} busy={saveBusy} item={item} onToggle={onSave} />
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
