export const DEFAULT_COLOR = { r: 52, g: 152, b: 219, a: 1 }

const HEX_LENGTHS = new Set([3, 4, 6, 8])
const NUMBER_RE = /^[+-]?(\d+(\.\d+)?|\.\d+)$/
const PERCENT_RE = /^[+-]?(\d+(\.\d+)?|\.\d+)%$/

export function parseColor(input) {
  const text = typeof input === 'string' ? input.trim() : ''
  if (text === '') {
    return { ok: false, empty: true }
  }
  if (text.startsWith('#')) {
    return parseHex(text)
  }
  if (/^rgba?\(/i.test(text) || /^hsla?\(/i.test(text)) {
    return parseFunction(text)
  }
  return { ok: false, error: 'Invalid color' }
}

function parseHex(text) {
  const digits = text.slice(1)
  if (!/^[0-9a-f]+$/i.test(digits) || !HEX_LENGTHS.has(digits.length)) {
    return { ok: false, error: 'Invalid color' }
  }
  const pair = (start) => Number.parseInt(digits.slice(start, start + 2), 16)
  const nibble = (index) => Number.parseInt(digits[index], 16)
  const doubled = (index) => nibble(index) * 17
  let r
  let g
  let b
  let a = 1
  if (digits.length === 3) {
    r = doubled(0)
    g = doubled(1)
    b = doubled(2)
  } else if (digits.length === 4) {
    r = doubled(0)
    g = doubled(1)
    b = doubled(2)
    a = doubled(3) / 255
  } else if (digits.length === 6) {
    r = pair(0)
    g = pair(2)
    b = pair(4)
  } else {
    r = pair(0)
    g = pair(2)
    b = pair(4)
    a = pair(6) / 255
  }
  return { ok: true, color: { r, g, b, a } }
}

function parseFunction(text) {
  const match = text.match(/^(rgba?|hsla?)\(\s*([^)]*)\s*\)$/i)
  if (!match) return { ok: false, error: 'Invalid color' }
  const kind = match[1].toLowerCase()
  const body = match[2].split(',').map((part) => part.trim())
  if (kind === 'rgb' || kind === 'rgba') {
    const wantAlpha = kind === 'rgba'
    const count = wantAlpha ? 4 : 3
    if (body.length !== count) return { ok: false, error: 'Invalid color' }
    const rgb = body.slice(0, 3).map(parseChannel)
    if (rgb.some((value) => value == null)) return { ok: false, error: 'Invalid color' }
    if (wantAlpha) {
      const alpha = parseAlpha(body[3])
      if (alpha == null) return { ok: false, error: 'Invalid color' }
      return { ok: true, color: { r: rgb[0], g: rgb[1], b: rgb[2], a: alpha } }
    }
    return { ok: true, color: { r: rgb[0], g: rgb[1], b: rgb[2], a: 1 } }
  }
  const wantAlpha = kind === 'hsla'
  const count = wantAlpha ? 4 : 3
  if (body.length !== count) return { ok: false, error: 'Invalid color' }
  const hue = toFinite(body[0], 0, 360)
  const sat = parsePercent(body[1], 0, 100)
  const light = parsePercent(body[2], 0, 100)
  if (hue == null || sat == null || light == null) {
    return { ok: false, error: 'Invalid color' }
  }
  if (wantAlpha) {
    const alpha = parseAlpha(body[3])
    if (alpha == null) return { ok: false, error: 'Invalid color' }
    return { ok: true, color: { ...hslToRgb(hue, sat, light), a: alpha } }
  }
  return { ok: true, color: { ...hslToRgb(hue, sat, light), a: 1 } }
}

function parseChannel(value) {
  if (!NUMBER_RE.test(value)) return null
  const number = Number.parseFloat(value)
  if (!Number.isFinite(number) || number < 0 || number > 255) return null
  return Math.round(number)
}

function parseAlpha(value) {
  if (!NUMBER_RE.test(value)) return null
  const number = Number.parseFloat(value)
  if (!Number.isFinite(number) || number < 0 || number > 1) return null
  return roundAlpha(number)
}

function toFinite(value, min, max) {
  if (!NUMBER_RE.test(value)) return null
  const number = Number.parseFloat(value)
  if (!Number.isFinite(number) || number < min || number > max) return null
  return number
}

function parsePercent(value, min, max) {
  if (!PERCENT_RE.test(value)) return null
  const number = Number.parseFloat(value)
  if (!Number.isFinite(number) || number < min || number > max) return null
  return number
}

function roundAlpha(alpha) {
  const rounded = Math.round(alpha * 1000) / 1000
  return Math.min(1, Math.max(0, rounded))
}

function hslToRgb(hue, sat, light) {
  const h = ((hue % 360) + 360) % 360
  const s = sat / 100
  const l = light / 100
  if (s === 0) {
    const v = Math.round(l * 255)
    return { r: v, g: v, b: v }
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const toRgb = (t) => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }
  return {
    r: Math.round(toRgb(h / 360 + 1 / 3) * 255),
    g: Math.round(toRgb(h / 360) * 255),
    b: Math.round(toRgb(h / 360 - 1 / 3) * 255),
  }
}

export function rgbToHsl(r, g, b) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const delta = max - min
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)
    if (max === rn) {
      h = (gn - bn) / delta + (gn < bn ? 6 : 0)
    } else if (max === gn) {
      h = (bn - rn) / delta + 2
    } else {
      h = (rn - gn) / delta + 4
    }
    h /= 6
    h *= 360
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function toHex(color) {
  return `#${channelHex(color.r)}${channelHex(color.g)}${channelHex(color.b)}`
}

export function toHex8(color) {
  return `${toHex(color)}${channelHex(Math.round(color.a * 255))}`
}

function channelHex(value) {
  return Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')
}

export function toRgb(color) {
  return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`
}

export function toRgba(color) {
  return `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${formatAlpha(color.a)})`
}

export function toHsl(color) {
  const { h, s, l } = rgbToHsl(color.r, color.g, color.b)
  return `hsl(${h}, ${s}%, ${l}%)`
}

export function toHsla(color) {
  const { h, s, l } = rgbToHsl(color.r, color.g, color.b)
  return `hsla(${h}, ${s}%, ${l}%, ${formatAlpha(color.a)})`
}

function formatAlpha(alpha) {
  if (alpha === 0 || alpha === 1) return String(alpha)
  return String(roundAlpha(alpha))
}

export function toPicker(color) {
  return toHex(color)
}

export function copyText(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => legacyCopy(text),
    )
  }
  return Promise.resolve(legacyCopy(text))
}

function legacyCopy(text) {
  if (typeof document === 'undefined') return false
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.top = '0'
  area.style.left = '0'
  area.style.opacity = '0'
  area.style.pointerEvents = 'none'
  document.body.appendChild(area)
  area.focus()
  area.select()
  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }
  document.body.removeChild(area)
  return copied
}