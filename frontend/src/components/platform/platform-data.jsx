/**
 * Platform structure — the Learn and Career sections as data.
 *
 * This file is the single source of truth for both platforms: their section
 * list, hub hero copy, and which sections are already live. Routes are
 * derived from `href`, the shared sub-navigation renders from `sections`,
 * and the hub grids and empty states read from the same records — so adding
 * a section later is a data edit, never a new component.
 *
 * No content is invented here: `status: 'planned'` sections render a
 * professional empty state instead of fake resources.
 */

/** Small stroke icon set keyed by section. Keep each glyph a simple path. */
export const SECTION_ICONS = {
  subjects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  ),
  notes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 3h9l4 4v14H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h5" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  ),
  courses: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  certifications: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="9" r="5" />
      <path d="m9 13-2 8 5-3 5 3-2-8" />
    </svg>
  ),
  library: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" />
      <path d="M19 18H6a2 2 0 0 0-2 2" />
      <path d="M9 7h6" />
    </svg>
  ),
  dsa: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m4 18 5-6 4 4 7-9" />
      <path d="M15 7h5v5" />
    </svg>
  ),
  roadmaps: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M6 8v6a4 4 0 0 0 4 4" />
      <path d="M18 8v4" />
    </svg>
  ),
  interviews: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12Z" />
      <path d="M8.5 10h.01M12 10h.01M15.5 10h.01" />
    </svg>
  ),
  companies: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="7" width="16" height="13" rx="1" />
      <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      <path d="M4 12h16" />
    </svg>
  ),
  resume: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 3h9l4 4v14H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h5" />
      <path d="M9 12h6M9 15.5h6M9 8.5h2" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v8" />
      <path d="m4 13 8 8 8-8" />
      <path d="M12 21V11" />
    </svg>
  ),
}

/**
 * The two platform hubs. `title`/`tagline` are hub hero copy; each section
 * carries a card description (`desc`) and, when planned, honest empty-state
 * copy (`empty`) stating what belongs there — nothing else.
 */
export const PLATFORMS = [
  {
    key: 'learn',
    label: 'Learn',
    eyebrow: 'Learn',
    title: 'Learn something today.',
    tagline:
      'Subjects, notes, courses, certifications, the AiO book library and a DSA arena — the whole learning side of AiO World, in one place.',
    sections: [
      {
        key: 'subjects',
        label: 'Subjects',
        href: '/learn/subjects',
        status: 'planned',
        desc: 'Curated subject guides and topic collections, grouped and searchable.',
        empty:
          'This is where curated subject guides and topic collections will live — grouped, searchable, and tied into the AiO book library. The structure is in place; the guides are being written.',
      },
      {
        key: 'notes',
        label: 'Notes',
        href: '/learn/notes',
        status: 'planned',
        desc: 'Personal study notes, saved and searchable.',
        empty:
          'This is where your own study notes will be kept — organised, searchable and attached to the subject or book they came from. Nothing has been saved here yet.',
      },
      {
        key: 'courses',
        label: 'Courses',
        href: '/learn/courses',
        status: 'planned',
        desc: 'Structured online courses to follow from start to finish.',
        empty:
          'This is where structured courses will be listed — each one a clear sequence from first lesson to done, with the book library backing it up. Courses are being curated.',
      },
      {
        key: 'certifications',
        label: 'Certifications',
        href: '/learn/certifications',
        status: 'planned',
        desc: 'Pathways toward certification, with prep targets.',
        empty:
          'This is where certification pathways will live — which exams are worth it, what they cover, and a prep plan for each. Nothing has been mapped yet.',
      },
      {
        key: 'library',
        label: 'Library',
        href: '/learn/library',
        status: 'live',
        desc: 'The AiO book library — browse, search, read and bookmark.',
        empty: '',
      },
      {
        key: 'dsa',
        label: 'DSA',
        href: '/learn/dsa',
        status: 'planned',
        desc: 'Data structures and algorithms — practice, patterns and problems.',
        empty:
          'This is where the DSA practice arena will live — patterns, problems and the theory you need behind each one. The arena is being built; the books underneath are already in the library.',
      },
    ],
  },
  {
    key: 'career',
    label: 'Career',
    eyebrow: 'Career',
    title: 'Start where the syllabus ends.',
    tagline:
      'Roadmaps, interviews, target companies, a resume you control and portfolio-grade projects — the job-hunting side of AiO World, organised.',
    sections: [
      {
        key: 'roadmaps',
        label: 'Roadmaps',
        href: '/career/roadmaps',
        status: 'live',
        desc: 'Fifteen career paths and tech tracks, stage by stage.',
        empty: '',
      },
      {
        key: 'interviews',
        label: 'Interviews',
        href: '/career/interviews',
        status: 'planned',
        desc: 'Interview prep — questions, patterns and mock rounds.',
        empty:
          'This is where interview prep will live — question banks, response patterns and mock rounds to practise before the real thing. Prep is being assembled.',
      },
      {
        key: 'companies',
        label: 'Companies',
        href: '/career/companies',
        status: 'planned',
        desc: 'Target companies and what they look for.',
        empty:
          'This is where target companies will be profiled — what they hire for, the skills they weight and how students usually land there. Company notes are being gathered.',
      },
      {
        key: 'resume',
        label: 'Resume',
        href: '/career/resume',
        status: 'planned',
        desc: 'Build a resume that survives the first scan.',
        empty:
          'This is where resume building will happen — structure, phrasing and a live preview so yours survives the eight-second scan. The builder is coming.',
      },
      {
        key: 'projects',
        label: 'Projects',
        href: '/career/projects',
        status: 'planned',
        desc: 'Portfolio-grade projects with guided specs.',
        empty:
          'This is where portfolio-grade projects will live — guided briefs from idea to deployed, sized for a semester. The first briefs are being written.',
      },
    ],
  },
]

/** Resolve a platform + section from a route path, or null when not a section. */
export function findPlatformSection(route) {
  for (const platform of PLATFORMS) {
    for (const section of platform.sections) {
      if (section.href === route) return { platform, section }
    }
  }
  return null
}