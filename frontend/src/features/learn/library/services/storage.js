/**
 * Supabase storage seam for library files.
 *
 * AiO has no Supabase project configured today, so this module is the single
 * contract the rest of the feature talks to. It builds a public file URL from
 * a `storagePath` using only optional env vars — never hard-coded credentials,
 * never a service-role key in frontend code.
 *
 * Required configuration (documented in the feature README):
 *
 *   VITE_SUPABASE_URL      the project URL
 *   VITE_SUPABASE_ANON_KEY the public anon key
 *
 * Bucket: `library`, expected layout:
 *
 *   library/
 *     books/
 *       computer-science/*.pdf
 *       programming/*.pdf
 *       ...
 *
 * Until those env vars exist, `getPublicFileUrl` returns null and hosted
 * books without demo text render an honest "file not uploaded yet" state in
 * the reader instead of a broken link. No raw Supabase URL ever appears in a
 * component.
 */

const LIBRARY_BUCKET = 'library'

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '')
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

/** True when a Supabase project URL + key are configured. */
export function hasStorageConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

/**
 * Public URL for a file inside the library bucket, or null when storage is
 * not configured (or the path is missing).
 *
 * @param {string|undefined} storagePath e.g. "library/books/programming/x.pdf"
 * @returns {string|null}
 */
export function getPublicFileUrl(storagePath) {
  if (!storagePath || !hasStorageConfigured()) return null
  const path = storagePath.startsWith(`${LIBRARY_BUCKET}/`) ? storagePath : `${LIBRARY_BUCKET}/${storagePath}`
  return `${SUPABASE_URL}/storage/v1/object/public/${path}`
}