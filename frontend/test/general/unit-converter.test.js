import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  categoryByKey,
  unitById,
  parseInput,
  formatQuantity,
  convertText,
} from '../../src/features/tools/domain/unit-converter.js'

describe('General - Unit Converter (unit-converter.js)', () => {
  it('loads valid categories and units', () => {
    const length = categoryByKey('length')
    assert.ok(length)
    assert.equal(length.label, 'Length')

    const km = unitById('length', 'km')
    assert.ok(km)
    assert.equal(km.symbol, 'km')

    assert.equal(categoryByKey('non-existent'), null)
    assert.equal(unitById('length', 'non-existent'), null)
  })

  it('parses valid numeric inputs including scientific notation', () => {
    assert.deepEqual(parseInput('42'), { ok: true, value: 42 })
    assert.deepEqual(parseInput('-10.5'), { ok: true, value: -10.5 })
    assert.deepEqual(parseInput('1e6'), { ok: true, value: 1000000 })
    assert.deepEqual(parseInput(''), { empty: true })
    assert.equal(parseInput('invalid').ok, false)
  })

  it('performs accurate linear unit conversions (length, mass)', () => {
    // 5 km to meters -> 5000 m
    const kmToM = convertText('length', 'km', 'm', '5')
    assert.equal(kmToM.ok, true)
    assert.equal(kmToM.result, 5000)

    // 2.5 kg to grams -> 2500 g
    const kgToG = convertText('mass', 'kg', 'g', '2.5')
    assert.equal(kgToG.ok, true)
    assert.equal(kgToG.result, 2500)

    // Identity conversion
    const same = convertText('length', 'm', 'm', '10')
    assert.equal(same.ok, true)
    assert.equal(same.result, 10)
    assert.equal(same.same, true)
  })

  describe('Temperature conversion and absolute zero constraint', () => {
    it('converts standard temperature reference points accurately', () => {
      // 0 °C to °F = 32 °F
      const freezing = convertText('temperature', 'c', 'f', '0')
      assert.equal(freezing.ok, true)
      assert.equal(freezing.result, 32)

      // 100 °C to °F = 212 °F
      const boiling = convertText('temperature', 'c', 'f', '100')
      assert.equal(boiling.ok, true)
      assert.equal(boiling.result, 212)

      // 0 K to °C = -273.15 °C
      const absZeroC = convertText('temperature', 'k', 'c', '0')
      assert.equal(absZeroC.ok, true)
      assert.equal(absZeroC.result, -273.15)
    })

    it('rejects temperatures below absolute zero (-273.15 °C / 0 K)', () => {
      const belowZeroC = convertText('temperature', 'c', 'k', '-300')
      assert.equal(belowZeroC.ok, false)
      assert.ok(belowZeroC.error.includes('below absolute zero'))

      const negativeKelvin = convertText('temperature', 'k', 'c', '-1')
      assert.equal(negativeKelvin.ok, false)
      assert.ok(negativeKelvin.error.includes('below absolute zero'))
    })
  })

  it('formats values using intelligent significant digits and scientific notation', () => {
    assert.equal(formatQuantity(0), '0')
    assert.equal(formatQuantity(100), '100')
    assert.equal(formatQuantity(12.345), '12.345')
    // Very large or very small numbers use scientific notation
    assert.ok(formatQuantity(1e18).includes('E') || formatQuantity(1e18).includes('e'))
  })
})
