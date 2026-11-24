import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  usableHostsFor,
  parseParent,
  validateRequirement,
  planSubnets,
  generateTable,
} from '../../src/features/tools/domain/subnet-calculator.js'

describe('Networking - Subnet Calculator (subnet-calculator.js)', () => {
  it('determines usable host counts according to RFC standards', () => {
    assert.equal(usableHostsFor(0), 1)  // /32 host
    assert.equal(usableHostsFor(1), 2)  // /31 p2p
    assert.equal(usableHostsFor(2), 2)  // /30: 4 - 2 = 2
    assert.equal(usableHostsFor(8), 254) // /24: 256 - 2 = 254
    assert.equal(usableHostsFor(16), 65534) // /16: 65536 - 2 = 65534
  })

  it('parses and normalizes parent network prefixes', () => {
    // Passing a host IP like 192.168.1.50/24 normalizes to network address 192.168.1.0/24
    const parsed = parseParent('192.168.1.50/24')
    assert.equal(parsed.ok, true)
    assert.equal(parsed.ipText, '192.168.1.0')
    assert.equal(parsed.prefix, 24)
    assert.equal(parsed.normalized, true)

    // Malformed formats are rejected
    assert.equal(parseParent('192.168.1.0').ok, false)
    assert.equal(parseParent('invalid').ok, false)
    assert.equal(parseParent('').empty, true)
  })

  it('validates requirement inputs for positive whole integers', () => {
    assert.deepEqual(validateRequirement('4', 'subnets'), { ok: true, value: 4 })
    assert.deepEqual(validateRequirement('50', 'hosts'), { ok: true, value: 50 })
    assert.equal(validateRequirement('0', 'subnets').ok, false)
    assert.equal(validateRequirement('-5', 'hosts').ok, false)
    assert.equal(validateRequirement('3.5', 'subnets').ok, false)
    assert.equal(validateRequirement('abc', 'subnets').ok, false)
  })

  it('plans valid subnet divisions by subnet count', () => {
    // Divide 192.168.1.0/24 into 4 subnets:
    // 4 subnets requires 2 subnet bits -> new prefix is /26
    const parent = parseParent('192.168.1.0/24')
    const plan = planSubnets(parent.ipValue, parent.prefix, 4, 'subnets')

    assert.equal(plan.ok, true)
    assert.equal(plan.parentPrefix, 24)
    assert.equal(plan.newPrefix, 26)
    assert.equal(plan.subnetBits, 2)
    assert.equal(plan.generated, 4)
    assert.equal(plan.addressesPerSubnet, 64)
    assert.equal(plan.usable, 62)

    const table = generateTable(parent.ipValue, parent.prefix, plan.newPrefix)
    assert.equal(table.rows.length, 4)
    assert.equal(table.rows[0].network, '192.168.1.0')
    assert.equal(table.rows[1].network, '192.168.1.64')
    assert.equal(table.rows[2].network, '192.168.1.128')
    assert.equal(table.rows[3].network, '192.168.1.192')
  })

  it('plans valid subnet divisions by host count requirement', () => {
    // Need at least 50 usable hosts per subnet from 10.0.0.0/24:
    // 50 hosts requires hostBits = 6 (2^6 - 2 = 62 usable >= 50)
    // New prefix = 32 - 6 = /26 (giving 4 subnets)
    const parent = parseParent('10.0.0.0/24')
    const plan = planSubnets(parent.ipValue, parent.prefix, 50, 'hosts')

    assert.equal(plan.ok, true)
    assert.equal(plan.newPrefix, 26)
    assert.equal(plan.hostBits, 6)
    assert.equal(plan.usable, 62)
    assert.equal(plan.generated, 4)
  })

  it('detects and rejects insufficient address space', () => {
    // Trying to fit 500 hosts inside a /24 (which only has 256 total addresses)
    const parent = parseParent('192.168.1.0/24')
    const hostOverflow = planSubnets(parent.ipValue, parent.prefix, 500, 'hosts')
    assert.equal(hostOverflow.ok, false)
    assert.ok(hostOverflow.error.includes('Not enough address space'))

    // Trying to fit 512 subnets in a /24 (would need /33, exceeding 32 bits)
    const subnetOverflow = planSubnets(parent.ipValue, parent.prefix, 512, 'subnets')
    assert.equal(subnetOverflow.ok, false)
    assert.ok(subnetOverflow.error.includes('Cannot fit'))
  })
})
