export const SAMPLE_TEXT = 'Hello AiO World!'

const BASE64_ALPHABET = /^[A-Za-z0-9+/]+={0,2}$/

const BYTE_CHUNK = 0x8000

export function encodeToBase64(text) {
  if (typeof text !== 'string' || text === '') {
    return { ok: true, output: '' }
  }
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (let i = 0; i < bytes.length; i += BYTE_CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + BYTE_CHUNK))
  }
  return { ok: true, output: btoa(binary) }
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

export function decodeFromBase64(text) {
  if (typeof text !== 'string') {
    return { ok: true, output: '', empty: true }
  }
  const cleaned = text.replace(/[\s\u00a0]+/g, '')
  if (cleaned === '') {
    return { ok: true, output: '', empty: true }
  }
  if (!BASE64_ALPHABET.test(cleaned)) {
    return {
      ok: false,
      error:
        'Not valid Base64 - allowed characters are A-Z, a-z, 0-9, + and /, plus up to two trailing = symbols.',
    }
  }
  let binary
  try {
    binary = atob(cleaned)
  } catch {
    return { ok: false, error: 'Invalid Base64 - it could not be decoded. Check the padding.' }
  }
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  try {
    return { ok: true, output: new TextDecoder('utf-8', { fatal: true }).decode(bytes) }
  } catch {
    return {
      ok: false,
      error: 'That is valid Base64, but the result is not valid UTF-8 text - this tool decodes text only.',
    }
  }
}