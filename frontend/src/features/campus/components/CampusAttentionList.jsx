/**
 * CampusAttentionList — compact "what matters right now" rows.
 * Surfaces the top priority items without competing with the full feed.
 */
import { CAMPUS_CATEGORY_META } from '../domain/campus-categories'
import { formatShortDate } from '../domain/relative-time'

export default function CampusAttentionList({ items }) {
  return (
    <section className="campus-attention" aria-labelledby="campus-attention-title">
      <div className="campus-attention__heading">
        <h2 id="campus-attention-title" className="campus-attention__title">
          Needs your attention
        </h2>
        <p className="campus-attention__sub">Important campus updates worth checking first.</p>
      </div>
      <ul className="campus-attention__list">
        {items.map((item) => {
          const categoryMeta = CAMPUS_CATEGORY_META[item.category]
          const accent = categoryMeta?.accent ?? 'var(--sand)'
          const categoryLabel = categoryMeta?.label ?? item.category
          return (
            <li
              key={item.id}
              className="campus-attention__row"
              style={{ '--row-accent': accent }}
            >
              <span className="campus-attention__accent" aria-hidden="true" />
              <span className="campus-attention__cat">{categoryLabel}</span>
              <span className="campus-attention__row-title">{item.title}</span>
              <span className="campus-attention__date">{formatShortDate(item.updatedAt)}</span>
              <span className="campus-attention__arrow" aria-hidden="true">
                →
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}