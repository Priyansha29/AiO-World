import { formatNumber } from './percentage.js'

const DECIMAL = /^[+-]?(\d+(\.\d*)?|\.\d+)$/

function toNumber(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return null
  if (!DECIMAL.test(raw.trim())) return null
  const value = Number(raw)
  return Number.isFinite(value) ? value : null
}

export function parseClassMarks(raw) {
  const tokens = raw.split(/[\s,]+/).filter((token) => token.trim() !== '')
  const marks = []
  for (const token of tokens) {
    const value = toNumber(token)
    if (value == null) return { ok: false, invalid: token.trim() }
    marks.push(value)
  }
  return { ok: true, marks }
}

export function validateRelativeGrading(raw) {
  const errors = {}
  let max = null
  let student = null
  let marks = null

  if (typeof raw.max === 'string' && raw.max.trim() !== '') {
    const value = toNumber(raw.max)
    if (value == null) errors.max = 'Maximum marks must be a number.'
    else if (value <= 0) errors.max = 'Maximum marks must be greater than zero.'
    else max = value
  }

  if (typeof raw.student === 'string') {
    if (raw.student.trim() === '') errors.student = 'Enter your marks.'
    else {
      const value = toNumber(raw.student)
      if (value == null) errors.student = 'Your marks must be a number.'
      else if (value < 0) errors.student = 'Marks cannot be negative.'
      else if (max != null && value > max) errors.student = `Your marks cannot exceed the maximum (${formatNumber(max)}).`
      else student = value
    }
  }

  if (typeof raw.classRaw === 'string') {
    if (raw.classRaw.trim() === '') errors.classRaw = 'Enter at least one class mark.'
    else {
      const parsed = parseClassMarks(raw.classRaw)
      if (!parsed.ok) errors.classRaw = `"${parsed.invalid}" is not a valid mark.`
      else if (parsed.marks.some((mark) => mark < 0)) errors.classRaw = 'Class marks cannot be negative.'
      else if (max != null && parsed.marks.some((mark) => mark > max)) errors.classRaw = `Class marks cannot exceed the maximum (${formatNumber(max)}).`
      else marks = parsed.marks
    }
  }

  const boundaries = raw.boundaries
    ? raw.boundaries
        .filter((boundary) => boundary != null)
        .map((boundary) => ({
          id: boundary.id,
          label: String(boundary.label ?? '').trim(),
          min: String(boundary.min ?? '').trim(),
        }))
    : []

  let boundaryErrors = null
  if (raw.method === 'boundaries') {
    boundaryErrors = boundaries.map((boundary) => {
      if (boundary.label === '') return 'Name required.'
      if (boundary.min !== '') {
        const value = toNumber(boundary.min)
        if (value == null) return 'Must be a number.'
        if (value < 0) return 'Cannot be negative.'
      }
      return ''
    })
    if (boundaryErrors.some((message) => message !== '')) errors.boundaries = boundaryErrors
  }

  const normalizedBoundaries = boundaries.map((boundary) => ({
    id: boundary.id,
    label: boundary.label,
    min: boundary.min === '' ? null : toNumber(boundary.min),
  }))

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, values: { student, marks, max, boundaries: normalizedBoundaries } }
}

export function computeStatistics(marks) {
  const n = marks.length
  if (n === 0) return null
  const sorted = [...marks].sort((a, b) => a - b)
  const sum = sorted.reduce((total, mark) => total + mark, 0)
  const mean = sum / n
  const variance = sorted.reduce((total, mark) => total + (mark - mean) ** 2, 0) / n
  return {
    n,
    mean,
    median: n % 2 === 1 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2,
    highest: sorted[n - 1],
    lowest: sorted[0],
    sd: Math.sqrt(variance),
  }
}

export function rankInfo(marks, student) {
  if (marks.length === 0) return null
  const above = marks.reduce((count, mark) => (mark > student ? count + 1 : count), 0)
  const atOrAbove = marks.reduce((count, mark) => (mark <= student ? count + 1 : count), 0)
  return {
    rank: Math.min(marks.length, above + 1),
    n: marks.length,
    percentile: (atOrAbove / marks.length) * 100,
  }
}

export function estimateGrade(boundaries, student) {
  const defined = boundaries
    .filter((boundary) => boundary.min != null)
    .map((boundary) => ({ label: boundary.label, min: boundary.min }))
    .sort((a, b) => b.min - a.min)
  const matched = defined.find((boundary) => student >= boundary.min)
  if (matched) return { label: matched.label, min: matched.min, catchAll: false, below: null }
  const fallback = boundaries.filter((boundary) => boundary.min == null).pop()
  if (fallback) return { label: fallback.label, min: null, catchAll: true, below: defined.length ? defined[defined.length - 1].min : null }
  return null
}

export function computeHistogram(marks, student) {
  if (marks.length === 0) return null
  const low = Math.min(student, ...marks)
  const high = Math.max(student, ...marks)
  if (high === low) return { flat: true }
  const width = high - low <= 12 ? 2 : high - low <= 30 ? 5 : 10
  const start = Math.floor(low / width) * width
  const count = Math.ceil((high - start + 1) / width)
  const bins = Array.from({ length: count }, (_, index) => ({ start: start + index * width, count: 0, you: false }))
  const bucket = (value) => Math.max(0, Math.min(count - 1, Math.floor((value - start) / width)))
  marks.forEach((mark) => {
    bins[bucket(mark)].count += 1
  })
  bins[bucket(student)].you = true
  return { bins, width, flat: false }
}

export function analyzeRelative(student, marks, boundaries, method) {
  const result = {
    stats: computeStatistics(marks),
    student,
    rank: rankInfo(marks, student),
    histogram: computeHistogram(marks, student),
  }
  if (!result.stats) return result
  result.diff = student - result.stats.mean
  result.z = result.stats.sd === 0 ? null : (student - result.stats.mean) / result.stats.sd
  if (method === 'boundaries') result.grade = estimateGrade(boundaries, student)
  return result
}

export function formatSignedNumber(value, digits = 2) {
  if (value == null || !Number.isFinite(value)) return ''
  const body = Math.abs(value).toFixed(digits)
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}${body}`
}