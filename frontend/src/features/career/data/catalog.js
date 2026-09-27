/**
 * The browsable catalogue: categories, filters, student goals, coming-soon
 * entries, and helpers that read `data/roadmaps.js` into the landing grid.
 */

import { ROADMAPS } from './roadmaps.js'

// Ordered display categories. Every live roadmap is grouped under one of
// these on the landing page.
export const CATEGORIES = [
  { key: 'software', title: 'Software', blurb: 'Write the code that powers products' },
  { key: 'ai', title: 'AI & Data', blurb: 'Models, data, and AI-assisted building' },
  { key: 'cloud', title: 'Cloud & DevOps', blurb: 'Run and ship what you build' },
  { key: 'cybersecurity', title: 'Cybersecurity', blurb: 'Break it, then defend it' },
  { key: 'engineering', title: 'Engineering', blurb: 'Hardware-adjacent and systems work' },
  { key: 'design', title: 'Design & Product', blurb: 'Shape what users see and feel' },
]

// Filter chips shown above the grid. Maps directly onto roadmap `tags`.
export const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'career-path', label: 'Career Paths' },
  { key: 'technology', label: 'Technologies' },
  { key: 'ai', label: 'AI' },
  { key: 'cybersecurity', label: 'Cybersecurity' },
  { key: 'cloud', label: 'Cloud' },
  { key: 'software', label: 'Software' },
  { key: 'engineering', label: 'Engineering' },
  { key: 'design', label: 'Design' },
  { key: 'student-essentials', label: 'Student Essentials' },
]

// Shown as quick "why are you here" cards above the grid.
export const GOALS = [
  { key: 'internship', emoji: '🎯', title: 'Land an internship', blurb: 'Pick a path, follow it, ship proof.' },
  { key: 'placements', emoji: '🏆', title: 'Placement season', blurb: 'Prepare the skills interviewers filter by.' },
  { key: 'better-projects', emoji: '🛠️', title: 'Better projects', blurb: 'Turn semester work into something impressive.' },
  { key: 'new-technology', emoji: '🚀', title: 'Learn a new tech', blurb: 'Get from first run to shipped.' },
  { key: 'explore-careers', emoji: '🧭', title: 'Explore careers', blurb: 'Compare paths before committing.' },
  { key: 'job-ready', emoji: '💼', title: 'Get job-ready', blurb: 'From roadmap to interviews in one place.' },
]

// Promo cards that link to a coming-soon modal instead of a live roadmap.
export const COMING_SOON = [
  { key: 'android', label: 'Android Development', icon: '🤖' },
  { key: 'blockchain', label: 'Blockchain', icon: '⛓️' },
  { key: 'computer-vision', label: 'Computer Vision', icon: '👁️' },
  { key: 'python-for-beginners', label: 'Python for Beginners', icon: '🐍' },
  { key: 'django', label: 'Django', icon: '🎸' },
  { key: 'node', label: 'Node.js', icon: '🟩' },
  { key: 'react-native', label: 'React Native', icon: '📱' },
  { key: 'flutter', label: 'Flutter', icon: '🪁' },
]

export function getRoadmap(id) {
  return ROADMAPS.find((roadmap) => roadmap.id === id) ?? null
}

/** Roadmaps that are live (status omitted in data means "available"). */
export function isAvailable(roadmap) {
  return (roadmap.status ?? 'available') === 'available'
}

export function getCategoryEntries(key) {
  return ROADMAPS.filter((roadmap) => roadmap.category === key && isAvailable(roadmap))
}

/** Roadmaps whose tags include the given filter key (or all, or none). */
export function filterRoadmaps(key) {
  const all = ROADMAPS.filter(isAvailable)
  if (!key || key === 'all') return all
  return all.filter((roadmap) => roadmap.tags.includes(key))
}