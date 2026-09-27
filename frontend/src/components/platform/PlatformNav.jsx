/**
 * PlatformNav — the single section-navigation strip shared by every Learn and
 * Career page (hub, section and live content pages alike). It derives its
 * platform + active section from the current route, so there is exactly one
 * navigation component for both platforms and no duplicates anywhere.
 */
import { PLATFORMS } from './platform-data'
import { useHashRoute } from '../../router/hash-router'
import './platform.css'

function platformForRoute(route) {
  if (route === '/learn' || route.startsWith('/learn/')) return PLATFORMS[0]
  if (route === '/career' || route.startsWith('/career/')) return PLATFORMS[1]
  return null
}

function PlatformNav() {
  const route = useHashRoute()
  const platform = platformForRoute(route)

  if (!platform) return null
  const hubHref = `#/${platform.key}`

  return (
    <nav className="pf-nav" aria-label={`${platform.label} sections`}>
      <a
        className={`pf-nav__item${route === `/${platform.key}` ? ' pf-nav__item--active' : ''}`}
        href={hubHref}
      >
        {platform.label} home
      </a>
      {platform.sections.map((section) => (
        <a
          key={section.href}
          className={`pf-nav__item${route === section.href || route.startsWith(`${section.href}/`) ? ' pf-nav__item--active' : ''}`}
          href={`#${section.href}`}
        >
          {section.label}
          {section.status === 'live' && <span className="pf-nav__live">Live</span>}
        </a>
      ))}
    </nav>
  )
}

export default PlatformNav