import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  extractKeywords,
  analyzeResume,
} from '../../src/features/career/domain/ats-scanner.js'

describe('Career - ATS Scanner (ats-scanner.js)', () => {
  it('extracts technical keywords and filters out common stop words', () => {
    const text = 'Experienced software engineer skilled in React, Node.js, TypeScript, Docker, and PostgreSQL.'
    const keywords = extractKeywords(text)
    assert.ok(keywords.includes('react'))
    assert.ok(keywords.includes('typescript'))
    assert.ok(keywords.includes('docker'))
    assert.ok(keywords.includes('postgresql'))
    // Common words should not be included
    assert.ok(!keywords.includes('and'))
    assert.ok(!keywords.includes('in'))
  })

  it('rejects resumes that are too short to evaluate', () => {
    const shortText = 'John Doe, software developer.'
    const result = analyzeResume(shortText, '')
    assert.equal(result.valid, false)
    assert.ok(result.message.includes('Insufficient resume text'))
  })

  it('performs general heuristic review when no job description is supplied', () => {
    const resume = `
      John Doe
      Software Engineer
      
      Education:
      B.Tech in Computer Science, State University, 2024
      
      Skills:
      JavaScript, React, Node.js, Git, HTML, CSS, REST APIs, Python
      
      Experience:
      Software Engineering Intern at Tech Corp.
      Developed responsive web applications and integrated backend REST APIs.
      
      Projects:
      E-commerce web application using React and Node.js.
      Implemented user authentication, shopping cart, and payment processing.
      Deployed to cloud using Docker containers.
    `
    const result = analyzeResume(resume, '')
    assert.equal(result.valid, true)
    assert.equal(result.details.hasJD, false)
    assert.ok(result.score > 50)
    assert.equal(result.details.sections.education, true)
    assert.equal(result.details.sections.skills, true)
    assert.equal(result.details.sections.experience, true)
    assert.equal(result.details.sections.projects, true)
    assert.ok(result.details.strengths.includes('Education section detected'))
    assert.ok(result.details.strengths.includes('Skills section detected'))
  })

  it('scores keyword coverage and identifies missing terms when a Job Description is provided', () => {
    const resume = `
      Alex Smith
      Full Stack Developer
      
      Education:
      B.S. in Computer Science
      
      Skills:
      JavaScript, React, HTML, CSS, Git, Node.js
      
      Experience:
      Built frontend components and user interfaces for web platforms.
      
      Projects:
      Full-stack dashboard with real-time analytics.
    `
    const jobDescription = `
      We are looking for a Senior Developer with strong skills in React, TypeScript, GraphQL, Kubernetes, and Docker.
    `
    const result = analyzeResume(resume, jobDescription)
    assert.equal(result.valid, true)
    assert.equal(result.details.hasJD, true)
    assert.ok(result.score > 0)
    // Found keywords should contain 'react'
    assert.ok(result.details.foundKeywords.includes('react'))
    // Missing keywords should include JD terms like 'typescript', 'kubernetes', 'docker', 'graphql'
    assert.ok(result.details.missingKeywords.some((k) => k.includes('typescript') || k.includes('docker')))
  })

  it('flags missing sections and long resume warnings', () => {
    // Resume without Education or Experience headings
    const minimalResume = `
      Jane Doe
      Developer
      
      Skills:
      Python, Django, SQL, Git, Linux
      
      Projects:
      Built an automated web scraper in Python to extract product prices.
      Processed records and stored structured data into SQLite database.
      ` + ' word'.repeat(900) // very long text to trigger clarity warning

    const result = analyzeResume(minimalResume, '')
    assert.equal(result.valid, true)
    assert.equal(result.details.sections.education, false)
    assert.ok(result.details.issues.includes('Missing Education section heading'))
    assert.ok(result.details.suggestions.some((s) => s.includes('Long resume')))
  })
})
