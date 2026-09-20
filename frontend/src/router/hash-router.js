/**
 * Minimal hash router.
 *
 * AiO World currently navigates with in-page `#hash` anchors (e.g. `#learn`).
 * To add real pages without a new dependency we layer a tiny hash router on
 * top: routes look like `#/setup` and `#/campus`. Everything else resolves to
 * the home page, preserving the existing anchor-links behaviour.
 *
 * When the app later adopts react-router, only this module and App.jsx change.
 */
import { useEffect, useState } from 'react'

const ROUTES = ['/campus', '/setup']

/** Normalize `location.hash` into a route path ('' or '/#…' map to '/'). */
export function getRoute() {
  const hash = window.location.hash.replace(/^#/, '')
  if (ROUTES.some((route) => hash === route || hash.startsWith(`${route}/`))) {
    return hash.split('?')[0]
  }
  return '/'
}

/** Navigate to a route, e.g. navigate('/campus'). */
export function navigate(path) {
  window.location.hash = path
}

/** Reactive route state. Re-renders the app on every hash change. */
export function useHashRoute() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}