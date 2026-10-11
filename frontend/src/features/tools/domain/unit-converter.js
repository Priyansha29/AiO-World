/**
 * Unit Converter — pure, data-driven, browser-local.
 *
 * Linear categories convert through a shared base unit using exact factors.
 * Temperature is a dedicated set of functions built on a Kelvin base so the
 * absolute-zero bound is one check. Data storage uses decimal SI prefixes
 * (powers of 1000) — a kilobyte here is 1,000 bytes, never 1,024.
 */

const INPUT_RE = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/

const KELVIN_EPSILON = 1e-6

function linearUnit(id, name, symbol, factor) {
  return {
    id,
    name,
    symbol,
    factor,
    toBase: (value) => value * factor,
    fromBase: (value) => value / factor,
  }
}

function temperatureUnit(id, name, symbol, toKelvin, fromKelvin) {
  return { id, name, symbol, toBase: toKelvin, fromBase: fromKelvin }
}

export const CATEGORIES = [
  {
    key: 'length',
    label: 'Length',
    note: null,
    defaultFrom: 'km',
    defaultTo: 'm',
    defaultValue: '1',
    units: [
      linearUnit('mm', 'Millimeter', 'mm', 0.001),
      linearUnit('cm', 'Centimeter', 'cm', 0.01),
      linearUnit('m', 'Meter', 'm', 1),
      linearUnit('km', 'Kilometer', 'km', 1000),
      linearUnit('in', 'Inch', 'in', 0.0254),
      linearUnit('ft', 'Foot', 'ft', 0.3048),
      linearUnit('yd', 'Yard', 'yd', 0.9144),
      linearUnit('mi', 'Mile', 'mi', 1609.344),
    ],
  },
  {
    key: 'mass',
    label: 'Mass / Weight',
    note: 'This converts mass — the amount of matter. Weight is a force and depends on gravity; mass does not.',
    defaultFrom: 'kg',
    defaultTo: 'g',
    defaultValue: '1',
    units: [
      linearUnit('mg', 'Milligram', 'mg', 1e-6),
      linearUnit('g', 'Gram', 'g', 1e-3),
      linearUnit('kg', 'Kilogram', 'kg', 1),
      linearUnit('t', 'Metric tonne', 't', 1000),
      linearUnit('oz', 'Ounce', 'oz', 0.028349523125),
      linearUnit('lb', 'Pound', 'lb', 0.45359237),
    ],
  },
  {
    key: 'temperature',
    label: 'Temperature',
    note: 'Below absolute zero (−273.15 °C · −459.67 °F · 0 K) is rejected — no temperature can go lower.',
    defaultFrom: 'c',
    defaultTo: 'f',
    defaultValue: '0',
    units: [
      temperatureUnit('c', 'Celsius', '°C', (value) => value + 273.15, (value) => value - 273.15),
      temperatureUnit('f', 'Fahrenheit', '°F', (value) => (value - 32) * (5 / 9) + 273.15, (value) => (value - 273.15) * (9 / 5) + 32),
      temperatureUnit('k', 'Kelvin', 'K', (value) => value, (value) => value),
    ],
  },
  {
    key: 'area',
    label: 'Area',
    note: null,
    defaultFrom: 'km2',
    defaultTo: 'm2',
    defaultValue: '1',
    units: [
      linearUnit('mm2', 'Square millimeter', 'mm²', 1e-6),
      linearUnit('cm2', 'Square centimeter', 'cm²', 1e-4),
      linearUnit('m2', 'Square meter', 'm²', 1),
      linearUnit('ha', 'Hectare', 'ha', 1e4),
      linearUnit('km2', 'Square kilometer', 'km²', 1e6),
      linearUnit('ft2', 'Square foot', 'ft²', 0.09290304),
      linearUnit('acre', 'Acre', 'ac', 4046.8564224),
      linearUnit('mi2', 'Square mile', 'mi²', 2589988.110336),
    ],
  },
  {
    key: 'volume',
    label: 'Volume',
    note: 'The teaspoon, tablespoon, fluid ounce, cup and gallon here are US customary units — not imperial.',
    defaultFrom: 'l',
    defaultTo: 'ml',
    defaultValue: '1',
    units: [
      linearUnit('ml', 'Milliliter', 'mL', 1e-3),
      linearUnit('l', 'Liter', 'L', 1),
      linearUnit('m3', 'Cubic meter', 'm³', 1000),
      linearUnit('us-tsp', 'US teaspoon', 'tsp (US)', 0.00492892159375),
      linearUnit('us-tbsp', 'US tablespoon', 'tbsp (US)', 0.01478676478125),
      linearUnit('us-fl-oz', 'US fluid ounce', 'fl oz (US)', 0.0295735295625),
      linearUnit('us-cup', 'US cup', 'cup (US)', 0.2365882365),
      linearUnit('us-gal', 'US gallon', 'gal (US)', 3.785411784),
    ],
  },
  {
    key: 'time',
    label: 'Time',
    note: 'The year unit here is a 365-day year — not a calendar year.',
    defaultFrom: 'h',
    defaultTo: 's',
    defaultValue: '1',
    units: [
      linearUnit('ms', 'Millisecond', 'ms', 1e-3),
      linearUnit('s', 'Second', 's', 1),
      linearUnit('min', 'Minute', 'min', 60),
      linearUnit('h', 'Hour', 'h', 3600),
      linearUnit('d', 'Day', 'd', 86400),
      linearUnit('wk', 'Week', 'wk', 604800),
      linearUnit('yr', '365-day year', 'yr', 31536000),
    ],
  },
  {
    key: 'speed',
    label: 'Speed',
    note: null,
    defaultFrom: 'kmh',
    defaultTo: 'mps',
    defaultValue: '36',
    units: [
      linearUnit('mps', 'Meters per second', 'm/s', 1),
      linearUnit('kmh', 'Kilometers per hour', 'km/h', 1 / 3.6),
      linearUnit('mph', 'Miles per hour', 'mph', 0.44704),
      linearUnit('fps', 'Feet per second', 'ft/s', 0.3048),
      linearUnit('kn', 'Knot', 'kn', 0.5144444444444445),
    ],
  },
  {
    key: 'data',
    label: 'Data Storage',
    note: 'Decimal SI prefixes: 1 kB = 1,000 bytes, 1 MB = 1,000,000 bytes, 1 GB = 1,000,000,000 bytes. kB is not KiB — KiB (1,024 bytes) is a separate binary unit not used here.',
    defaultFrom: 'kB',
    defaultTo: 'B',
    defaultValue: '1',
    units: [
      linearUnit('b', 'Bit', 'b', 1),
      linearUnit('B', 'Byte', 'B', 8),
      linearUnit('kb', 'Kilobit', 'kb', 1e3),
      linearUnit('kB', 'Kilobyte', 'kB', 8e3),
      linearUnit('Mb', 'Megabit', 'Mb', 1e6),
      linearUnit('MB', 'Megabyte', 'MB', 8e6),
      linearUnit('Gb', 'Gigabit', 'Gb', 1e9),
      linearUnit('GB', 'Gigabyte', 'GB', 8e9),
      linearUnit('Tb', 'Terabit', 'Tb', 1e12),
      linearUnit('TB', 'Terabyte', 'TB', 8e12),
    ],
  },
  {
    key: 'frequency',
    label: 'Digital Frequency',
    note: null,
    defaultFrom: 'ghz',
    defaultTo: 'mhz',
    defaultValue: '1',
    units: [
      linearUnit('hz', 'Hertz', 'Hz', 1),
      linearUnit('khz', 'Kilohertz', 'kHz', 1e3),
      linearUnit('mhz', 'Megahertz', 'MHz', 1e6),
      linearUnit('ghz', 'Gigahertz', 'GHz', 1e9),
    ],
  },
  {
    key: 'pressure',
    label: 'Pressure',
    note: null,
    defaultFrom: 'atm',
    defaultTo: 'pa',
    defaultValue: '1',
    units: [
      linearUnit('pa', 'Pascal', 'Pa', 1),
      linearUnit('kpa', 'Kilopascal', 'kPa', 1e3),
      linearUnit('bar', 'Bar', 'bar', 1e5),
      linearUnit('atm', 'Standard atmosphere', 'atm', 101325),
      linearUnit('psi', 'Pounds per square inch', 'psi', 6894.757293168361),
    ],
  },
]

const TEMP_FORMULAS = {
  'c:f': '°F = (°C × 9/5) + 32',
  'f:c': '°C = (°F − 32) × 5/9',
  'c:k': 'K = °C + 273.15',
  'k:c': '°C = K − 273.15',
  'f:k': 'K = (°F − 32) × 5/9 + 273.15',
  'k:f': '°F = (K − 273.15) × 9/5 + 32',
}

export function categoryByKey(key) {
  return CATEGORIES.find((category) => category.key === key) ?? null
}

export function unitById(categoryKey, unitId) {
  return categoryByKey(categoryKey)?.units.find((unit) => unit.id === unitId) ?? null
}

export function parseInput(text) {
  const value = typeof text === 'string' ? text.trim() : ''
  if (value === '') return { empty: true }
  if (!INPUT_RE.test(value)) return { ok: false, error: 'Enter a valid number.' }
  const number = Number(value)
  if (!Number.isFinite(number)) return { ok: false, error: 'Enter a valid number.' }
  return { ok: true, value: number }
}

export function formatQuantity(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return String(value)
  const absolute = Math.abs(value)
  if (absolute === 0) return '0'
  if (absolute >= 1e16 || absolute < 1e-7) {
    return new Intl.NumberFormat('en-US', { notation: 'scientific', maximumSignificantDigits: 8 }).format(value)
  }
  if (Number.isInteger(value)) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
  }
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 12 }).format(value)
}

function quoteFor(from, to, value, result) {
  return `${formatQuantity(value)} ${from.symbol} = ${formatQuantity(result)} ${to.symbol}`
}

export function convertText(categoryKey, fromId, toId, text) {
  const parsed = parseInput(text)
  if (parsed.empty) return { empty: true }
  if (!parsed.ok) return parsed

  const category = categoryByKey(categoryKey)
  const from = unitById(categoryKey, fromId)
  const to = unitById(categoryKey, toId)
  if (!category || !from || !to) {
    return { ok: false, error: 'Pick a category and two units, then re-enter the value.' }
  }

  const base = from.toBase(parsed.value)
  if (!Number.isFinite(base)) {
    return { ok: false, error: 'The result is not a finite number — try a smaller value.' }
  }

  let usableBase = base
  if (categoryKey === 'temperature') {
    if (base < -KELVIN_EPSILON) {
      return {
        ok: false,
        error: `${from.name} cannot be below absolute zero (−273.15 °C · −459.67 °F · 0 K).`,
      }
    }
    usableBase = base < 0 ? 0 : base
  }

  const result = to.fromBase(usableBase)
  if (!Number.isFinite(result)) {
    return { ok: false, error: 'The result is not a finite number — try a smaller value.' }
  }

  const same = from.id === to.id
  const unitLine = same
    ? `1 ${from.symbol} = 1 ${to.symbol}`
    : categoryKey === 'temperature' && TEMP_FORMULAS[`${from.id}:${to.id}`]
      ? TEMP_FORMULAS[`${from.id}:${to.id}`]
      : `1 ${from.symbol} = ${formatQuantity(to.fromBase(from.toBase(1)))} ${to.symbol}`

  return {
    ok: true,
    value: parsed.value,
    result,
    from,
    to,
    same,
    quote: quoteFor(from, to, parsed.value, result),
    unitLine,
  }
}