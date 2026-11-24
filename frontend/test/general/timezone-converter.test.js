import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  listZones,
  isSupportedZone,
  friendlyName,
  offsetLabel,
  parseDatePart,
  parseTimePart,
  wallToInstant,
  convertDateTime,
  copySummaryText,
  POPULAR_TIMEZONES,
} from '../../src/features/tools/domain/timezone-converter.js'

describe('General - Time Zone Converter (timezone-converter.js)', () => {
  it('lists supported timezones and validates zone availability', () => {
    const zones = listZones()
    assert.ok(Array.isArray(zones))
    assert.ok(zones.length > 10)
    assert.ok(zones.includes('UTC'))
    assert.ok(zones.includes('Asia/Kolkata'))
    assert.ok(zones.includes('America/New_York'))

    assert.equal(isSupportedZone('UTC'), true)
    assert.equal(isSupportedZone('Asia/Kolkata'), true)
    assert.equal(isSupportedZone('Invalid/Zone_Name'), false)
    assert.equal(isSupportedZone(''), false)
    assert.equal(isSupportedZone(null), false)

    assert.ok(Array.isArray(POPULAR_TIMEZONES))
    assert.ok(POPULAR_TIMEZONES.includes('UTC'))
  })

  it('formats zone friendly names and UTC offset labels accurately', () => {
    const testInstant = new Date(Date.UTC(2024, 0, 15, 12, 0, 0))

    assert.equal(offsetLabel('UTC', testInstant), 'UTC')
    assert.equal(offsetLabel('Asia/Kolkata', testInstant), 'UTC+05:30')
    assert.equal(offsetLabel('America/New_York', testInstant), 'UTC-05:00') // Standard time (EST)

    const utcName = friendlyName('UTC', testInstant)
    assert.ok(typeof utcName === 'string' && utcName.length > 0)
    const kolkataName = friendlyName('Asia/Kolkata', testInstant)
    assert.ok(typeof kolkataName === 'string' && kolkataName.length > 0)
  })

  it('parses calendar date parts with strict validation and leap year handling', () => {
    assert.deepEqual(parseDatePart('2024-06-15'), { year: 2024, month: 6, day: 15 })

    // Leap year leap day
    assert.deepEqual(parseDatePart('2024-02-29'), { year: 2024, month: 2, day: 29 })
    // Non-leap year leap day must fail
    assert.equal(parseDatePart('2023-02-29'), null)
    // Non-existent calendar date
    assert.equal(parseDatePart('2024-04-31'), null)
    // Malformed formats
    assert.equal(parseDatePart('15-06-2024'), null)
    assert.equal(parseDatePart('2024/06/15'), null)
    assert.equal(parseDatePart(''), null)
    assert.equal(parseDatePart(null), null)
  })

  it('parses time parts with boundary validation', () => {
    assert.deepEqual(parseTimePart('14:30'), { hour: 14, minute: 30, second: 0 })
    assert.deepEqual(parseTimePart('09:15:45'), { hour: 9, minute: 15, second: 45 })
    assert.deepEqual(parseTimePart('00:00:00'), { hour: 0, minute: 0, second: 0 })

    // Out of range times
    assert.equal(parseTimePart('24:00'), null)
    assert.equal(parseTimePart('12:60'), null)
    assert.equal(parseTimePart('12:00:60'), null)
    assert.equal(parseTimePart('-1:00'), null)
    assert.equal(parseTimePart('abc'), null)
    assert.equal(parseTimePart(''), null)
  })

  it('converts wall clock components to UTC instant', () => {
    // 2024-01-01 12:00:00 in UTC -> 2024-01-01T12:00:00.000Z
    const instantUtc = wallToInstant(
      { year: 2024, month: 1, day: 1 },
      { hour: 12, minute: 0, second: 0 },
      'UTC'
    )
    assert.equal(instantUtc.toISOString(), '2024-01-01T12:00:00.000Z')

    // 2024-01-01 15:30:00 in Asia/Kolkata (UTC+05:30) -> 2024-01-01T10:00:00.000Z
    const instantIst = wallToInstant(
      { year: 2024, month: 1, day: 1 },
      { hour: 15, minute: 30, second: 0 },
      'Asia/Kolkata'
    )
    assert.equal(instantIst.toISOString(), '2024-01-01T10:00:00.000Z')
  })

  it('converts across time zones and accurately calculates date shifts', () => {
    // 2024-01-02 at 02:00 AM IST is 2024-01-01 at 03:25 PM EST in New York (dayDiff = -1)
    const result = convertDateTime('2024-01-02', '02:00', 'Asia/Kolkata', 'America/New_York')
    assert.equal(result.ok, true)
    assert.equal(result.fromZone, 'Asia/Kolkata')
    assert.equal(result.toZone, 'America/New_York')
    assert.equal(result.sameZone, false)
    assert.equal(result.dayDiff, -1)
    assert.equal(result.source.shortDate, '2024-01-02')
    assert.equal(result.target.shortDate, '2024-01-01')

    // Copy text formatting
    const summary = copySummaryText(result)
    assert.ok(summary.includes('Source: Asia/Kolkata'))
    assert.ok(summary.includes('Target: America/New_York'))
  })

  it('returns structured errors for invalid dates, times, or unsupported zones', () => {
    assert.deepEqual(
      convertDateTime('invalid-date', '12:00', 'UTC', 'America/New_York'),
      { ok: false, error: 'Enter a valid date.' }
    )
    assert.deepEqual(
      convertDateTime('2024-01-01', '25:00', 'UTC', 'America/New_York'),
      { ok: false, error: 'Enter a valid time.' }
    )
    assert.deepEqual(
      convertDateTime('2024-01-01', '12:00', 'Invalid/Zone', 'America/New_York'),
      { ok: false, error: 'Choose a valid source time zone.' }
    )
    assert.deepEqual(
      convertDateTime('2024-01-01', '12:00', 'UTC', 'Invalid/Zone'),
      { ok: false, error: 'Choose a valid target time zone.' }
    )
  })
})
