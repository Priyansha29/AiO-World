/**
 * CatalogDetail — the shared detail page for a single catalogue record.
 *
 * A section renders a record (course, certification, job, project, …) through
 * simple data: header copy, a list of facts and a list of content blocks that
 * are either paragraphs or bullet lists. Owned by no single feature, so detail
 * pages do not need bespoke components either. When `record` is null it draws
 * the section-level missing state instead of crashing.
 */
import './catalog.css'

/**
 * @param {{
 *   eyebrow?: string,
 *   title: string,
 *   sub?: string,
 *   record: object | null,
 *   facts?: Array<{ label: string, value: string }>,
 *   sections?: Array<{ heading: string, body?: string, items?: Array<string | { label: string, href: string }> }>,
 *   cta?: { label: string, href: string, note?: string },
 *   backHref?: string,
 *   backLabel?: string,
 *   missingTitle?: string,
 *   missingBody?: string,
 * }} props
 */
export default function CatalogDetail({
  eyebrow,
  title,
  sub,
  record,
  facts = [],
  sections = [],
  cta,
  backHref,
  backLabel = 'Back',
  missingTitle = 'Not found.',
  missingBody = 'This record does not exist in the catalogue yet.',
}) {
  if (record == null) {
    return (
      <section className="cat" aria-label={title}>
        <p className="cat__eyebrow">{eyebrow}</p>
        <h2 className="cat__title">{title}</h2>
        <div className="cat-empty">
          <p className="cat-empty__title">{missingTitle}</p>
          <p className="cat-empty__body">{missingBody}</p>
          {backHref && (
            <a className="cat-btn" href={backHref}>{backLabel}</a>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="cat cat--detail" aria-label={title}>
      <div className="cat__topline">
        {backHref && (
          <a className="cat-back" href={backHref} aria-label={backLabel}>&larr; {backLabel}</a>
        )}
        {cta && (
          <div className="cat__cta">
            <a className="cat-btn" href={cta.href} target="_blank" rel="noreferrer">{cta.label} ↗</a>
            {cta.note && <span className="cat__cta-note">{cta.note}</span>}
          </div>
        )}
      </div>

      {eyebrow && <p className="cat__eyebrow">{eyebrow}</p>}
      <h2 className="cat__title">{title}</h2>
      {sub && <p className="cat__sub">{sub}</p>}

      {facts.length > 0 && (
        <dl className="cat-facts">
          {facts.map((fact) => (
            <div className="cat-facts__row" key={fact.label}>
              <dt className="cat-facts__label">{fact.label}</dt>
              <dd className="cat-facts__value">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {sections.map((section) => (
        <section className="cat-section" key={section.heading}>
          <h3 className="cat-section__heading">{section.heading}</h3>
          {section.body && <p className="cat-section__body">{section.body}</p>}
          {section.items && section.items.length > 0 && (
            <ul className="cat-section__list">
              {section.items.map((item) => {
                if (item != null && typeof item === 'object') {
                  const { label, href } = item
                  if (href) {
                    return (
                      <li key={href}>
                        <a className="cat-section__link" href={href} target="_blank" rel="noreferrer">{label ?? href} ↗</a>
                      </li>
                    )
                  }
                }
                return <li key={item}>{item}</li>
              })}
            </ul>
          )}
        </section>
      ))}
    </section>
  )
}