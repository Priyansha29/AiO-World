/**
 * Resume Builder domain logic and data model.
 * All data stays in the browser (localStorage). No external API calls.
 */

export const STORAGE_KEY = 'aioworld.resume.builder'

export const DEFAULT_TEMPLATE = 'single-column'

export const TEMPLATES = [
  {
    id: 'single-column',
    label: 'Single Column (ATS-friendly)',
    description: 'Clean, one-column layout optimized for parsing.',
  },
  {
    id: 'two-column',
    label: 'Two Column (Compact)',
    description: 'Contact + skills on left, content on right.',
  },
]

export const createEmptyResume = () => ({
  personal: {
    fullName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: {
    technical: '',
    tools: '',
    other: '',
  },
  certifications: [],
  updatedAt: Date.now(),
})

export const loadResume = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return createEmptyResume()
    }
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createEmptyResume()
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      const base = createEmptyResume()
      return { ...base, ...parsed, personal: { ...base.personal, ...(parsed.personal || {}) }, skills: { ...base.skills, ...(parsed.skills || {}) } }
    }
    return createEmptyResume()
  } catch {
    return createEmptyResume()
  }
}

export const saveResume = (resume) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    const toSave = { ...resume, updatedAt: Date.now() }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch {
    // ignore persistence errors
  }
}

export const clearResume = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}