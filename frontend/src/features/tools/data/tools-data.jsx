export const TOOL_CATEGORIES = [
  {
    key: 'academic',
    label: 'Academic',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 9 12 5 2 9l10 4 10-4Z" />
        <path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" />
        <path d="M22 9v7" />
      </svg>
    ),
  },
  {
    key: 'career',
    label: 'Career',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="8" width="18" height="12" rx="1" />
        <path d="M9 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        <path d="M3 13h18" />
      </svg>
    ),
  },
  {
    key: 'developer',
    label: 'Developer',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m8 7-4 5 4 5" />
        <path d="m16 7 4 5-4 5" />
        <path d="m13.5 5-3 14" />
      </svg>
    ),
  },
  {
    key: 'networking',
    label: 'Networking',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="5" r="2" />
        <circle cx="5" cy="19" r="2" />
        <circle cx="19" cy="19" r="2" />
        <path d="M12 7v4M5 17v-2a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2" />
      </svg>
    ),
  },
  {
    key: 'general',
    label: 'General',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14.7 6.3a4.5 4.5 0 0 0-6.4 5.4L3 17l4 4 5.3-5.3a4.5 4.5 0 0 0 5.4-6.4l-3 3-2-2 3-3Z" />
      </svg>
    ),
  },
]

export const TOOL_CATEGORY_ORDER = TOOL_CATEGORIES.map((category) => category.key)

export function toolCategory(key) {
  return TOOL_CATEGORIES.find((category) => category.key === key) ?? { label: key, icon: null }
}

export function toolCategoryIcon(key) {
  return toolCategory(key).icon
}

export const TOOLS = [
  {
    id: 'cgpa-calculator',
    title: 'CGPA & SGPA Calculator',
    description: 'Average your semester with credits and grades, then plan the SGPA you need to hit a target CGPA.',
    category: 'academic',
    status: 'live',
    tags: ['cgpa', 'sgpa', 'gpa', 'grade', 'credit'],
    keywords: ['sgpa', 'percentage', 'result', 'semester', 'target'],
  },
  {
    id: 'attendance-calculator',
    title: 'Attendance Calculator',
    description: 'Your current attendance percentage, how many classes you can still miss, and what it takes to recover.',
    category: 'academic',
    status: 'live',
    tags: ['attendance', 'percentage', 'skip', 'classes'],
    keywords: ['75%', 'bunk', 'shortage', 'recover'],
  },
  {
    id: 'sgpa-calculator',
    title: 'SGPA Calculator',
    description: 'One-semester grade-point average from marks, credits and grading blocks.',
    category: 'academic',
    status: 'planned',
    tags: ['sgpa', 'grade', 'semester'],
    empty: 'This is where a single-semester SGPA calculator will live — enter subject grades and credits and read the semester average. The math is already decided; the form is being built.',
  },
  {
    id: 'relative-grading-calculator',
    title: 'Relative Grading Calculator',
    description: 'See where you land relative to the class — average, spread, percentile, rank, z-score and your own grade boundaries.',
    category: 'academic',
    status: 'live',
    tags: ['grading', 'curve', 'relative'],
    keywords: ['z-score', 'percentile', 'rank', 'mean', 'median', 'standard deviation', 'boundary', 'distribution'],
  },
  {
    id: 'marks-percentage-calculator',
    title: 'Marks / Percentage Calculator',
    description: 'Obtained-to-total percentage, percent of a number, change, and reverse percentage in one calculator.',
    category: 'academic',
    status: 'live',
    tags: ['marks', 'percentage', 'result'],
    keywords: ['percent', 'increase', 'decrease', 'change', 'reverse', 'of'],
  },
  {
    id: 'ats-scanner',
    title: 'ATS Scanner',
    description: 'Check how your resume scores against a job description before you apply.',
    category: 'career',
    status: 'planned',
    tags: ['ats', 'resume', 'apply'],
    empty: 'This is where the ATS check will happen — paste a resume and a job description, and see how it scans. It is an AiO heuristic to guide your editing, never a verdict.',
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    description: 'Turn your details into a clean, ATS-friendly resume with a live preview.',
    category: 'career',
    status: 'planned',
    tags: ['resume', 'ats', 'preview'],
    empty: 'This is where resume building will happen — structure, phrasing and a live preview so yours survives the eight-second scan. The builder is coming.',
  },
  {
    id: 'salary-ctc-calculator',
    title: 'Salary / CTC Calculator',
    description: 'Break a CTC offer into in-hand monthly salary after deductions.',
    category: 'career',
    status: 'planned',
    tags: ['salary', 'ctc', 'in-hand', 'offer'],
    empty: 'This is where CTC breakdowns will live — separating gross, deductions, perks and probable in-hand pay so an offer letter reads clearly. The model is being written carefully.',
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Pretty-print, validate and minify JSON in the browser.',
    category: 'developer',
    status: 'live',
    tags: ['json', 'format', 'validate', 'pretty'],
    keywords: ['minify', 'indent', 'pretty-print', 'error', 'compact', 'parse'],
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester',
    description: 'Write and test a regular expression against live sample text.',
    category: 'developer',
    status: 'live',
    tags: ['regex', 'pattern', 'test'],
    keywords: ['capture', 'flags', 'global', 'highlight', 'groups', 'i'],
  },
  {
    id: 'base64-encoder-decoder',
    title: 'Base64 Encoder / Decoder',
    description: 'Encode and decode text to and from Base64 instantly.',
    category: 'developer',
    status: 'live',
    tags: ['base64', 'encode', 'decode'],
    keywords: ['unicode', 'utf-8', 'text', 'convert'],
  },
  {
    id: 'url-encoder-decoder',
    title: 'URL Encoder / Decoder',
    description: 'Encode or decode URL components and query strings safely.',
    category: 'developer',
    status: 'live',
    tags: ['url', 'encode', 'decode', 'query'],
    keywords: ['percent-encoding', 'percent', 'uri', 'component', '%20'],
  },
  {
    id: 'timestamp-converter',
    title: 'Timestamp Converter',
    description: 'Convert Unix timestamps to readable dates and back.',
    category: 'developer',
    status: 'live',
    tags: ['timestamp', 'unix', 'date', 'epoch'],
  },
  {
    id: 'color-converter',
    title: 'Color Converter',
    description: 'Convert between HEX, RGB and HSL, with a preview swatch.',
    category: 'developer',
    status: 'live',
    tags: ['color', 'hex', 'rgb', 'hsl', 'css'],
  },
  {
    id: 'subnet-calculator',
    title: 'Subnet Calculator',
    description: 'Split a network into subnets and read usable host counts.',
    category: 'networking',
    status: 'live',
    tags: ['subnet', 'network', 'cidr'],
  },
  {
    id: 'ip-cidr-calculator',
    title: 'IP / CIDR Calculator',
    description: 'Expand a CIDR block into its address range and details.',
    category: 'networking',
    status: 'live',
    tags: ['ip', 'cidr', 'range', 'host'],
  },
  {
    id: 'data-rate-utilities',
    title: 'Data-rate Utilities',
    description: 'Convert between bits, bytes and network speeds.',
    category: 'networking',
    status: 'planned',
    tags: ['data', 'rate', 'bandwidth', 'conversion'],
    empty: 'This is where data-rate conversions will live — Mbps, MBps, Gbps and latency shorthand so specs stop being ambiguous. The utilities are coming.',
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert length, mass, temperature and more in one place.',
    category: 'general',
    status: 'planned',
    tags: ['unit', 'convert', 'length', 'mass', 'temperature'],
    empty: 'This is where the unit converter will live — length, mass, temperature, area, volume and the everyday families. The converter is coming.',
  },
  {
    id: 'currency-converter',
    title: 'Currency Converter',
    description: 'Convert between currencies at a rate you check yourself.',
    category: 'general',
    status: 'planned',
    tags: ['currency', 'exchange', 'money'],
    empty: 'This is where the currency converter will live. It will use rates you provide or the latest official reference rate — no live feed without a verified source. The converter is being designed.',
  },
  {
    id: 'timezone-converter',
    title: 'Time Zone Converter',
    description: 'Compare times across zones before you schedule anything.',
    category: 'general',
    status: 'planned',
    tags: ['timezone', 'time', 'schedule'],
    empty: 'This is where the time zone converter will live — pick two zones and read overlapping hours, or convert a specific time. The converter is coming.',
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    description: 'Percentage of, percentage change and reverse percentage.',
    category: 'general',
    status: 'planned',
    tags: ['percentage', 'percent', 'change'],
    empty: 'This is where the general percentage calculator will live — what X% of Y is, percentage increase and decrease, and finding the base from a percentage. The calculator is coming.',
  },
]

export function findTool(toolId) {
  return TOOLS.find((tool) => tool.id === toolId) ?? null
}

export function toolGroupFilter() {
  return [
    {
      key: 'category',
      label: 'Category',
      options: TOOL_CATEGORY_ORDER.map((key) => ({
        value: key,
        label: toolCategory(key).label,
        count: TOOLS.filter((tool) => tool.category === key).length,
      })),
    },
  ]
}

export function toolStatusLabel(tool) {
  return tool.status === 'live' ? { label: 'Live', live: true } : { label: 'Planned', live: false }
}