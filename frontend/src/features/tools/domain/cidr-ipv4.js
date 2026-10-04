export const MAX_PREFIX = 32

const OCTET_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
const PREFIX_RE = /^\d{1,2}$/

export function ipToText(value) {
  const v = value >>> 0
  return `${(v >>> 24) & 255}.${(v >>> 16) & 255}.${(v >>> 8) & 255}.${v & 255}`
}

export function binaryToText(value) {
  const v = value >>> 0
  return [((v >>> 24) & 255).toString(2).padStart(8, '0'), ((v >>> 16) & 255).toString(2).padStart(8, '0'), ((v >>> 8) & 255).toString(2).padStart(8, '0'), (v & 255).toString(2).padStart(8, '0')].join('.')
}

export function parseIpv4(text) {
  const value = typeof text === 'string' ? text.trim() : ''
  const match = value.match(OCTET_RE)
  if (!match) return { ok: false, error: 'Invalid IPv4 address' }
  const octets = [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])]
  if (octets.some((octet) => octet < 0 || octet > 255)) {
    return { ok: false, error: 'Invalid IPv4 address' }
  }
  const ipValue = ((octets[0] * 256 + octets[1]) * 256 + octets[2]) * 256 + octets[3]
  return { ok: true, value: ipValue >>> 0 }
}

export function parsePrefix(text) {
  const value = typeof text === 'string' ? text.trim() : ''
  if (value === '' || !PREFIX_RE.test(value)) {
    return { ok: false, error: 'Prefix must be an integer from 0 to 32' }
  }
  const prefix = Number(value)
  if (prefix < 0 || prefix > MAX_PREFIX) {
    return { ok: false, error: 'Prefix must be an integer from 0 to 32' }
  }
  return { ok: true, value: prefix }
}

export function splitCombined(text) {
  const value = typeof text === 'string' ? text.trim() : ''
  const slash = value.indexOf('/')
  if (slash === -1) return null
  return { ipPart: value.slice(0, slash).trim(), prefixPart: value.slice(slash + 1).trim() }
}

export function ipClassOf(value) {
  const first = (value >>> 24) & 255
  if (first < 128) return 'A'
  if (first < 192) return 'B'
  if (first < 224) return 'C'
  if (first < 240) return 'D'
  return 'E'
}

export function classifyAddress(value) {
  const v = value >>> 0
  if (v === 0xffffffff) return ['Limited broadcast']
  if (v === 0) return ['This network']
  const first = (v >>> 24) & 255
  const second = (v >>> 16) & 255
  const labels = []

  if (first === 10) {
    labels.push('Private')
  } else if (first === 0) {
    labels.push('This network')
  } else if (first === 127) {
    labels.push('Loopback')
  } else if (first === 172 && second >= 16 && second <= 31) {
    labels.push('Private')
  } else if (first === 192 && second === 168) {
    labels.push('Private')
  } else if (first === 169 && second === 254) {
    labels.push('Link-local')
  } else if (first === 100 && second >= 64 && second <= 127) {
    labels.push('Carrier-grade NAT')
  } else if (first === 192 && second === 0 && thirdOctet(v) === 2) {
    labels.push('Documentation (TEST-NET-1)')
  } else if (first === 198 && second === 51 && thirdOctet(v) === 100) {
    labels.push('Documentation (TEST-NET-2)')
  } else if (first === 203 && second === 0 && thirdOctet(v) === 113) {
    labels.push('Documentation (TEST-NET-3)')
  }

  if (first >= 224 && first <= 239) labels.push('Multicast')
  if (first >= 240) labels.push('Reserved (Class E)')
  if (labels.length === 0) labels.push('Public / Global')
  return labels
}

function thirdOctet(value) {
  return (value >>> 8) & 255
}

export function calculate(ipValue, prefix) {
  const hostBits = MAX_PREFIX - prefix
  const total = Math.pow(2, hostBits)
  const mask = 0xffffffff - (total - 1)
  const wildcard = total - 1
  const network = (ipValue & mask) >>> 0
  const broadcast = (network + wildcard) >>> 0

  let first
  let last
  let usable
  if (prefix === MAX_PREFIX) {
    first = network
    last = broadcast
    usable = 1
  } else if (prefix === MAX_PREFIX - 1) {
    first = network
    last = broadcast
    usable = 2
  } else {
    first = network + 1
    last = broadcast - 1
    usable = total - 2
  }

  const rawBase = {
    prefix,
    hostBits,
    total,
    usable,
    ip: ipValue,
    ipText: ipToText(ipValue),
    mask,
    maskText: ipToText(mask),
    wildcard,
    wildcardText: ipToText(wildcard),
    network,
    networkText: ipToText(network),
    broadcast,
    broadcastText: ipToText(broadcast),
    first,
    firstText: ipToText(first),
    last,
    lastText: ipToText(last),
  }
  return {
    ...rawBase,
    totalText: String(total),
    usableText: String(usable),
    className: ipClassOf(ipValue),
    types: classifyAddress(ipValue),
    binary: {
      ip: binaryToText(ipValue),
      mask: binaryToText(mask),
      network: binaryToText(network),
      wildcard: binaryToText(wildcard),
      broadcast: binaryToText(broadcast),
    },
  }
}

export function copySummary(result) {
  return [
    `IP: ${result.ipText}/${result.prefix}`,
    `Network: ${result.networkText}`,
    `Broadcast: ${result.broadcastText}`,
    `Subnet Mask: ${result.maskText}`,
    `Wildcard: ${result.wildcardText}`,
    `First Host: ${result.firstText}`,
    `Last Host: ${result.lastText}`,
    `Total Addresses: ${result.totalText}`,
    `Usable Hosts: ${result.usableText}`,
  ].join('\n')
}

export const QUICK_REFERENCE = [
  { prefix: 8, mask: '255.0.0.0', total: '16,777,216', usable: '16,777,214' },
  { prefix: 16, mask: '255.255.0.0', total: '65,536', usable: '65,534' },
  { prefix: 24, mask: '255.255.255.0', total: '256', usable: '254' },
  { prefix: 25, mask: '255.255.255.128', total: '128', usable: '126' },
  { prefix: 26, mask: '255.255.255.192', total: '64', usable: '62' },
  { prefix: 27, mask: '255.255.255.224', total: '32', usable: '30' },
  { prefix: 28, mask: '255.255.255.240', total: '16', usable: '14' },
  { prefix: 29, mask: '255.255.255.248', total: '8', usable: '6' },
  { prefix: 30, mask: '255.255.255.252', total: '4', usable: '2' },
  { prefix: 31, mask: '255.255.255.254', total: '2', usable: '2' },
  { prefix: 32, mask: '255.255.255.255', total: '1', usable: '1' },
]

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