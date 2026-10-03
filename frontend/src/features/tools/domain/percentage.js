function parseNumber(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return null
  const value = Number(raw)
  return Number.isFinite(value) ? value : null
}

export function validateMarksPercentage(raw) {
  const errors = {}
  const obtained = parseNumber(raw.obtained)
  const total = parseNumber(raw.total)

  if (obtained == null) errors.obtained = 'Enter obtained marks.'
  else if (obtained < 0) errors.obtained = 'Obtained marks cannot be negative.'

  if (total == null) errors.total = 'Enter total marks.'
  else if (total <= 0) errors.total = 'Total marks must be greater than zero.'
  else if (obtained != null && obtained > total) errors.obtained = 'Obtained marks cannot exceed the total.'

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, values: { obtained, total } }
}

export function validatePercentOfNumber(raw) {
  const errors = {}
  const percent = parseNumber(raw.percent)
  const number = parseNumber(raw.number)

  if (percent == null) errors.percent = 'Enter a percentage.'
  else if (percent < 0 || percent > 100) errors.percent = 'Percentage must be between 0 and 100.'

  if (number == null) errors.number = 'Enter a number.'
  else if (number < 0) errors.number = 'Number cannot be negative.'

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, values: { percent, number } }
}

export function validatePercentageChange(raw) {
  const errors = {}
  const original = parseNumber(raw.original)
  const next = parseNumber(raw.new)

  if (original == null) errors.original = 'Enter the original value.'
  else if (original <= 0) errors.original = 'Original value must be greater than zero — change is undefined at zero.'

  if (next == null) errors.new = 'Enter the new value.'
  else if (next < 0) errors.new = 'New value cannot be negative.'

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, values: { original, new: next } }
}

export function validateReversePercentage(raw) {
  const errors = {}
  const value = parseNumber(raw.value)
  const percent = parseNumber(raw.percent)

  if (value == null) errors.value = 'Enter the known value.'
  else if (value < 0) errors.value = 'Value cannot be negative.'

  if (percent == null) errors.percent = 'Enter a percentage.'
  else if (percent <= 0) errors.percent = 'Percentage must be greater than zero.'
  else if (percent > 100) errors.percent = 'Percentage must be between 0 and 100.'

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, values: { value, percent } }
}

export function marksPercentage(obtained, total) {
  return total > 0 ? (obtained / total) * 100 : null
}

export function percentOfNumber(percent, number) {
  return (percent / 100) * number
}

export function percentageChange(original, next) {
  return original > 0 ? ((next - original) / original) * 100 : null
}

export function reversePercentage(value, percent) {
  return percent > 0 ? value / (percent / 100) : null
}

export function formatNumber(value) {
  if (value == null || !Number.isFinite(value)) return ''
  if (value === 0) return '0'
  const fixed = value.toFixed(2)
  return fixed.replace(/\.?0+$/, '')
}

export function formatPercent(value) {
  if (value == null || !Number.isFinite(value)) return ''
  if (value === 0) return '0.00%'
  return `${value.toFixed(2)}%`
}

export function formatSignedPercent(value) {
  if (value == null || !Number.isFinite(value)) return ''
  const body = Math.abs(value).toFixed(2)
  if (body === '0.00') return '0.00%'
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}${body}%`
}