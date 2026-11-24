import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  parseIpv4,
  parsePrefix,
  splitCombined,
  ipToText,
  binaryToText,
  ipClassOf,
  classifyAddress,
  calculate,
} from '../../src/features/tools/domain/cidr-ipv4.js'

describe('Networking - CIDR IPv4 Calculator (cidr-ipv4.js)', () => {
  it('parses valid IPv4 dotted-decimal addresses into 32-bit integers', () => {
    const loopback = parseIpv4('127.0.0.1')
    assert.equal(loopback.ok, true)
    assert.equal(loopback.value, 2130706433)
    assert.equal(ipToText(loopback.value), '127.0.0.1')

    const zero = parseIpv4('0.0.0.0')
    assert.equal(zero.ok, true)
    assert.equal(zero.value, 0)

    const broadcast = parseIpv4('255.255.255.255')
    assert.equal(broadcast.ok, true)
    assert.equal(broadcast.value, 4294967295)
  })

  it('rejects malformed or out-of-range IPv4 addresses', () => {
    assert.equal(parseIpv4('256.0.0.1').ok, false)
    assert.equal(parseIpv4('192.168.1').ok, false)
    assert.equal(parseIpv4('192.168.1.1.1').ok, false)
    assert.equal(parseIpv4('abc.def.ghi.jkl').ok, false)
    assert.equal(parseIpv4('-1.0.0.0').ok, false)
  })

  it('validates subnet prefix range between 0 and 32', () => {
    assert.equal(parsePrefix('0').ok, true)
    assert.equal(parsePrefix('24').ok, true)
    assert.equal(parsePrefix('32').ok, true)

    assert.equal(parsePrefix('-1').ok, false)
    assert.equal(parsePrefix('33').ok, false)
    assert.equal(parsePrefix('24.5').ok, false)
    assert.equal(parsePrefix('abc').ok, false)
  })

  it('splits combined IP and prefix notations', () => {
    assert.deepEqual(splitCombined('10.0.0.1/16'), { ipPart: '10.0.0.1', prefixPart: '16' })
    assert.equal(splitCombined('10.0.0.1'), null)
  })

  it('classifies IP addresses by class and address scope', () => {
    const ip10 = parseIpv4('10.0.0.1').value
    assert.equal(ipClassOf(ip10), 'A')
    assert.ok(classifyAddress(ip10).includes('Private'))

    const ipLocal = parseIpv4('127.0.0.1').value
    assert.ok(classifyAddress(ipLocal).includes('Loopback'))

    const ip192 = parseIpv4('192.168.1.1').value
    assert.equal(ipClassOf(ip192), 'C')
    assert.ok(classifyAddress(ip192).includes('Private'))

    const ipPublic = parseIpv4('8.8.8.8').value
    assert.ok(classifyAddress(ipPublic).includes('Public / Global'))

    const ipMulticast = parseIpv4('224.0.0.1').value
    assert.equal(ipClassOf(ipMulticast), 'D')
    assert.ok(classifyAddress(ipMulticast).includes('Multicast'))
  })

  describe('Boundary and standard subnet calculations (/0, /24, /31, /32)', () => {
    it('calculates standard /24 subnet boundaries accurately', () => {
      const ip = parseIpv4('192.168.1.100').value
      const result = calculate(ip, 24)

      assert.equal(result.networkText, '192.168.1.0')
      assert.equal(result.broadcastText, '192.168.1.255')
      assert.equal(result.maskText, '255.255.255.0')
      assert.equal(result.wildcardText, '0.0.0.255')
      assert.equal(result.firstText, '192.168.1.1')
      assert.equal(result.lastText, '192.168.1.254')
      assert.equal(result.total, 256)
      assert.equal(result.usable, 254)
    })

    it('calculates /0 full-internet network block', () => {
      const ip = parseIpv4('0.0.0.0').value
      const result = calculate(ip, 0)

      assert.equal(result.networkText, '0.0.0.0')
      assert.equal(result.broadcastText, '255.255.255.255')
      assert.equal(result.maskText, '0.0.0.0')
      assert.equal(result.wildcardText, '255.255.255.255')
      assert.equal(result.total, 4294967296)
      assert.equal(result.usable, 4294967294)
    })

    it('calculates /31 point-to-point link (RFC 3021)', () => {
      // In /31, both host addresses are usable for point-to-point links
      const ip = parseIpv4('10.0.0.0').value
      const result = calculate(ip, 31)

      assert.equal(result.networkText, '10.0.0.0')
      assert.equal(result.broadcastText, '10.0.0.1')
      assert.equal(result.maskText, '255.255.255.254')
      assert.equal(result.firstText, '10.0.0.0')
      assert.equal(result.lastText, '10.0.0.1')
      assert.equal(result.total, 2)
      assert.equal(result.usable, 2)
    })

    it('calculates /32 single host route', () => {
      const ip = parseIpv4('192.168.1.50').value
      const result = calculate(ip, 32)

      assert.equal(result.networkText, '192.168.1.50')
      assert.equal(result.broadcastText, '192.168.1.50')
      assert.equal(result.maskText, '255.255.255.255')
      assert.equal(result.firstText, '192.168.1.50')
      assert.equal(result.lastText, '192.168.1.50')
      assert.equal(result.total, 1)
      assert.equal(result.usable, 1)
    })
  })

  it('produces formatted 4-octet binary strings', () => {
    const ip = parseIpv4('192.168.1.1').value
    assert.equal(binaryToText(ip), '11000000.10101000.00000001.00000001')
  })
})
