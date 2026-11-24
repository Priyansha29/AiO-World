import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  encodeToBase64,
  decodeFromBase64,
} from '../../src/features/tools/domain/base64.js'

describe('Developer - Base64 Encoder / Decoder (base64.js)', () => {
  it('encodes and decodes standard ASCII strings', () => {
    const input = 'Hello AiO World!'
    const encoded = encodeToBase64(input)
    assert.equal(encoded.ok, true)
    assert.equal(encoded.output, 'SGVsbG8gQWlPIFdvcmxkIQ==')

    const decoded = decodeFromBase64(encoded.output)
    assert.equal(decoded.ok, true)
    assert.equal(decoded.output, input)
  })

  it('correctly handles multi-byte UTF-8 Unicode characters and emojis', () => {
    const unicodeStrings = [
      '🚀 Modern Student Platform',
      'नमस्ते दुनिया',
      'Café & Naïve résumé',
      '日本語と中文',
      '✨ 100% 🎯',
    ]

    for (const text of unicodeStrings) {
      const enc = encodeToBase64(text)
      assert.equal(enc.ok, true)
      const dec = decodeFromBase64(enc.output)
      assert.equal(dec.ok, true)
      assert.equal(dec.output, text)
    }
  })

  it('handles empty and whitespace-only inputs gracefully', () => {
    assert.deepEqual(encodeToBase64(''), { ok: true, output: '' })
    assert.deepEqual(encodeToBase64(null), { ok: true, output: '' })

    const decEmpty = decodeFromBase64('')
    assert.equal(decEmpty.ok, true)
    assert.equal(decEmpty.empty, true)

    const decWhitespace = decodeFromBase64('   \n\t  ')
    assert.equal(decWhitespace.ok, true)
    assert.equal(decWhitespace.empty, true)
  })

  it('ignores inner whitespace in valid base64 during decoding', () => {
    const raw = 'SGVs bG8g QWlP IFdv cmxk IQ=='
    const decoded = decodeFromBase64(raw)
    assert.equal(decoded.ok, true)
    assert.equal(decoded.output, 'Hello AiO World!')
  })

  it('rejects characters outside the Base64 alphabet', () => {
    const invalidChar = decodeFromBase64('SGVsbG8#$')
    assert.equal(invalidChar.ok, false)
    assert.ok(invalidChar.error.includes('Not valid Base64'))
  })

  it('rejects malformed padding or invalid Base64 structures', () => {
    // 3 padding equals is invalid
    const badPadding = decodeFromBase64('SGVsbG8===')
    assert.equal(badPadding.ok, false)

    // Single character cannot form valid base64 (atob throws)
    const broken = decodeFromBase64('S')
    assert.equal(broken.ok, false)
  })
})
