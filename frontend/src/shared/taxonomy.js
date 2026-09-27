/**
 * AiO shared taxonomy — the single vocabulary the whole platform refers to.
 *
 * Instead of every catalog inventing its own strings, records carry the same
 * subject / skill keys from here. A subject like `react` can then be referenced
 * by a roadmap, a course, a book, a project, an interview question and a job,
 * and cross-links between them are plain lookups — no join tables or special
 * code needed.
 *
 * Two vocabularies, one file:
 *   - SUBJECTS — the flat list of the student-facing areas from the product
 *     brief (the six groups below are containers for presenting them).
 *   - SKILLS — the technical vocabulary catalogs cite (react, git, sql, …),
 *     each mapped onto the subjects it belongs to. Aliases make a "search for
 *     js" later resolve to JavaScript without custom per-query code.
 *
 * DIFFICULTIES and DSA_PATTERNS are shared enums the DSA arena and every
 * catalog grid reuse, so "beginner" and "two pointers" mean exactly one
 * thing across Learn and Career.
 *
 * The LEGACY_* tables at the bottom document how the older per-feature
 * category sets line up with this vocabulary, so a feature can adopt the
 * shared keys gradually (mapping, never deleting).
 */

/* ── Subjects ─────────────────────────────────────────────────────────────── */

/**
 * @typedef {{ key: string, label: string, description?: string }} Subject
 */

/** @type {Subject[]} Unique areas (35) from the product brief, in one flat list. */
export const SUBJECTS = [
  // Computer Science
  {
    key: 'computer-science',
    label: 'Computer Science',
    description: 'The core of computing — theory, systems and the mental models behind every other subject here.',
  },
  {
    key: 'dsa',
    label: 'Data Structures & Algorithms',
    description: 'Arrays to dynamic programming — the backbone of technical interviews and clean problem-solving.',
  },
  {
    key: 'operating-systems',
    label: 'Operating Systems',
    description: 'How machines manage processes, memory, files and concurrency under the hood.',
  },
  {
    key: 'dbms',
    label: 'DBMS',
    description: 'Designing, querying and tuning the databases every real product sits on.',
  },
  {
    key: 'computer-networks',
    label: 'Computer Networks',
    description: 'How data moves between machines — protocols, HTTP and the internet under the hood.',
  },
  {
    key: 'toc',
    label: 'Theory of Computation',
    description: 'Automata, formal languages and the deep question of what is even computable.',
  },
  {
    key: 'software-engineering',
    label: 'Software Engineering',
    description: 'Designing, testing and shipping software at a scale beyond a single script.',
  },
  {
    key: 'oop',
    label: 'Object-Oriented Programming',
    description: 'Classes, inheritance and the design instincts that survive messy real-world code.',
  },
  // Programming
  {
    key: 'c',
    label: 'C',
    description: 'The systems language — pointers, memory and the foundation underneath nearly everything.',
  },
  {
    key: 'cpp',
    label: 'C++',
    description: 'C with objects and templates — performance when you need it, and where most gaming happens.',
  },
  {
    key: 'java',
    label: 'Java',
    description: 'The enterprise workhorse — JVM, tooling and Android\u2019s native language.',
  },
  {
    key: 'python',
    label: 'Python',
    description: 'The fastest way from idea to working code — and the language of data and AI.',
  },
  {
    key: 'javascript',
    label: 'JavaScript',
    description: 'The language of the web — from a single button to an entire app.',
  },
  {
    key: 'typescript',
    label: 'TypeScript',
    description: 'JavaScript with types — the safer way to build anything larger than a toy.',
  },
  // Web Development
  {
    key: 'html',
    label: 'HTML',
    description: 'The skeleton of every web page — structure, semantics and accessibility.',
  },
  {
    key: 'css',
    label: 'CSS',
    description: 'The styling layer — layout, design systems and making interfaces feel right.',
  },
  {
    key: 'react',
    label: 'React',
    description: 'The component model behind modern interfaces — and this very app itself.',
  },
  {
    key: 'node',
    label: 'Node.js',
    description: 'JavaScript on the server — APIs, real-time apps and backend engineering.',
  },
  {
    key: 'backend',
    label: 'Backend',
    description: 'Servers, APIs, databases and everything that happens after the browser asks.',
  },
  // AI & Data
  {
    key: 'ai',
    label: 'Artificial Intelligence',
    description: 'Making computers do what looks like thinking — search, reasoning and agents.',
  },
  {
    key: 'machine-learning',
    label: 'Machine Learning',
    description: 'Teaching models from data instead of programming them rule by rule.',
  },
  {
    key: 'data-science',
    label: 'Data Science',
    description: 'Turning messy data into decisions — analysis, modelling and storytelling.',
  },
  {
    key: 'data-analytics',
    label: 'Data Analytics',
    description: 'Dashboards, metrics and the everyday questions data answers at work.',
  },
  {
    key: 'generative-ai',
    label: 'Generative AI',
    description: 'Models that create — text, images and code, plus how to build on top of them.',
  },
  // Cybersecurity
  {
    key: 'cybersecurity',
    label: 'Cybersecurity',
    description: 'Protecting systems and people from attackers — defence built from first principles.',
  },
  {
    key: 'network-security',
    label: 'Network Security',
    description: 'Firewalls, TLS and the traffic between machines when it is under attack.',
  },
  {
    key: 'cryptography',
    label: 'Cryptography',
    description: 'The math that keeps secrets — encryption, hashing and digital signatures.',
  },
  {
    key: 'web-security',
    label: 'Web Security',
    description: 'Finding and fixing the holes every web app ships with.',
  },
  {
    key: 'ethical-hacking',
    label: 'Ethical Hacking',
    description: 'Thinking like an attacker so you can close the door before they do.',
  },
  {
    key: 'digital-forensics',
    label: 'Digital Forensics',
    description: 'Recovering and analysing evidence from devices after an incident.',
  },
  // Mathematics
  {
    key: 'discrete-mathematics',
    label: 'Discrete Mathematics',
    description: 'The math of computer science — logic, sets, counting and graphs.',
  },
  {
    key: 'probability',
    label: 'Probability',
    description: 'Reasoning about uncertainty — the language of machine learning and statistics.',
  },
  {
    key: 'statistics',
    label: 'Statistics',
    description: 'Drawing sound conclusions from data — distributions, tests and honest error bars.',
  },
  {
    key: 'linear-algebra',
    label: 'Linear Algebra',
    description: 'Vectors and matrices — the engine room of modern computation and AI.',
  },
  {
    key: 'calculus',
    label: 'Calculus',
    description: 'Rates of change and optimisation — the floor beneath AI and engineering models.',
  },
]

/**
 * Established AiO domains that sit outside the six subject groups but recur
 * across the campus models (cloud, embedded, design, business, career). Kept
 * separate from SUBJECTS so the Subjects section stays true to the brief while
 * legacy catalogues still map onto a real shared key.
 */
export const EXTRA_SUBJECTS = [
  { key: 'cloud', label: 'Cloud & DevOps' },
  { key: 'embedded', label: 'Electronics & Embedded' },
  { key: 'design', label: 'Design' },
  { key: 'business', label: 'Business & Entrepreneurship' },
  { key: 'career', label: 'Career & Interviews' },
]

/** @type {Record<string, Subject>} */
export const SUBJECT_BY_KEY = Object.fromEntries(
  [...SUBJECTS, ...EXTRA_SUBJECTS].map((subject) => [subject.key, subject]),
)

/** @type {{ key: string, label: string, subjects: string[] }[]} */
export const SUBJECT_GROUPS = [
  {
    key: 'computer-science',
    label: 'Computer Science',
    subjects: ['computer-science', 'dsa', 'operating-systems', 'dbms', 'computer-networks', 'toc', 'software-engineering', 'oop'],
  },
  {
    key: 'programming',
    label: 'Programming',
    subjects: ['c', 'cpp', 'java', 'python', 'javascript', 'typescript'],
  },
  {
    key: 'web',
    label: 'Web Development',
    subjects: ['html', 'css', 'javascript', 'react', 'node', 'backend'],
  },
  {
    key: 'ai',
    label: 'AI & Data',
    subjects: ['ai', 'machine-learning', 'data-science', 'data-analytics', 'generative-ai'],
  },
  {
    key: 'cybersecurity',
    label: 'Cybersecurity',
    subjects: ['cybersecurity', 'network-security', 'cryptography', 'web-security', 'ethical-hacking', 'digital-forensics'],
  },
  {
    key: 'mathematics',
    label: 'Mathematics',
    subjects: ['discrete-mathematics', 'probability', 'statistics', 'linear-algebra', 'calculus'],
  },
]

export function subjectLabel(key) {
  return SUBJECT_BY_KEY[key]?.label ?? key
}

export function subjectKeysForGroup(groupKey) {
  return SUBJECT_GROUPS.find((group) => group.key === groupKey)?.subjects ?? []
}

export function groupForSubject(key) {
  return SUBJECT_GROUPS.find((group) => group.subjects.includes(key)) ?? null
}

/* ── Skills ───────────────────────────────────────────────────────────────── */

/**
 * @typedef {{ key: string, label: string, subjects: string[], aliases?: string[] }} Skill
 */

/**
 * The cross-link vocabulary. `subjects` says which subject areas a skill
 * belongs to; `aliases` are accepted spellings for search/normalisation.
 * Keep aliases lowercase and unpunctuated.
 */
export const SKILLS = [
  // Languages
  { key: 'c', label: 'C', subjects: ['c', 'embedded'], aliases: ['c language'] },
  { key: 'cpp', label: 'C++', subjects: ['cpp', 'embedded'], aliases: ['c++', 'cplusplus'] },
  { key: 'java', label: 'Java', subjects: ['java', 'oop'] },
  { key: 'python', label: 'Python', subjects: ['python', 'data-science', 'machine-learning', 'ai'], aliases: ['py'] },
  { key: 'javascript', label: 'JavaScript', subjects: ['javascript', 'web'], aliases: ['js'] },
  { key: 'typescript', label: 'TypeScript', subjects: ['typescript', 'web', 'javascript'], aliases: ['ts'] },
  { key: 'sql', label: 'SQL', subjects: ['dbms'], aliases: ['sql querying'] },
  { key: 'bash', label: 'Bash / Shell', subjects: ['operating-systems', 'cloud'], aliases: ['shell'] },
  { key: 'html', label: 'HTML', subjects: ['html', 'web'] },
  { key: 'css', label: 'CSS', subjects: ['css', 'web', 'design'] },
  // Web & backend
  { key: 'react', label: 'React', subjects: ['react', 'web', 'javascript'], aliases: ['reactjs', 'react.js'] },
  { key: 'node', label: 'Node.js', subjects: ['node', 'backend', 'web', 'javascript'], aliases: ['nodejs', 'node.js'] },
  { key: 'express', label: 'Express', subjects: ['node', 'backend'], aliases: ['express.js'] },
  { key: 'rest-apis', label: 'REST APIs', subjects: ['backend', 'node', 'web'], aliases: ['rest', 'api design'] },
  { key: 'graphql', label: 'GraphQL', subjects: ['backend', 'web'] },
  { key: 'web-security', label: 'Web Security', subjects: ['web-security', 'cybersecurity'], aliases: ['owasp'] },
  { key: 'docker', label: 'Docker', subjects: ['cloud', 'operating-systems'], aliases: ['containerization', 'containers'] },
  { key: 'kubernetes', label: 'Kubernetes', subjects: ['cloud'], aliases: ['k8s'] },
  { key: 'terraform', label: 'Terraform', subjects: ['cloud'] },
  { key: 'ci-cd', label: 'CI/CD', subjects: ['cloud', 'software-engineering'], aliases: ['pipelines', 'github actions'] },
  { key: 'linux', label: 'Linux', subjects: ['operating-systems', 'cloud', 'cybersecurity'] },
  { key: 'cloud', label: 'Cloud Platforms', subjects: ['cloud'], aliases: ['aws', 'gcp', 'azure'] },
  // Data & AI
  { key: 'git', label: 'Git', subjects: ['software-engineering', 'web'], aliases: ['version control'] },
  { key: 'pandas', label: 'pandas / NumPy', subjects: ['data-science', 'data-analytics', 'python'], aliases: ['pandas', 'numpy'] },
  { key: 'machine-learning', label: 'Machine Learning', subjects: ['machine-learning', 'ai'], aliases: ['ml'] },
  { key: 'deep-learning', label: 'Deep Learning', subjects: ['ai', 'machine-learning'], aliases: ['neural networks', 'dl'] },
  { key: 'pytorch', label: 'PyTorch', subjects: ['machine-learning', 'ai'] },
  { key: 'tensorflow', label: 'TensorFlow', subjects: ['machine-learning', 'ai'] },
  { key: 'generative-ai', label: 'Generative AI', subjects: ['generative-ai', 'ai'], aliases: ['llms', 'llm', 'genai'] },
  { key: 'data-visualization', label: 'Data Visualization', subjects: ['data-science', 'data-analytics'], aliases: ['dataviz'] },
  { key: 'statistics', label: 'Statistics', subjects: ['statistics', 'probability', 'data-science'] },
  { key: 'linear-algebra', label: 'Linear Algebra', subjects: ['linear-algebra', 'data-science', 'machine-learning'] },
  { key: 'calculus', label: 'Calculus', subjects: ['calculus', 'data-science', 'machine-learning'] },
  // Core CS
  { key: 'algorithms', label: 'Algorithms', subjects: ['dsa', 'computer-science'] },
  { key: 'data-structures', label: 'Data Structures', subjects: ['dsa', 'computer-science'] },
  { key: 'oop', label: 'OOP', subjects: ['oop', 'computer-science', 'java', 'cpp'], aliases: ['object-oriented'] },
  { key: 'operating-systems', label: 'Operating Systems', subjects: ['operating-systems', 'computer-science'], aliases: ['os'] },
  { key: 'networking', label: 'Computer Networks', subjects: ['computer-networks', 'computer-science'], aliases: ['networks', 'tcp/ip'] },
  { key: 'databases', label: 'Databases', subjects: ['dbms', 'backend'], aliases: ['database design'] },
  { key: 'system-design', label: 'System Design', subjects: ['software-engineering', 'backend', 'cloud'] },
  { key: 'debugging', label: 'Debugging', subjects: ['software-engineering', 'computer-science'] },
  { key: 'testing', label: 'Testing', subjects: ['software-engineering'], aliases: ['unit testing', 'pytest', 'jest'] },
  // Security
  { key: 'cybersecurity', label: 'Cybersecurity', subjects: ['cybersecurity'] },
  { key: 'cryptography', label: 'Cryptography', subjects: ['cryptography', 'cybersecurity'] },
  { key: 'network-security', label: 'Network Security', subjects: ['network-security', 'cybersecurity', 'networking'] },
  { key: 'ethical-hacking', label: 'Ethical Hacking', subjects: ['ethical-hacking', 'cybersecurity'], aliases: ['pentest', 'penetration testing'] },
  { key: 'digital-forensics', label: 'Digital Forensics', subjects: ['digital-forensics', 'cybersecurity'] },
  // Design & game
  { key: 'figma', label: 'Figma', subjects: ['design', 'web'] },
  { key: 'ui-ux', label: 'UI/UX', subjects: ['design', 'web'], aliases: ['user research', 'prototyping'] },
  { key: 'game-development', label: 'Game Development', subjects: ['cpp', 'embedded'], aliases: ['unity', 'godot', 'game dev'] },
  { key: 'embedded-c', label: 'Embedded C', subjects: ['c', 'embedded'], aliases: ['firmware', 'microcontroller'] },
]

/** @type {Record<string, Skill>} */
export const SKILL_BY_KEY = Object.fromEntries(SKILLS.map((skill) => [skill.key, skill]))

export function skillLabel(key) {
  return SKILL_BY_KEY[key]?.label ?? key
}

/** All skills a subject owns, sorted by label. */
export function skillsForSubject(subjectKey) {
  return SKILLS.filter((skill) => skill.subjects.includes(subjectKey)).sort((a, b) =>
    a.label.localeCompare(b.label),
  )
}

/**
 * Resolve a user-typed string to a skill key, or null. Matches a skill key or
 * label, then each alias, so catalog searches can normalize free text.
 */
export function findSkillKey(name) {
  const needle = String(name ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  if (!needle) return null
  const exact = SKILLS.find((skill) => skill.key.toLowerCase() === needle)
  if (exact) return exact.key
  const byLabel = SKILLS.find((skill) => skill.label.toLowerCase().replace(/[^a-z0-9]/g, '') === needle)
  if (byLabel) return byLabel.key
  const byAlias = SKILLS.find((skill) => (skill.aliases ?? []).includes(needle))
  return byAlias?.key ?? null
}

/* ── Difficulty ───────────────────────────────────────────────────────────── */

export const DIFFICULTIES = [
  { key: 'beginner', label: 'Beginner', rank: 0 },
  { key: 'intermediate', label: 'Intermediate', rank: 1 },
  { key: 'advanced', label: 'Advanced', rank: 2 },
]

export const DIFFICULTY_BY_KEY = Object.fromEntries(DIFFICULTIES.map((d) => [d.key, d]))

export function difficultyLabel(key) {
  return DIFFICULTY_BY_KEY[key]?.label ?? key
}

/* ── DSA patterns ─────────────────────────────────────────────────────────── */

/**
 * The practice-topics vocabulary for the DSA arena, grouped so filters and the
 * topic index can render organised chips without a switch statement.
 */
export const DSA_PATTERNS = [
  // Data-structure topics
  { key: 'arrays', label: 'Arrays', group: 'structures' },
  { key: 'strings', label: 'Strings', group: 'structures' },
  { key: 'linked-lists', label: 'Linked Lists', group: 'structures' },
  { key: 'stack', label: 'Stack', group: 'structures' },
  { key: 'queue', label: 'Queue', group: 'structures' },
  { key: 'binary-search', label: 'Binary Search', group: 'structures' },
  { key: 'trees', label: 'Trees', group: 'structures' },
  { key: 'bst', label: 'BST', group: 'structures' },
  { key: 'heap', label: 'Heap', group: 'structures' },
  { key: 'graphs', label: 'Graphs', group: 'structures' },
  // Derived & iterative techniques
  { key: 'hashing', label: 'Hashing', group: 'derived' },
  { key: 'two-pointers', label: 'Two Pointers', group: 'derived' },
  { key: 'sliding-window', label: 'Sliding Window', group: 'derived' },
  { key: 'prefix-sum', label: 'Prefix Sum', group: 'derived' },
  { key: 'intervals', label: 'Intervals', group: 'derived' },
  { key: 'sorting', label: 'Sorting', group: 'derived' },
  { key: 'bit-manipulation', label: 'Bit Manipulation', group: 'derived' },
  // Algorithmic strategies
  { key: 'recursion', label: 'Recursion', group: 'algorithmic' },
  { key: 'greedy', label: 'Greedy', group: 'algorithmic' },
  { key: 'backtracking', label: 'Backtracking', group: 'algorithmic' },
  { key: 'dynamic-programming', label: 'Dynamic Programming', group: 'algorithmic' },
]

export const DSA_PATTERN_BY_KEY = Object.fromEntries(DSA_PATTERNS.map((p) => [p.key, p]))

export function dsaPatternLabel(key) {
  return DSA_PATTERN_BY_KEY[key]?.label ?? key
}

export function dsaPatternsByGroup() {
  const groups = ['structures', 'derived', 'algorithmic']
  return groups
    .map((group) => ({
      group,
      patterns: DSA_PATTERNS.filter((pattern) => pattern.group === group),
    }))
    .filter((entry) => entry.patterns.length > 0)
}

/* ── Legacy reconciliation ────────────────────────────────────────────────── */

/**
 * How the Library's browse categories map onto the shared vocabulary. Kept
 * explicit so a future refactor can re-key `features/learn/library` without
 * guessing.
 */
export const LEGACY_LIBRARY_CATEGORIES = [
  { legacyKey: 'computer-science', sharedKey: 'computer-science' },
  { legacyKey: 'programming', sharedKey: 'programming' },
  { legacyKey: 'dsa', sharedKey: 'dsa' },
  { legacyKey: 'ai', sharedKey: 'ai' },
  { legacyKey: 'cybersecurity', sharedKey: 'cybersecurity' },
  { legacyKey: 'mathematics', sharedKey: 'mathematics' },
  { legacyKey: 'networking', sharedKey: 'computer-networks' },
  { legacyKey: 'os', sharedKey: 'operating-systems' },
  { legacyKey: 'databases', sharedKey: 'dbms' },
  { legacyKey: 'software-engineering', sharedKey: 'software-engineering' },
  { legacyKey: 'web', sharedKey: 'web' },
  { legacyKey: 'cloud', sharedKey: 'cloud' },
  { legacyKey: 'embedded', sharedKey: 'embedded' },
  { legacyKey: 'business', sharedKey: 'business' },
  { legacyKey: 'design', sharedKey: 'design' },
  { legacyKey: 'career', sharedKey: 'career' },
]

/**
 * How the Career catalogue's grid categories map onto the shared vocabulary.
 */
export const LEGACY_CAREER_CATEGORIES = [
  { legacyKey: 'software', sharedKey: 'software-engineering' },
  { legacyKey: 'ai', sharedKey: 'ai' },
  { legacyKey: 'cloud', sharedKey: 'cloud' },
  { legacyKey: 'cybersecurity', sharedKey: 'cybersecurity' },
  { legacyKey: 'engineering', sharedKey: 'embedded' },
  { legacyKey: 'design', sharedKey: 'design' },
]