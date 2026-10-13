/**
 * ATS Scanner - heuristic analysis (local, explainable).
 * Score categories: structure (25), keywords (40), formatting (20), clarity (15). Total 100.
 * Label: "AiO ATS Readiness Estimate" - not a hiring guarantee.
 */

export const ATS_LABEL = 'AiO ATS Readiness Estimate'

export const SECTION_PATTERNS = [
  { key: 'education', patterns: [/education/i, /academic/i, /qualification/i, /degree/i] },
  { key: 'experience', patterns: [/experience/i, /work experience/i, /employment/i, /internship/i, /volunteer/i] },
  { key: 'projects', patterns: [/project/i, /portfolio/i, /personal project/i] },
  { key: 'skills', patterns: [/skill/i, /technical skill/i, /key skill/i, /competenc/i] },
  { key: 'certifications', patterns: [/certif/i, /award/i, /achievement/i, /license/i] },
]

export const COMMON_FORMATTING_ISSUES = [
  { check: (text) => (text.match(/[^\w\s,.;:\-()\n\r]/g) || []).length > 50, msg: 'Unusually high number of special symbols detected (may hinder parsing).' },
  { check: (text) => /\t{2,}/.test(text), msg: 'Excessive tab spacing detected.' },
  { check: (text) => /\|{3,}/.test(text), msg: 'Heavy use of pipe characters (can confuse parsers).' },
]

export const extractKeywords = (text) => {
  if (!text) return []
  const tokens = text.toLowerCase().match(/\b[a-zA-Z][a-zA-Z+.#-]{2,}\b/g) || []
  const stop = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'are', 'was', 'but', 'not', 'you', 'your', 'can', 'will', 'all', 'any', 'has', 'had', 'have', 'been', 'their', 'there', 'they'])
  return [...new Set(tokens.filter(t => !stop.has(t) && t.length > 2))]
}

export const detectSections = (text) => {
  const found = {}
  for (const s of SECTION_PATTERNS) {
    found[s.key] = s.patterns.some(p => p.test(text))
  }
  return found
}

export const analyzeResume = (resumeText, jdText) => {
  const text = resumeText || ''
  const jd = jdText || ''
  if (!text.trim() || text.trim().length < 50) {
    return {
      valid: false,
      message: 'Insufficient resume text to analyze. Please upload a readable PDF or paste more text.',
      score: 0,
      details: { sections: detectSections(text), suggestions: [], strengths: [], issues: [], missingKeywords: [], foundKeywords: [] },
    }
  }

  const sections = detectSections(text)
  const keywords = extractKeywords(text)
  const jdKeywords = extractKeywords(jd)

  const strengths = []
  const issues = []
  const suggestions = []

  let structureScore = 0
  const required = ['education', 'skills']
  const nice = ['experience', 'projects', 'certifications']
  structureScore += required.filter(k => sections[k]).length * 12
  structureScore += nice.filter(k => sections[k]).length * 5
  if (sections.education) strengths.push('Education section detected')
  else issues.push('Missing Education section heading')
  if (sections.skills) strengths.push('Skills section detected')
  else issues.push('Missing Skills section heading')
  if (sections.experience) strengths.push('Experience section detected')
  else suggestions.push('Consider adding Experience/Internships if applicable')
  if (sections.projects) strengths.push('Projects section detected')
  if (structureScore > 25) structureScore = 25

  let keywordScore = 0
  if (jdKeywords.length > 0) {
    const overlap = jdKeywords.filter(k => keywords.some(kk => kk.includes(k) || k.includes(kk)))
    keywordScore = Math.min(40, Math.round((overlap.length / Math.max(1, jdKeywords.length)) * 40))
    const missing = jdKeywords.filter(k => !keywords.some(kk => kk.includes(k) || k.includes(kk))).slice(0, 10)
    return { valid: true, score: 0, details: {} } // placeholder
  } else {
    keywordScore = Math.min(40, Math.round(keywords.length / 30) * 40) // general review
  }

  let formatScore = 20
  for (const fi of COMMON_FORMATTING_ISSUES) {
    if (fi.check(text)) {
      issues.push(fi.msg)
      formatScore = Math.max(0, formatScore - 4)
    }
  }
  if (formatScore > 10) strengths.push('No obvious formatting red flags detected')
  if (formatScore < 20) suggestions.push('Keep layout simple (standard headings, avoid heavy symbols/tables)')

  let clarityScore = 15
  const wordCount = text.split(/\s+/).filter(Boolean).length
  if (wordCount >= 150 && wordCount <= 800) clarityScore = 15
  else if (wordCount < 150) { clarityScore = Math.max(5, 15 - 5); suggestions.push('Consider adding more details (projects/experience)') }
  else { clarityScore = Math.max(10, 15 - 2); suggestions.push('Long resume - consider trimming irrelevant content') }

  const total = Math.min(100, structureScore + (jdKeywords.length > 0 ? (() => {
    const overlap = jdKeywords.filter(k => keywords.some(kk => kk.includes(k) || k.includes(kk)))
    const ks = Math.min(40, Math.round((overlap.length / Math.max(1, jdKeywords.length)) * 40))
    return ks
  })() : Math.min(40, Math.round(keywords.length / 30) * 40)) + formatScore + clarityScore)
  const finalKeywordScore = jdKeywords.length > 0
    ? Math.min(40, Math.round((jdKeywords.filter(k => keywords.some(kk => kk.includes(k) || k.includes(kk))).length / Math.max(1, jdKeywords.length)) * 40))
    : Math.min(40, Math.round(keywords.length / 30) * 40)

  const overlapFinal = jdKeywords.length > 0 ? jdKeywords.filter(k => keywords.some(kk => kk.includes(k) || k.includes(kk))) : []
  const missingFinal = jdKeywords.length > 0 ? jdKeywords.filter(k => !keywords.some(kk => kk.includes(k) || k.includes(kk))).slice(0, 12) : []

  const scoreFinal = Math.min(100, structureScore + finalKeywordScore + formatScore + clarityScore)

  if (jdText && jdKeywords.length > 0) {
    strengths.push(`Keyword coverage computed against ${jdKeywords.length} JD terms`)
  }

  return {
    valid: true,
    score: scoreFinal,
    details: {
      sections,
      strengths: [...new Set(strengths)],
      issues: [...new Set(issues)],
      suggestions: [...new Set(suggestions.concat(missingFinal.length > 0 ? ['Address missing relevant keywords where genuinely applicable'] : []))],
      foundKeywords: overlapFinal.slice(0, 15),
      missingKeywords: missingFinal,
      hasJD: !!jdText,
      wordCount,
    },
  }
}