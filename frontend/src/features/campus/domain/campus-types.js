/**
 * Campus domain model (frontend mirror).
 *
 * The canonical contract lives in `backend/src/domain/campus.ts`. These
 * typedefs mirror it in JS so the UI and the future API responses share the
 * same shapes. Keep both files in sync when the model evolves.
 */

export const CAMPUS_CATEGORIES = [
  'notices',
  'academic',
  'transport',
  'mess',
  'events',
  'opportunities',
]

export const CAMPUS_PRIORITIES = ['low', 'normal', 'high', 'urgent']

export const INFORMATION_STATUSES = ['active', 'superseded', 'expired', 'draft']

export const SOURCE_TYPES = [
  'OFFICIAL_WEBSITE',
  'OFFICIAL_NOTICE',
  'MOODLE',
  'EMAIL',
  'GOOGLE_CLASSROOM',
  'COLLEGE_PORTAL',
  'STUDENT_SUBMISSION',
]

export const PRIORITY_RANK = { urgent: 0, high: 1, normal: 2, low: 3 }

/**
 * @typedef {Object} College
 * @property {string} id
 * @property {string} name
 * @property {string} [abbreviation]
 * @property {string} city
 * @property {string} state
 * @property {string} [university]
 * @property {number} [established]
 * @property {string} [website]
 */

/**
 * @typedef {Object} InformationSource
 * @property {string} id
 * @property {string} name
 * @property {string} type  — one of `SOURCE_TYPES`
 * @property {string} [url]
 */

/**
 * A single piece of campus information with full provenance.
 * @typedef {Object} CampusInformation
 * @property {string} id
 * @property {string} collegeId
 * @property {string} title
 * @property {string} description
 * @property {string} category            — one of `CAMPUS_CATEGORIES`
 * @property {string} priority            — one of `CAMPUS_PRIORITIES`
 * @property {string} status              — one of `INFORMATION_STATUSES`
 * @property {InformationSource} source
 * @property {string} publishedAt         — ISO-8601
 * @property {string} updatedAt           — ISO-8601
 * @property {string} [effectiveFrom]
 * @property {string} [effectiveUntil]
 * @property {string} [supersedesId]
 * @property {string} [supersededById]
 * @property {string} [link]
 * @property {Record<string,string>} [metadata]
 * @property {boolean} [featured]  — demo-feed pin shown first (front-end only)
 */