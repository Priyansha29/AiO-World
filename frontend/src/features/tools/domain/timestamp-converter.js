export const MAX_MS = 8.64e15

const NUMBER_RE = /^[+-]?\d+(\.\d+)?$/
const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})([T ](\d{2}):(\d{2})(:(\d{2})(\.\d{1,9})?)?)?(Z|([+-])(\d{2}):?(\d{2}))?$/

function invalidIsoComponent(text) {
  const m = text.match(ISO_RE)
  if (!m) return null
  const month = Number(m[2])
  const day = Number(m[3])
  if (month < 1 || month > 12) return text
  const daysInMonth = new Date(Date.UTC(Number(m[1]), month, 0)).getUTCDate()
  if (day < 1 || day > daysInMonth) return text
  if (m[5] != null && (Number(m[5]) < 0 || Number(m[5]) > 23)) return text
  if (m[6] != null && (Number(m[6]) < 0 || Number(m[6]) > 59)) return text
  if (m[8] != null && (Number(m[8]) < 0 || Number(m[8]) > 59)) return text
  if (m[12] != null && (Number(m[12]) > 23 || Number(m[13]) > 59)) return text
  return null
}

function pad(value, width = 2) {
  return String(value).padStart(width, '0')
}

function validDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime())
}

function buildInstant(date) {
  return {
    date,
    seconds: Math.floor(date.getTime() / 1000),
    milliseconds: date.getTime(),
    isoUtc: isoUtcFrom(date),
    utcText: textUtcFrom(date),
    localText: textLocalFrom(date),
    offsetLabel: offsetLabelFrom(date),
    zoneName: zoneName(),
  }
}

function isoUtcFrom(date) {
  return `${pad(date.getUTCFullYear(), 4)}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}.${pad(date.getUTCMilliseconds(), 3)}Z`
}

function textUtcFrom(date) {
  return `${pad(date.getUTCFullYear(), 4)}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}.${pad(date.getUTCMilliseconds(), 3)} UTC`
}

function textLocalFrom(date) {
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`
}

function offsetLabelFrom(date) {
  const total = -date.getTimezoneOffset()
  const sign = total >= 0 ? '+' : '-'
  const abs = Math.abs(total)
  return `UTC${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
}

export function zoneName() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local time'
  } catch {
    return 'Local time'
  }
}

export function nowInfo(date = new Date()) {
  if (!validDate(date)) return null
  return buildInstant(date)
}

export function parseTimestamp(text) {
  const value = typeof text === 'string' ? text.trim() : ''
  if (value === '') return { ok: false, empty: true }
  if (!NUMBER_RE.test(value)) return { ok: false, error: 'Invalid timestamp' }
  return { ok: true, value: Number(value) }
}

export function timestampToInstant(text, unit) {
  const parsed = parseTimestamp(text)
  if (!parsed.ok) return parsed
  const milliseconds = unit === 'ms' ? parsed.value : parsed.value * 1000
  if (!Number.isFinite(milliseconds) || Math.abs(milliseconds) > MAX_MS) {
    return { ok: false, error: 'Timestamp is outside the supported range' }
  }
  const date = new Date(Math.round(milliseconds))
  if (!validDate(date)) return { ok: false, error: 'Timestamp is outside the supported range' }
  return { ok: true, ...buildInstant(date), inputMs: milliseconds }
}

export function parseDateTime(text, interpretation) {
  const value = typeof text === 'string' ? text.trim() : ''
  if (value === '') return { ok: false, empty: true }
  if (invalidIsoComponent(value)) return { ok: false, error: 'Invalid date/time' }
  const hasExplicitZone = /(Z|([+-]\d{2}:?\d{2}))$/i.test(value)
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)

  let date
  if (hasExplicitZone) {
    date = new Date(value)
  } else if (interpretation === 'utc') {
    const base = isDateOnly ? `${value}T00:00:00` : value.replace(' ', 'T')
    date = new Date(`${base}Z`)
  } else if (isDateOnly) {
    date = new Date(`${value}T00:00:00`)
  } else {
    date = new Date(value)
  }

  if (!validDate(date)) return { ok: false, error: 'Invalid date/time' }
  const origin = hasExplicitZone ? 'explicit' : interpretation
  return { ok: true, ...buildInstant(date), origin }
}

export function copyText(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => legacyCopy(text),
    )
  }
  return Promise.resolve(legacyCopy(text))
}

function legacyCopy(text) {
  if (typeof document === 'undefined') return false
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.top = '0'
  area.style.left = '0'
  area.style.opacity = '0'
  area.style.pointerEvents = 'none'
  document.body.appendChild(area)
  area.focus()
  area.select()
  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }
  document.body.removeChild(area)
  return copied
}