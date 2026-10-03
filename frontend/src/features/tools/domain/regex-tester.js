export const FLAGS = [
  { key: 'g', label: 'g', title: 'Global - find every match, not just the first' },
  { key: 'i', label: 'i', title: 'Case insensitive' },
  { key: 'm', label: 'm', title: 'Multiline - ^ and $ match line boundaries' },
  { key: 's', label: 's', title: 'Dot matches newline' },
  { key: 'u', label: 'u', title: 'Unicode mode' },
]

export const DEFAULT_FLAGS = ['g']

const MAX_MATCHES = 5000

export function buildFlags(flagKeys) {
  return FLAGS.map((flag) => flag.key)
    .filter((key) => Array.isArray(flagKeys) && flagKeys.includes(key))
    .join('')
}

export function testRegex(pattern, flagKeys, text) {
  const flags = buildFlags(flagKeys)
  if (typeof pattern !== 'string' || pattern === '') {
    return { ok: false, valid: false, empty: true, flags, global: flags.includes('g'), matches: [], count: 0, truncated: false }
  }
  let regex
  try {
    regex = new RegExp(pattern, flags)
  } catch (error) {
    return {
      ok: false,
      valid: false,
      flags,
      global: flags.includes('g'),
      error: error instanceof Error ? error.message : String(error),
      matches: [],
      count: 0,
      truncated: false,
    }
  }
  const searchText = typeof text === 'string' ? text : ''
  const { matches, truncated } = collectMatches(regex, searchText)
  return {
    ok: true,
    valid: true,
    flags,
    global: flags.includes('g'),
    matches,
    count: matches.length,
    truncated,
  }
}

function collectMatches(regex, text) {
  const matches = []
  let truncated = false
  if (regex.global) {
    regex.lastIndex = 0
    let match = regex.exec(text)
    while (match !== null) {
      matches.push(toMatchEntry(match))
      if (matches.length >= MAX_MATCHES) {
        truncated = true
        break
      }
      if (match[0].length === 0) {
        regex.lastIndex += 1
      }
      match = regex.exec(text)
    }
    regex.lastIndex = 0
  } else {
    const match = regex.exec(text)
    if (match !== null) {
      matches.push(toMatchEntry(match))
    }
  }
  return { matches, truncated }
}

function toMatchEntry(match) {
  const groups = match.slice(1).map((group) => (typeof group === 'string' ? group : null))
  const named = match.groups && Object.keys(match.groups).length > 0 ? { ...match.groups } : null
  return {
    value: match[0],
    index: match.index,
    length: match[0].length,
    groups: groups.length > 0 ? groups : null,
    named,
  }
}

export function copyResultsText(result) {
  if (!result || !result.valid) return ''
  const lines = [`${result.count} ${result.count === 1 ? 'match' : 'matches'}`]
  result.matches.forEach((match, i) => {
    let line = `${i + 1}. ${JSON.stringify(match.value)} - index ${match.index}`
    if (match.groups) {
      line += `, groups [${match.groups.map((group) => (group === null ? 'undefined' : JSON.stringify(group))).join(', ')}]`
    }
    if (match.named) {
      line += `, named ${JSON.stringify(match.named)}`
    }
    lines.push(line)
  })
  return lines.join('\n')
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