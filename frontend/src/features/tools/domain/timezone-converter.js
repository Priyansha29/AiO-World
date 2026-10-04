/**
 * Time zone conversion, powered entirely by the browser's Intl engine.
 *
 * No offset tables, no DST rules in this file — the machinery of
 * Intl.DateTimeFormat + IANA identifiers decides every offset for the exact
 * instant being converted. This module is the pure calculation half; the
 * combinox and the component are the UI half.
 */

/**
 * Zones that must always be offered even if the runtime's
 * Intl.supportedValuesOf("timeZone") omits them (some ICU builds list only a
 * subset while still formatting the full IANA set).
 */
const REQUIRED_TIMEZONES = [
  'UTC',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/New_York',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Europe/Berlin',
  'Canada/Pacific',
  'Europe/London',
  'Pacific/Auckland',
]

export const POPULAR_TIMEZONES = [
  'UTC',
  'Asia/Kolkata',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
]

let cachedZones = null

export function listZones() {
  if (cachedZones) return cachedZones
  let zones = []
  if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
    try {
      const supported = Intl.supportedValuesOf('timeZone')
      if (Array.isArray(supported) && supported.length > 0) zones = supported
    } catch {
      zones = []
    }
  }
  const set = new Set(zones)
  for (const zone of REQUIRED_TIMEZONES) set.add(zone)
  cachedZones = [...set].sort()
  return cachedZones
}

export function isSupportedZone(zone) {
  if (typeof zone !== 'string' || zone === '') return false
  return listZones().includes(zone)
}

const nameCache = new Map()

function zoneKey(zone, reference) {
  const date = reference instanceof Date && Number.isFinite(reference.getTime()) ? reference : new Date()
  return `${zone}|${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export function friendlyName(zone, reference) {
  const key = zoneKey(zone, reference)
  const hit = nameCache.get(key)
  if (hit) return hit
  let name = zone
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'long',
    }).formatToParts(reference instanceof Date ? reference : new Date())
    const part = parts.find((entry) => entry.type === 'timeZoneName')
    if (part && part.value) name = part.value
  } catch {
    name = zone
  }
  if (nameCache.size > 4096) nameCache.clear()
  nameCache.set(key, name)
  return name
}

export function localTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'UTC'
  }
}

function zoneOffsetMinutes(zone, instant) {
  if (zone === 'UTC') return 0
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
    const fields = {}
    for (const part of formatter.formatToParts(instant)) {
      if (part.type !== 'literal') fields[part.type] = part.value
    }
    const asUtc = Date.UTC(
      Number(fields.year),
      Number(fields.month) - 1,
      Number(fields.day),
      Number(fields.hour),
      Number(fields.minute),
      Number(fields.second),
    )
    return Math.round((asUtc - instant.getTime()) / 60000)
  } catch {
    return 0
  }
}

export function offsetLabel(zone, instant) {
  const minutes = zoneOffsetMinutes(zone, instant)
  if (minutes === 0) return 'UTC'
  const sign = minutes < 0 ? '-' : '+'
  const absolute = Math.abs(minutes)
  const hours = String(Math.floor(absolute / 60)).padStart(2, '0')
  const mins = String(absolute % 60).padStart(2, '0')
  return `UTC${sign}${hours}:${mins}`
}

export function parseDatePart(text) {
  const value = typeof text === 'string' ? text.trim() : ''
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const check = new Date(Date.UTC(year, month - 1, day))
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
    return null
  }
  return { year, month, day }
}

export function parseTimePart(text) {
  const value = typeof text === 'string' ? text.trim() : ''
  const match = /^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?$/.exec(value)
  if (!match) return null
  const hour = Number(match[1])
  const minute = Number(match[2] ?? 0)
  const second = Number(match[3] ?? 0)
  if (hour > 23 || minute > 59 || second > 59) return null
  return { hour, minute, second }
}

export function wallToInstant(datePart, timePart, zone) {
  const guess = Date.UTC(datePart.year, datePart.month - 1, datePart.day, timePart.hour, timePart.minute, timePart.second)
  if (zone === 'UTC') return new Date(guess)
  const firstOffset = zoneOffsetMinutes(zone, new Date(guess))
  const firstCandidate = new Date(guess - firstOffset * 60000)
  const secondOffset = zoneOffsetMinutes(zone, firstCandidate)
  if (secondOffset === firstOffset) return firstCandidate
  const secondCandidate = new Date(guess - secondOffset * 60000)
  const thirdOffset = zoneOffsetMinutes(zone, secondCandidate)
  if (thirdOffset === secondOffset) return secondCandidate
  return firstCandidate
}

function safeZone(value) {
  return value === 'UTC' ? 'UTC' : value
}

export function formatLongDate(instant, zone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: safeZone(zone),
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(instant)
}

export function formatClock(instant, zone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: safeZone(zone),
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(instant)
}

export function formatClockSeconds(instant, zone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: safeZone(zone),
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(instant)
}

export function formatShortDate(instant, zone) {
  const { year, month, day } = dateParts(instant, zone)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function dateParts(instant, zone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: safeZone(zone),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instant)
  const fields = {}
  for (const part of parts) {
    if (part.type !== 'literal') fields[part.type] = part.value
  }
  return { year: Number(fields.year), month: Number(fields.month), day: Number(fields.day) }
}

function dayDifference(instant, fromZone, toZone) {
  const from = dateParts(instant, fromZone)
  const to = dateParts(instant, toZone)
  const fromUtc = Date.UTC(from.year, from.month - 1, from.day)
  const toUtc = Date.UTC(to.year, to.month - 1, to.day)
  return Math.round((toUtc - fromUtc) / 86400000)
}

export function convertDateTime(dateText, timeText, fromZone, toZone) {
  const datePart = parseDatePart(dateText)
  if (!datePart) return { ok: false, error: 'Enter a valid date.' }
  const timePart = parseTimePart(timeText)
  if (!timePart) return { ok: false, error: 'Enter a valid time.' }
  if (!isSupportedZone(fromZone)) return { ok: false, error: 'Choose a valid source time zone.' }
  if (!isSupportedZone(toZone)) return { ok: false, error: 'Choose a valid target time zone.' }

  const instant = wallToInstant(datePart, timePart, fromZone)
  const sameZone = fromZone === toZone
  return {
    ok: true,
    instant,
    fromZone,
    toZone,
    sameZone,
    source: {
      date: formatLongDate(instant, fromZone),
      clock: formatClock(instant, fromZone),
      shortDate: formatShortDate(instant, fromZone),
      offset: offsetLabel(fromZone, instant),
    },
    target: {
      date: formatLongDate(instant, toZone),
      clock: formatClock(instant, toZone),
      shortDate: formatShortDate(instant, toZone),
      offset: offsetLabel(toZone, instant),
    },
    dayDiff: dayDifference(instant, fromZone, toZone),
  }
}

export function copySummaryText(result) {
  return [
    `Source: ${result.fromZone}`,
    `${result.source.shortDate} ${result.source.clock}`,
    `Target: ${result.toZone}`,
    `${result.target.shortDate} ${result.target.clock}`,
  ].join('\n')
}