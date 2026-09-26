/**
 * The save-for-later bookmark.
 *
 * A real `<button>` with `aria-pressed`, so it is reachable by keyboard and
 * announces its state rather than relying on a filled outline to convey it. The
 * visible label is "Save"/"Saved" rather than an icon alone — an unlabelled
 * glyph is a guess, and a bookmark icon can mean "save" or "read later"
 * depending on who drew it.
 */
import { Glyph } from './Glyph'

/**
 * @param {{
 *   saved: boolean,
 *   busy?: boolean,
 *   onToggle: (item: object) => void,
 *   item: object,
 * }} props
 */
export default function SaveButton({ saved, busy = false, onToggle, item }) {
  return (
    <button
      type="button"
      className={`sq-save${saved ? ' sq-save--on' : ''}`}
      onClick={() => onToggle(item)}
      aria-pressed={saved}
      aria-label={saved ? `Remove "${item.title}" from saved` : `Save "${item.title}" for later`}
      disabled={busy}
    >
      <Glyph name={saved ? 'book' : 'resource'} size={15} />
      <span>{saved ? 'Saved' : 'Save'}</span>
    </button>
  )
}
