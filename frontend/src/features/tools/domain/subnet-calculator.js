import {
  calculate,
  copyText,
  ipToText,
  MAX_PREFIX,
  parseIpv4,
  parsePrefix,
  splitCombined,
} from './cidr-ipv4.js'

export const MAX_TABLE_ROWS = 256

const POSITIVE_INT_RE = /^[1-9]\d*$/

export function usableHostsFor(hostBits) {
  if (hostBits === 0) return 1
  if (hostBits === 1) return 2
  return Math.pow(2, hostBits) - 2
}

export function parseParent(text) {
  const value = typeof text === 'string' ? text.trim() : ''
  if (value === '') return { ok: false, empty: true }
  const spl = splitCombined(value)
  if (!spl) return { ok: false, error: 'Use parent / prefix form, e.g. 192.168.1.0/24.' }
  const ip = parseIpv4(spl.ipPart)
  if (!ip.ok) return { ok: false, error: ip.error }
  const prefix = parsePrefix(spl.prefixPart)
  if (!prefix.ok) return { ok: false, error: prefix.error }
  const network = calculate(ip.value, prefix.value).network
  return {
    ok: true,
    ipValue: network,
    ipText: ipToText(network),
    prefix: prefix.value,
    normalized: network !== ip.value,
  }
}

export function validateRequirement(text, mode) {
  const value = typeof text === 'string' ? text.trim() : ''
  if (value === '') return { ok: false, error: null, empty: true }
  if (!POSITIVE_INT_RE.test(value)) {
    return {
      ok: false,
      error: mode === 'subnets' ? 'Subnets must be a positive whole number.' : 'Hosts must be a positive whole number.',
    }
  }
  return { ok: true, value: Number(value) }
}

function powerOfTwoCeil(n) {
  let value = 1
  while (value < n) value *= 2
  return value
}

export function planSubnets(parentIp, parentPrefix, requirement, mode) {
  if (mode === 'subnets') {
    const generated = powerOfTwoCeil(requirement)
    let bits = 0
    let value = generated
    while (value > 1) {
      value /= 2
      bits += 1
    }
    const newPrefix = parentPrefix + bits
    if (newPrefix > MAX_PREFIX) {
      return {
        ok: false,
        error: `Cannot fit ${generated} equal-sized subnets in a /${parentPrefix} parent (would need a /${newPrefix}).`,
      }
    }
    return buildPlan(parentIp, parentPrefix, newPrefix, requirement, generated, mode)
  }

  let hostBits = 0
  while (usableHostsFor(hostBits) < requirement) hostBits += 1
  const newPrefix = MAX_PREFIX - hostBits
  if (newPrefix < parentPrefix) {
    return { ok: false, error: 'Not enough address space in the selected parent network.' }
  }
  return buildPlan(parentIp, parentPrefix, newPrefix, requirement, Math.pow(2, newPrefix - parentPrefix), mode)
}

function buildPlan(parentIp, parentPrefix, newPrefix, requested, generated, mode) {
  const subnetBits = newPrefix - parentPrefix
  const hostBits = MAX_PREFIX - newPrefix
  const addressesPerSubnet = Math.pow(2, hostBits)
  const usable = usableHostsFor(hostBits)
  const reference = calculate(0, newPrefix)

  return {
    ok: true,
    mode,
    parentPrefix,
    newPrefix,
    subnetBits,
    hostBits,
    addressesPerSubnet,
    usable,
    requested,
    generated,
    subnets: generated,
    maskText: reference.maskText,
    wildcardText: reference.wildcardText,
    totalText: String(addressesPerSubnet),
    usableText: String(usable),
    explanation:
      mode === 'subnets'
        ? {
            opening: `A /${parentPrefix} parent needs ${subnetBits} extra subnet bit${subnetBits === 1 ? '' : 's'} (2${superscript(subnetBits)} = ${Math.pow(2, subnetBits)} ≥ ${requested}) → /${newPrefix}.`,
            hostBits: `Host bits remaining: 32 − ${newPrefix} = ${hostBits}.`,
            addresses: `Addresses per subnet: 2${superscript(hostBits)} = ${addressesPerSubnet}.`,
            usableHosts: hostBits >= 2 ? `Typical usable hosts: ${addressesPerSubnet} − 2 = ${usable}.` : `Usable hosts: ${usable} (special /${newPrefix} rule).`,
          }
        : {
            opening: `${requested} usable hosts need ${hostBits} host bit${hostBits === 1 ? '' : 's'} (2${superscript(hostBits)}${hostBits >= 2 ? ' − 2' : ''} = ${usable} ≥ ${requested}) → /${newPrefix}.`,
            hostBits: `Host bits remaining: 32 − ${newPrefix} = ${hostBits}.`,
            addresses: `Addresses per subnet: 2${superscript(hostBits)} = ${addressesPerSubnet}.`,
            usableHosts: hostBits >= 2 ? `Typical usable hosts: ${addressesPerSubnet} − 2 = ${usable}.` : `Usable hosts: ${usable} (special /${newPrefix} rule).`,
          },
  }
}

function superscript(n) {
  return String(n).replace(/[0-9]/g, (digit) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(digit)])
}

export function generateTable(parentIp, parentPrefix, newPrefix) {
  const stride = Math.pow(2, newPrefix - parentPrefix)
  const size = Math.pow(2, 32 - newPrefix)
  const total = stride
  const shown = Math.min(total, MAX_TABLE_ROWS)
  const rows = []
  for (let i = 0; i < shown; i += 1) {
    const base = parentIp + i * size
    const r = calculate(base, newPrefix)
    rows.push({
      index: i + 1,
      network: r.networkText,
      first: r.firstText,
      last: r.lastText,
      broadcast: r.broadcastText,
    })
  }
  return { rows, total, truncated: total > shown }
}

export function copySummaryText(parentText, result) {
  return [
    `Parent: ${parentText}`,
    `New Prefix: /${result.newPrefix}`,
    `Subnet Mask: ${result.maskText}`,
    `Subnets: ${result.generated}`,
    `Addresses/Subnet: ${result.addressesPerSubnet}`,
    `Usable Hosts/Subnet: ${result.usable}`,
  ].join('\n')
}

export function copyTableText(table) {
  const lines = ['Subnet\tNetwork\tFirst Host\tLast Host\tBroadcast']
  for (const row of table.rows) {
    lines.push(`${row.index}\t${row.network}\t${row.first}\t${row.last}\t${row.broadcast}`)
  }
  if (table.truncated) lines.push(`… ${table.total - table.rows.length} more subnets not shown.`)
  return lines.join('\n')
}

export { copyText }