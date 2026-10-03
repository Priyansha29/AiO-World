const POSITION_RE = /position\s+(\d+)/
const LINE_COL_RE = /(?:at line\s+(\d+)\s+column\s+(\d+))/i

export const SAMPLE_JSON = `{
  "name": "Alex",
  "skills": ["C++", "Python", "React"],
  "student": true,
  "semester": 4
}`

export function analyzeJson(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    return { ok: false, valid: false, empty: true }
  }
  try {
    return { ok: true, valid: true, value: JSON.parse(text) }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { ok: false, valid: false, error: describeError(message, text) }
  }
}

export function describeError(message, text) {
  const positionMatch = message.match(POSITION_RE)
  if (positionMatch) {
    const position = Math.min(Number(positionMatch[1]), text.length)
    const before = text.slice(0, position)
    const lineStart = before.lastIndexOf('\n') + 1
    const nextNewline = text.indexOf('\n', position)
    const lineEnd = nextNewline === -1 ? text.length : nextNewline
    const column = position - lineStart + 1
    const line = before.split('\n').length
    return {
      message,
      position,
      line,
      column,
      snippet: {
        line: text.slice(lineStart, lineEnd),
        column,
        caret: `${' '.repeat(Math.max(0, column - 1))}^`,
      },
    }
  }
  const lineCol = message.match(LINE_COL_RE)
  if (lineCol) {
    return { message, position: null, line: Number(lineCol[1]), column: Number(lineCol[2]) }
  }
  return { message, position: null, line: null, column: null }
}

export function formatJson(text, indent) {
  const parsed = analyzeJson(text)
  if (!parsed.ok) return { ok: false, empty: parsed.empty, error: parsed.error }
  const spaces = indent === 4 ? 4 : 2
  return { ok: true, output: JSON.stringify(parsed.value, null, spaces) }
}

export function minifyJson(text) {
  const parsed = analyzeJson(text)
  if (!parsed.ok) return { ok: false, empty: parsed.empty, error: parsed.error }
  return { ok: true, output: JSON.stringify(parsed.value) }
}

export async function copyText(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
    }
  }
  return legacyCopy(text)
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