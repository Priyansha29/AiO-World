import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  analyzeJson,
  formatJson,
  minifyJson,
  describeError,
} from '../../src/features/tools/domain/json.js'

describe('Developer - JSON Formatter & Validator (json.js)', () => {
  const validJson = '{"name":"Alex","skills":["C++","Python"],"student":true,"semester":4}'

  it('validates and parses valid JSON text', () => {
    const res = analyzeJson(validJson)
    assert.equal(res.ok, true)
    assert.equal(res.valid, true)
    assert.equal(res.value.name, 'Alex')
    assert.deepEqual(res.value.skills, ['C++', 'Python'])
    assert.equal(res.value.student, true)
  })

  it('formats JSON with 2-space or 4-space indentation', () => {
    const formatted2 = formatJson(validJson, 2)
    assert.equal(formatted2.ok, true)
    assert.ok(formatted2.output.includes('  "name": "Alex"'))

    const formatted4 = formatJson(validJson, 4)
    assert.equal(formatted4.ok, true)
    assert.ok(formatted4.output.includes('    "name": "Alex"'))
  })

  it('minifies formatted JSON by removing unnecessary whitespace', () => {
    const spaced = `
      {
        "name": "Alex",
        "student": true
      }
    `
    const minified = minifyJson(spaced)
    assert.equal(minified.ok, true)
    assert.equal(minified.output, '{"name":"Alex","student":true}')
  })

  it('handles empty and whitespace-only text gracefully', () => {
    assert.deepEqual(analyzeJson(''), { ok: false, valid: false, empty: true })
    assert.deepEqual(analyzeJson('   \n  '), { ok: false, valid: false, empty: true })
    assert.equal(formatJson('').empty, true)
    assert.equal(minifyJson('').empty, true)
  })

  it('diagnoses syntax errors and locates line and column positions', () => {
    const invalidJson = '{\n  "name": "Alex",\n  "skills": ["C++",\n}'
    const analyzed = analyzeJson(invalidJson)
    assert.equal(analyzed.ok, false)
    assert.equal(analyzed.valid, false)
    assert.ok(analyzed.error)
    assert.ok(analyzed.error.message)
    if (analyzed.error.line) {
      assert.ok(analyzed.error.line >= 1)
      assert.ok(analyzed.error.column >= 1)
    }
  })

  it('creates code snippets with caret markers for error descriptions', () => {
    const text = '{\n  "age": 20,\n  bad_token\n}'
    const desc = describeError('Unexpected token b in JSON at position 16', text)
    assert.equal(desc.position, 16)
    assert.equal(desc.line, 3)
    assert.ok(desc.snippet.caret.includes('^'))
  })
})
