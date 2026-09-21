/**
 * CampusInfoCard — a reusable card for any piece of campus information.
 * Data-driven: renders whatever `information` object it is given, from any
 * category. The UI never cares where the information originated.
 */
import { CAMPUS_CATEGORY_META } from '../domain/campus-categories'
import PriorityBadge from './PriorityBadge'
import InformationSource from './InformationSource'
import FreshnessIndicator from './FreshnessIndicator'

function formatDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date
    .toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
    .toUpperCase()
}

export default function CampusInfoCard({ information, index = 0, featured = false }) {
  const categoryMeta = CAMPUS_CATEGORY_META[information.category]
  const accent = categoryMeta?.accent ?? 'var(--sand)'
  const categoryLabel = categoryMeta?.label ?? information.category
  const metadata = information.metadata ? Object.entries(information.metadata) : []

  return (
    <article
      className={`campus-card${featured ? ' campus-card--featured' : ''}`}
      style={{ '--card-accent': accent, '--delay': `${index * 40}ms` }}
    >
      <span className="campus-card__accent" aria-hidden="true" />
      <header className="campus-card__head">
        <span className="campus-card__category">{categoryLabel}</span>
        <span className="campus-card__head-end">
          <span className="campus-card__date">{formatDate(information.updatedAt)}</span>
          <PriorityBadge priority={information.priority} />
        </span>
      </header>

      <h3 className="campus-card__title">{information.title}</h3>
      <p className="campus-card__description">{information.description}</p>

      {metadata.length > 0 ? (
        <ul className="campus-card__meta-list">
          {metadata.map(([key, value]) => (
            <li key={key} className="campus-card__meta-row">
              <span className="campus-card__meta-key">{key}</span>
              <span className="campus-card__meta-value">{value}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <footer className="campus-card__foot">
        <InformationSource source={information.source} />
        <span className="campus-card__foot-end">
          {information.supersedesId ? (
            <span className="campus-card__revised" title="This notice replaces an earlier one">
              Revises earlier notice
            </span>
          ) : null}
          <span className="campus-card__more">
            {featured ? 'View details' : 'Read more'}
            <span className="campus-card__more-arrow" aria-hidden="true">
              →
            </span>
          </span>
          <FreshnessIndicator
            updatedAt={information.updatedAt}
            publishedAt={information.publishedAt}
          />
        </span>
      </footer>
    </article>
  )
}