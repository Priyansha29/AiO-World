import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  parseTimestamp,
  timestampToInstant,
  parseDateTime,
  nowInfo,
} from '../../src/features/tools/domain/timestamp-converter.js'

describe('General - Timestamp Converter (timestamp-converter.js)', () => {
  it('parses numeric epoch timestamps', () => {
    assert.deepEqual(parseTimestamp('1700000000'), { ok: true, value: 1700000000 })
    assert.deepEqual(parseTimestamp('-500'), { ok: true, value: -500 })
    assert.deepEqual(parseTimestamp(''), { ok: false, empty: true })
    assert.equal(parseTimestamp('abc').ok, false)
  })

  it('differentiates between seconds and milliseconds units correctly', () => {
    // 0 epoch is Jan 1, 1970 UTC
    const zeroSec = timestampToInstant('0', 's')
    assert.equal(zeroSec.ok, true)
    assert.equal(zeroSec.seconds, 0)
    assert.equal(zeroSec.milliseconds, 0)
    assert.equal(zeroSec.isoUtc, '1970-01-01T00:00:00.000Z')

    // 1700000000 seconds
    const inSeconds = timestampToInstant('1700000000', 's')
    assert.equal(inSeconds.ok, true)
    assert.equal(inSeconds.seconds, 1700000000)
    assert.equal(inSeconds.milliseconds, 1700000000000)

    // 1700000000000 milliseconds
    const inMs = timestampToInstant('1700000000000', 'ms')
    assert.equal(inMs.ok, true)
    assert.equal(inMs.seconds, 1700000000)
    assert.equal(inMs.milliseconds, 1700000000000)
    assert.equal(inSeconds.isoUtc, inMs.isoUtc)
  })

  it('rejects timestamps outside supported range', () => {
    const huge = timestampToInstant('999999999999999999', 'ms')
    assert.equal(huge.ok, false)
    assert.ok(huge.error.includes('outside the supported range'))
  })

  it('parses valid ISO 8601 strings with explicit timezones', () => {
    const utcIso = parseDateTime('2026-11-01T12:00:00Z', 'utc')
    assert.equal(utcIso.ok, true)
    assert.equal(utcIso.isoUtc, '2026-11-01T12:00:00.000Z')
    assert.equal(utcIso.origin, 'explicit')

    // Date only string interpreted as UTC
    const dateOnly = parseDateTime('2026-11-01', 'utc')
    assert.equal(dateOnly.ok, true)
    assert.equal(dateOnly.isoUtc, '2026-11-01T00:00:00.000Z')
  })

  it('detects and rejects impossible calendar dates', () => {
    // 30th of February is invalid
    const feb30 = parseDateTime('2026-02-30T10:00:00Z', 'utc')
    assert.equal(feb30.ok, false)
    assert.equal(feb30.error, 'Invalid date/time')

    // 13th month is invalid
    const month13 = parseDateTime('2026-13-01T10:00:00Z', 'utc')
    assert.equal(month13.ok, false)

    // Hour 25 is invalid
    const hour25 = parseDateTime('2026-11-01T25:00:00Z', 'utc')
    assert.equal(hour25.ok, false)
  })

  it('builds instant information from a reference date', () => {
    const fixedDate = new Date('2026-11-01T00:00:00.000Z')
    const info = nowInfo(fixedDate)
    assert.ok(info)
    assert.equal(info.isoUtc, '2026-11-01T00:00:00.000Z')
    assert.equal(info.seconds, Math.floor(fixedDate.getTime() / 1000))
  })
})
