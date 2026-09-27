/**
 * PlatformPage — the reusable page behind every Learn and Career hub and their
 * not-yet-built sections.
 *
 * One component renders all of them:
 *   - hub (`/learn`, `/career`): hero + section-navigation + a grid of cards
 *     linking to every section (live ones noted).
 *   - section (`/learn/subjects`, `/career/interviews`, …): hero +
 *     section-navigation + a professional empty state describing what belongs
 *     there. No fake content is ever rendered.
 *
 * Adding a section later = one record in platform-data.js.
 */
import Navbar from '../Navbar'
import PlatformNav from './PlatformNav'
import { PLATFORMS, SECTION_ICONS } from './platform-data'
import './platform.css'

function HubGrid({ platform }) {
  return (
    <section className="pf-grid" aria-label={`${platform.label} sections`}>
      {platform.sections.map((section) => (
        <a className="pf-card" href={`#${section.href}`} key={section.href}>
          <span className="pf-card__icon" aria-hidden>{SECTION_ICONS[section.key]}</span>
          <span className="pf-card__body">
            <span className="pf-card__name">
              {section.label}
              {section.status === 'live' && <span className="pf-chip pf-chip--live">Live</span>}
            </span>
            <span className="pf-card__desc">{section.desc}</span>
          </span>
          <span className="pf-card__arrow" aria-hidden>→</span>
        </a>
      ))}
    </section>
  )
}

function EmptySection({ platform, section }) {
  const live = platform.sections.find((item) => item.status === 'live')

  return (
    <section className="pf-empty" aria-label={`${section.label} — under construction`}>
      <div className="pf-empty__glyph" aria-hidden>{SECTION_ICONS[section.key]}</div>
      <h2 className="pf-empty__title">
        {section.label} is on the {platform.label} roadmap
      </h2>
      <p className="pf-empty__body">{section.empty}</p>
      <div className="pf-empty__ctas">
        <a className="pf-btn pf-btn--primary" href={`#/${platform.key}`}>
          Back to {platform.label}
        </a>
        {live && (
          <a className="pf-btn" href={`#${live.href}`}>
            See {live.label} →
          </a>
        )}
      </div>
    </section>
  )
}

export default function PlatformPage({ platformKey, sectionKey = null }) {
  const platform = PLATFORMS.find((entry) => entry.key === platformKey)
  if (!platform) return null

  const section = platform.sections.find((entry) => entry.key === sectionKey) ?? null
  const isHub = !section

  return (
    <main className="pf-page" id="top">
      <Navbar />

      <div className="pf-shell">
        <header className="pf-hero">
          <p className="pf-hero__eyebrow">
            {platform.eyebrow}
            {section ? ` · ${section.label}` : ''}
          </p>
          <h1 className="pf-hero__title">{section ? section.label : platform.title}</h1>
          <p className="pf-hero__sub">{section ? section.desc : platform.tagline}</p>
        </header>

        <PlatformNav />

        {isHub ? <HubGrid platform={platform} /> : <EmptySection platform={platform} section={section} />}
      </div>
    </main>
  )
}