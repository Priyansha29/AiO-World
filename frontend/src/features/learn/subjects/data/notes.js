/**
 * Subject study notes index — which files exist for which subject.
 *
 * Notes are uploaded to the public Supabase `Files` bucket under
 * `Subjects/<Subject Name>/`; the file is genuinely hosted there (public URL),
 * and this module is the small manifest that says what is available. Adding a
 * note is one line here + an upload to the folder — the detail page picks both
 * up automatically through `services/notes.js`.
 *
 * The folder defaults to the subject's taxonomy label; the `folder` field
 * overrides it when the uploaded folder name differs (e.g. "Computer
 * Networking" for the `computer-networks` subject).
 */
export const SUBJECT_NOTES = {
  'computer-networks': {
    folder: 'Computer Networking',
    files: ['Computer Networking Notes for Tech Placements (1).pdf'],
  },
}

/** True when a subject has at least one note file listed. */
export function hasSubjectNotes(subjectKey) {
  return Boolean(SUBJECT_NOTES[subjectKey]?.files?.length)
}