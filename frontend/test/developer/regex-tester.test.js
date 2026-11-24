import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildFlags,
  testRegex,
  copyResultsText,
} from '../../src/features/tools/domain/regex-tester.js'

describe('Developer - Regex Tester (regex-tester.js)', () => {
  it('builds flag strings safely from arrays of keys', () => {
    assert.equal(buildFlags(['g', 'i']), 'gi')
    assert.equal(buildFlags(['m', 's', 'u']), 'msu')
    assert.equal(buildFlags([]), '')
    assert.equal(buildFlags(null), '')
  })

  it('finds global matches across search text', () => {
    const pattern = '\\b[A-Za-z]+ing\\b'
    const text = 'Walking, running, and jumping through coding tasks.'
    const result = testRegex(pattern, ['g', 'i'], text)

    assert.equal(result.ok, true)
    assert.equal(result.valid, true)
    assert.equal(result.count, 4)
    assert.equal(result.matches[0].value, 'Walking')
    assert.equal(result.matches[1].value, 'running')
    assert.equal(result.matches[2].value, 'jumping')
    assert.equal(result.matches[3].value, 'coding')
  })

  it('captures numbered and named groups', () => {
    // Matching dates: YYYY-MM-DD with named groups
    const pattern = '(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})'
    const text = 'Release date: 2026-11-01'
    const result = testRegex(pattern, ['g'], text)

    assert.equal(result.ok, true)
    assert.equal(result.count, 1)
    const match = result.matches[0]
    assert.equal(match.value, '2026-11-01')
    assert.deepEqual(match.groups, ['2026', '11', '01'])
    assert.deepEqual(match.named, { year: '2026', month: '11', day: '01' })
  })

  it('catches invalid regular expression syntax gracefully', () => {
    // Unclosed bracket
    const result = testRegex('[a-z', ['g'], 'sample text')
    assert.equal(result.ok, false)
    assert.equal(result.valid, false)
    assert.ok(result.error)
  })

  it('handles empty pattern and non-global single match mode', () => {
    assert.equal(testRegex('', ['g'], 'hello').empty, true)

    // Non-global flag (finds only the first match)
    const single = testRegex('\\d+', [], '10 apples and 20 oranges')
    assert.equal(single.count, 1)
    assert.equal(single.matches[0].value, '10')
  })

  it('formats copyable match summary', () => {
    const res = testRegex('cat', ['g'], 'the cat in the hat')
    const summary = copyResultsText(res)
    assert.ok(summary.includes('1 match'))
    assert.ok(summary.includes('"cat"'))
  })
})
