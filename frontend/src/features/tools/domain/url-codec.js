export const SAMPLE_TEXT = 'hello world & ai'

export function encodeUrlComponent(text) {
  if (typeof text !== 'string' || text === '') {
    return { ok: true, output: '' }
  }
  return { ok: true, output: encodeURIComponent(text) }
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

export function decodeUrlComponent(text) {
  if (typeof text !== 'string' || text === '') {
    return { ok: true, output: '', empty: true }
  }
  try {
    return { ok: true, output: decodeURIComponent(text) }
  } catch {
    return {
      ok: false,
      error:
        'Malformed percent-encoding — a % must be followed by two hex digits. Inputs like "hello%2" or a lone "%" have no valid decoding, so nothing was converted.',
    }
  }
}