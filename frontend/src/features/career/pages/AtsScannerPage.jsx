import { useState } from 'react'
import Navbar from '../../../components/Navbar'
import PlatformNav from '../../../components/platform/PlatformNav'
import { ATS_LABEL, analyzeResume } from '../domain/ats-scanner'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const pdfjsWorker = new URL('pdfjs-dist/legacy/build/pdf.worker.mjs', import.meta.url)
pdfjsLibGlobal.workerSrc = pdfjsWorker.href

let pdfjsLibGlobal
try {
  pdfjsLibGlobal = { workerSrc: pdfjsWorker.href }
} catch {}

export default function AtsScannerPage() {
  const [resumeText, setResumeText] = useState('')
  const [jdText, setJdText] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const extractFromFile = async (f) => {
    if (!f) return
    setError('')
    if (f.type !== 'application/pdf') {
      setError('Only PDF files are supported.')
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB.')
      return
    }
    setFile(f)
    setLoading(true)
    try {
      const buf = await f.arrayBuffer()
      const pdf = await getDocument({ data: buf, worker: pdfjsWorker }).promise
      let text = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map((it) => it.str).join(' ') + '\n'
      }
      setResumeText(text)
      setLoading(false)
    } catch {
      setLoading(false)
      setError('Failed to extract text from PDF. Try pasting text manually.')
    }
  }

  const runAnalysis = () => {
    setError('')
    const res = analyzeResume(resumeText, jdText)
    if (!res.valid) {
      setError(res.message)
      setResult(null)
      return
    }
    setResult(res)
  }

  const reset = () => {
    setResumeText('')
    setJdText('')
    setFile(null)
    setError('')
    setResult(null)
  }

  return (
    <main className="rb-page" id="top">
      <Navbar />
      <div className="rb-shell">
        <header className="rb-hero">
          <p className="rb-hero__eyebrow">Career · ATS Scanner</p>
          <h1 className="rb-hero__title">ATS Readiness Check</h1>
          <p className="rb-hero__sub">
            Local, heuristic analysis. No data leaves your browser. Label: <strong>{ATS_LABEL}</strong> — not a hiring guarantee.
          </p>
        </header>
        <PlatformNav />

        <div className="rb-container" style={{ marginTop: '1.5rem' }}>
          <div className="rb-editor">
            <section className="rb-section">
              <h2 className="rb-section__title">Upload Resume (PDF)</h2>
              <div
                className="rb-card"
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); extractFromFile(e.dataTransfer.files[0]) }}
                style={{ textAlign: 'center', padding: '2rem' }}
              >
                <input id="ats-file" type="file" accept="application/pdf" onChange={(e) => extractFromFile(e.target.files[0])} style={{ display: 'none' }} />
                <label htmlFor="ats-file" className="rb-btn rb-btn--primary" style={{ cursor: 'pointer' }}>Choose PDF</label>
                <p className="rb-help" style={{ marginTop: '0.75rem' }}>Drag &amp; drop PDF here, or click to browse. Max 5MB.</p>
                {file && <p className="rb-help">Selected: {file.name}</p>}
                {loading && <p className="rb-help">Extracting text...</p>}
              </div>
              <div className="rb-field" style={{ marginTop: '1rem' }}>
                <label className="rb-field__label">Or paste resume text</label>
                <textarea className="rb-textarea" rows={8} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste resume content here..." />
              </div>
            </section>
            <section className="rb-section">
              <h2 className="rb-section__title">Target Job Description</h2>
              <div className="rb-field">
                <label className="rb-field__label">Job Description (optional)</label>
                <textarea className="rb-textarea" rows={6} value={jdText} onChange={(e) => setJdText(e.target.value)} placeholder="Paste job description to enable keyword comparison..." />
                <small className="rb-help">Including JD enables meaningful keyword coverage. Without JD, results are a general review.</small>
              </div>
            </section>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="rb-btn rb-btn--primary" onClick={runAnalysis} disabled={loading || !resumeText.trim()}>Analyze Resume</button>
              <button className="rb-btn rb-btn--ghost" onClick={reset}>Reset</button>
            </div>
            {error && <p className="rb-help" style={{ color: 'var(--accent)', marginTop: '0.75rem' }}>{error}</p>}
          </div>

          <div className="rb-preview-pane">
            {result && result.valid ? (
              <div className="rb-preview" style={{ padding: '1.75rem' }}>
                <h2 style={{ margin: '0 0 0.5rem' }}>{ATS_LABEL}</h2>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>{result.score}/100</div>
                <p className="rb-help" style={{ marginBottom: '1rem' }}>Heuristic estimate — not a guarantee. Processed locally.</p>

                {result.details.strengths.length > 0 && (
                  <section style={{ marginBottom: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Strengths</h3>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                      {result.details.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </section>
                )}

                {result.details.issues.length > 0 && (
                  <section style={{ marginBottom: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Potential Issues</h3>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                      {result.details.issues.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </section>
                )}

                {result.details.foundKeywords.length > 0 && (
                  <section style={{ marginBottom: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Found Keywords (from JD)</h3>
                    <p className="rb-help">{result.details.foundKeywords.join(', ')}</p>
                  </section>
                )}

                {result.details.missingKeywords.length > 0 && (
                  <section style={{ marginBottom: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Missing Keywords (from JD)</h3>
                    <p className="rb-help">{result.details.missingKeywords.join(', ')}</p>
                  </section>
                )}

                {result.details.suggestions.length > 0 && (
                  <section>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Recommended Improvements</h3>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                      {result.details.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </section>
                )}
              </div>
            ) : (
              <div className="rb-preview" style={{ padding: '1.75rem' }}>
                <h3 style={{ margin: '0 0 0.5rem' }}>Analysis Results</h3>
                <p className="rb-help">Upload a PDF or paste text, add optional JD, then click Analyze.</p>
                <p className="rb-help" style={{ marginTop: '0.75rem' }}>Note: We don’t guarantee passing any specific ATS. This is an explainable heuristic.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}