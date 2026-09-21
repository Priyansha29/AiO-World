/**
 * Category metadata — single source of truth for labels, accents and the
 * empty-state copy shown for each campus information category.
 */

export const CAMPUS_CATEGORY_META = {
  notices: {
    label: 'Notices',
    blurb: 'Important announcements and official notices.',
    accent: 'var(--sand)',
    emptyTitle: 'No notices yet',
    emptyHint: 'Official announcements and notices will appear here.',
  },
  academic: {
    label: 'Academic',
    blurb: 'Classes, deadlines and the academic calendar.',
    accent: 'var(--coral)',
    emptyTitle: 'No academic updates yet',
    emptyHint: 'Timetables and deadlines will appear here.',
  },
  transport: {
    label: 'Transport',
    blurb: 'Bus routes, timings and route changes.',
    accent: 'var(--peach)',
    emptyTitle: 'No transport updates yet',
    emptyHint: 'Bus routes and timings will appear here.',
  },
  mess: {
    label: 'Mess',
    blurb: 'Menus and mess announcements.',
    accent: 'var(--sand)',
    emptyTitle: 'No mess updates yet',
    emptyHint: 'Daily menus and mess announcements will appear here.',
  },
  events: {
    label: 'Events',
    blurb: 'Festivals, hackathons, workshops and clubs.',
    accent: 'var(--coral)',
    emptyTitle: 'Your campus hasn\u2019t published any events here yet',
    emptyHint: 'When clubs and councils post events, they\u2019ll show up here.',
  },
  opportunities: {
    label: 'Opportunities',
    blurb: 'Internships, scholarships and placements.',
    accent: 'var(--accent)',
    emptyTitle: 'No opportunities here yet',
    emptyHint: 'Internships, competitions and placements will appear here.',
  },
}

export const CAMPUS_CATEGORY_LIST = Object.entries(CAMPUS_CATEGORY_META).map(
  ([id, meta]) => ({ id, ...meta }),
)

/** Human-readable labels for source types. All demo content is explicitly
 *  framed as sample/demo — no "official" or "live" wording. */
export const SOURCE_TYPE_LABELS = {
  OFFICIAL_WEBSITE: 'Sample website',
  OFFICIAL_NOTICE: 'Sample notice',
  MOODLE: 'Demo moodle',
  EMAIL: 'Demo email',
  GOOGLE_CLASSROOM: 'Demo classroom',
  COLLEGE_PORTAL: 'Sample portal',
  STUDENT_SUBMISSION: 'Demo submission',
}