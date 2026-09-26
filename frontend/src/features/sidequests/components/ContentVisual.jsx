/**
 * Generated card artwork.
 *
 * The seed has no `imageUrl` — pointing at external hosts would mean either
 * broken images offline or a dependency on somebody else's CDN — so a card's
 * visual is drawn from what it already knows: its type, its shelf, and its own
 * id. The result is a warm gradient plus a large, low-opacity type glyph.
 *
 * Deterministic by construction. `stableFraction(id)` picks a hue offset and a
 * corner emphasis, so a given card looks identical on every render and on every
 * device, and the shelf does not shimmer as it re-renders. Nothing is fetched,
 * nothing is bundled as an asset, and the whole thing collapses to a single
 * `<div>` for assistive technology.
 */
import { CATEGORY_META, contentTypeGlyph, stableFraction } from '../domain/sidequest-types'
import { Glyph } from './Glyph'

/**
 * @param {{
 *   item: { id: string, type: string, category: string, title?: string },
 *   ratio?: string,
 *   size?: 'sm' | 'md' | 'lg',
 * }} props
 */
export default function ContentVisual({ item, size = 'md' }) {
  const meta = CATEGORY_META[item.category] ?? CATEGORY_META.explore
  const seed = stableFraction(item.id)

  // Two stops drawn from the shelf's accent, rotated per item so no two cards
  // in a row look stamped from the same mould.
  const angle = Math.round(120 + seed * 90)
  const spread = 42 + Math.round(seed * 22)
  const lift = 6 + Math.round(seed * 10)
  const tilt = -8 + Math.round(seed * 16)

  const style = {
    '--sq-visual-angle': `${angle}deg`,
    '--sq-visual-a': `color-mix(in srgb, ${meta.accent} ${lift + 26}%, #fff6e6)`,
    '--sq-visual-b': `color-mix(in srgb, ${meta.accent} ${spread}%, #ffe9c9)`,
    '--sq-visual-tilt': `${tilt}deg`,
    '--sq-visual-origin-x': `${Math.round(18 + seed * 64)}%`,
  }

  return (
    <div
      className={`sq-visual sq-visual--${size}`}
      style={style}
      aria-hidden="true"
      data-type={item.type}
    >
      <span className="sq-visual__wash" />
      <Glyph
        name={contentTypeGlyph(item.type)}
        size={size === 'sm' ? 34 : size === 'lg' ? 72 : 52}
        className="sq-visual__glyph"
        strokeWidth={1.1}
      />
      <span className="sq-visual__rule" />
    </div>
  )
}
