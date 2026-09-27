/**
 * Supabase storage seam for subject study notes.
 *
 * Notes live in the public `Files` bucket (`Subjects/<Subject Name>/`) and are
 * listed in `data/notes.js`. This module is the single contract the Subjects
 * feature uses to turn that manifest into working download URLs — the public
 * bucket needs no API key, no SDK and no server-side config, so it builds URLs
 * from `VITE_SUPABASE_URL` and never hard-codes a URL or credential in a
 * component.
 *
 * Optional configuration (documented in the feature README + `.env.example`):
 *
 *   VITE_SUPABASE_URL      the project URL
 *
 * Without `VITE_SUPABASE_URL`, `getSubjectNotes` returns `[]` and the detail
 * page keeps its honest "no notes yet" state instead of a broken link.
 */

const NOTES_BUCKET = 'Files'
const NOTES_ROOT = 'Subjects'

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '')

/** True when the project URL is configured (public download links work). */
export function hasNotesConfigured() {
  return Boolean(SUPABASE_URL)
}

/**
 * Public download URL for one object in the notes bucket.
 *
 * @param {string} folder relative path, e.g. "Subjects/Computer Networking"
 * @param {string} name     object name, e.g. "…Notes…(1).pdf"
 * @returns {string}
 */
export function getNoteUrl(folder, name) {
  const encoded = [...folder.split('/'), name].map(encodeURIComponent).join('/')
  return `${SUPABASE_URL}/storage/v1/object/public/${NOTES_BUCKET}/${encoded}`
}

/**
 * A subject's study notes as open-in-new-tab PDF links.
 *
 * Reads the manifest in `data/notes.js`: the folder name (the subject's label,
 * or an override), then one URL per listed file. Returns `[]` when storage is
 * not configured or the subject has no notes — the page then shows its honest
 * empty state rather than a broken or faked link.
 *
 * @param {{ key: string }} subject
 * @returns {Array<{ name: string, url: string }>}
 */
export function getSubjectNotes(subject) {
  if (!hasNotesConfigured() || !subject) return []

  const files = subject.notes
  if (!files?.length) return []

  const folder = `${NOTES_ROOT}/${subject.notesFolder ?? subject.label}`
  return files.map((name) => ({ name, url: getNoteUrl(folder, name) }))
}