import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  ROOSTER_MODES,
  ROOSTER_VERDICTS,
  roastResume,
} from '../../src/features/career/domain/rooster-rules.js'

describe('Career - Resume Rooster (rooster-rules.js)', () => {
  it('exposes defined roast modes and verdict templates', () => {
    assert.equal(ROOSTER_MODES.length, 3)
    const modeIds = ROOSTER_MODES.map((m) => m.id)
    assert.deepEqual(modeIds, ['friendly', 'savage', 'recruiter'])

    assert.ok(ROOSTER_VERDICTS.friendly.length > 0)
    assert.ok(ROOSTER_VERDICTS.savage.length > 0)
    assert.ok(ROOSTER_VERDICTS.recruiter.length > 0)
  })

  it('detects generic buzzwords and generates evidence-based feedback across modes', () => {
    const resume = 'I am a hardworking, passionate team player looking for growth.'

    for (const mode of ['friendly', 'savage', 'recruiter']) {
      const result = roastResume(resume, mode)
      assert.ok(result.roasts.length > 0)
      assert.ok(result.roasts.some((r) => r.evidence === 'hardworking' || r.evidence === 'passionate'))
      assert.ok(result.verdict)
      assert.ok(result.rating >= 3 && result.rating <= 10)
    }
  })

  it('flags projects described with tech stack but lacking measurable outcomes', () => {
    const resume = 'Worked on an e-commerce website using React and Node.js.'
    const result = roastResume(resume, 'savage')
    assert.ok(result.roasts.some((r) => r.section === 'Projects'))
    assert.ok(result.roasts.some((r) => r.evidence.includes('focus on tech, not outcomes')))
  })

  it('recognizes outcome-oriented project bullets and does not flag them', () => {
    const resume = 'Worked on microservices using Go which improved response latency by 35% and reduced memory usage.'
    const result = roastResume(resume, 'friendly')
    // Should not trigger the projectNoOutcome roast
    assert.ok(!result.roasts.some((r) => r.evidence.includes('focus on tech, not outcomes')))
  })

  it('provides clean baseline encouragement when no buzzwords or antipatterns are found', () => {
    const cleanResume = 'Architected distributed event pipelines and led data infrastructure migrations.'
    const result = roastResume(cleanResume, 'friendly')
    assert.equal(result.roasts.length, 1)
    assert.equal(result.roasts[0].evidence, 'Solid baseline structure')
    assert.equal(result.rating, 9)
  })
})
