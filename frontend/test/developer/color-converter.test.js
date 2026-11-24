import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  parseColor,
  toHex,
  toRgb,
  toRgba,
  rgbToHsl,
} from '../../src/features/tools/domain/color-converter.js'

describe('Developer - Color Converter (color-converter.js)', () => {
  describe('HEX Parsing and Formatting', () => {
    it('parses 3-digit and 6-digit hex values', () => {
      // 3-digit shorthand #f00 expands to #ff0000
      const short = parseColor('#f00')
      assert.equal(short.ok, true)
      assert.deepEqual(short.color, { r: 255, g: 0, b: 0, a: 1 })
      assert.equal(toHex(short.color), '#ff0000')

      // 6-digit standard
      const hex = parseColor('#3498db')
      assert.equal(hex.ok, true)
      assert.deepEqual(hex.color, { r: 52, g: 152, b: 219, a: 1 })
      assert.equal(toHex(hex.color), '#3498db')
    })

    it('parses 4-digit and 8-digit hex values with alpha transparency', () => {
      // 8-digit hex #3498dbff (alpha 1.0)
      const full = parseColor('#3498dbff')
      assert.equal(full.ok, true)
      assert.equal(full.color.a, 1)

      // 4-digit hex #3498
      const shortWithAlpha = parseColor('#3498')
      assert.equal(shortWithAlpha.ok, true)
      assert.ok(shortWithAlpha.color.a > 0 && shortWithAlpha.color.a < 1)
    })
  })

  describe('RGB and RGBA Functional Notation', () => {
    it('parses rgb() and rgba() strings', () => {
      const rgb = parseColor('rgb(52, 152, 219)')
      assert.equal(rgb.ok, true)
      assert.deepEqual(rgb.color, { r: 52, g: 152, b: 219, a: 1 })
      assert.equal(toRgb(rgb.color), 'rgb(52, 152, 219)')

      const rgba = parseColor('rgba(52, 152, 219, 0.5)')
      assert.equal(rgba.ok, true)
      assert.equal(rgba.color.a, 0.5)
      assert.equal(toRgba(rgba.color), 'rgba(52, 152, 219, 0.5)')
    })
  })

  describe('HSL and HSLA Functional Notation', () => {
    it('parses hsl() and hsla() formats and accurately converts to RGB', () => {
      // Pure Red: hsl(0, 100%, 50%) -> rgb(255, 0, 0)
      const redHsl = parseColor('hsl(0, 100%, 50%)')
      assert.equal(redHsl.ok, true)
      assert.equal(redHsl.color.r, 255)
      assert.equal(redHsl.color.g, 0)
      assert.equal(redHsl.color.b, 0)

      // With alpha
      const hsla = parseColor('hsla(120, 100%, 50%, 0.75)')
      assert.equal(hsla.ok, true)
      assert.equal(hsla.color.r, 0)
      assert.equal(hsla.color.g, 255)
      assert.equal(hsla.color.b, 0)
      assert.equal(hsla.color.a, 0.75)
    })

    it('converts RGB back to HSL representation', () => {
      // rgb(255, 0, 0) should be h: 0, s: 100, l: 50
      const hsl = rgbToHsl(255, 0, 0)
      assert.deepEqual(hsl, { h: 0, s: 100, l: 50 })

      // rgb(255, 255, 255) should be l: 100
      const white = rgbToHsl(255, 255, 255)
      assert.equal(white.l, 100)

      // rgb(0, 0, 0) should be l: 0
      const black = rgbToHsl(0, 0, 0)
      assert.equal(black.l, 0)
    })
  })

  describe('Invalid inputs and edge cases', () => {
    it('rejects invalid color strings', () => {
      assert.equal(parseColor('not-a-color').ok, false)
      assert.equal(parseColor('#12345').ok, false) // 5 digits invalid
      assert.equal(parseColor('#gggggg').ok, false) // non-hex characters
      assert.equal(parseColor('rgb(300, 0, 0)').ok, false) // out of 0-255 range
      assert.equal(parseColor('rgba(0, 0, 0, 2.5)').ok, false) // alpha > 1
      assert.equal(parseColor('').empty, true)
    })
  })
})
