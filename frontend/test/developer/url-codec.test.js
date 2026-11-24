import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  encodeUrlComponent,
  decodeUrlComponent,
} from '../../src/features/tools/domain/url-codec.js'

describe('Developer - URL Encoder / Decoder (url-codec.js)', () => {
  it('encodes special URL characters and query parameters', () => {
    const text = 'query=hello world & category=ai/ml?version=2.0#section'
    const encoded = encodeUrlComponent(text)
    assert.equal(encoded.ok, true)
    assert.equal(
      encoded.output,
      'query%3Dhello%20world%20%26%20category%3Dai%2Fml%3Fversion%3D2.0%23section'
    )

    const decoded = decodeUrlComponent(encoded.output)
    assert.equal(decoded.ok, true)
    assert.equal(decoded.output, text)
  })

  it('safely handles Unicode characters and emojis in URL components', () => {
    const input = '🎓 Student Life & AI 🚀'
    const encoded = encodeUrlComponent(input)
    assert.equal(encoded.ok, true)
    assert.ok(encoded.output.includes('%F0%9F%8E%93'))

    const decoded = decodeUrlComponent(encoded.output)
    assert.equal(decoded.ok, true)
    assert.equal(decoded.output, input)
  })

  it('handles empty inputs without throwing', () => {
    assert.deepEqual(encodeUrlComponent(''), { ok: true, output: '' })
    assert.deepEqual(encodeUrlComponent(null), { ok: true, output: '' })

    const decEmpty = decodeUrlComponent('')
    assert.equal(decEmpty.ok, true)
    assert.equal(decEmpty.empty, true)
  })

  it('rejects malformed percent-encoding with descriptive error', () => {
    // Lone percent sign
    const lone = decodeUrlComponent('hello%')
    assert.equal(lone.ok, false)
    assert.ok(lone.error.includes('Malformed percent-encoding'))

    // Incomplete hex pair
    const incomplete = decodeUrlComponent('hello%2')
    assert.equal(incomplete.ok, false)

    // Non-hex digits
    const badHex = decodeUrlComponent('hello%ZZ')
    assert.equal(badHex.ok, false)
  })
})
