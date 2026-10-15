import { useState } from 'react'
import Navbar from '../../../components/Navbar'
import PlatformNav from '../../../components/platform/PlatformNav'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { ROOSTER_MODES, roastResume } from '../domain/rooster-rules'
import { loadResume } from '../domain/resume-data'

const pdfjsWorker = new URL('pdfjs-dist/legacy/build/pdf.worker.mjs', import.meta.url)
try { getDocument({ data: new Uint8Array(), worker: pdfjsWorker }) } catch {}

export default function ResumeRoosterPage() {
  const [resumeText, setResumeText] = useState('')
  const [jdText, setJdText] = useState('')
  const [mode, setMode] = useState('friendly')
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
      const pdf = await getDocument({ data: buf, disableWorker: true }).promise
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

  const useBuilderData = () => {
    const rb = loadResume()
    let text = rb.personal.fullName + '\n'
    if (rb.personal.email) text += rb.personal.email + '\n'
    if (rb.summary) text += 'Summary:\n' + rb.summary + '\n'
    rb.education.forEach((e) => { text += `Education: ${e.degree} ${e.field} at ${e.institution} ${e.start}-${e.end}\n` })
    rb.experience.forEach((e) => { text += `Experience: ${e.role} at ${e.organization} ${e.start}-${e.end}\n${e.responsibilities}\n` })
    rb.projects.forEach((p) => { text += `Project: ${p.name}\n${p.description}\nTech: ${p.technologies}\n` })
    if (rb.skills.technical) text += 'Skills: ' + rb.skills.technical + ' ' + rb.skills.tools + ' ' + rb.skills.other + '\n'
    rb.certifications.forEach((c) => { text += `Certification: ${c.name} ${c.issuer} ${c.date}\n` })
    setResumeText(text)
  }

  const roast = () => {
    setError('')
    if (!resumeText.trim() || resumeText.trim().length < 30) {
      setError('Insufficient resume text to roast. Upload PDF, paste text, or use Resume Builder data.')
      return
    }
    setResult(roastResume(resumeText, mode))
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
          <p className="rb-hero__eyebrow">Career · Resume Rooster</p>
          <h1 className="rb-hero__title">Your resume is about to get cooked. 🐓</h1>
          <p className="rb-hero__sub">Rooster roasts the weak parts, then gives genuinely useful fixes. Select mode, feed it your resume.</p>
        </header>
        <PlatformNav />

        <div className="rb-container" style={{ marginTop: '1.5rem' }}>
          <div className="rb-editor">
            <section className="rb-section">
              <h2 className="rb-section__title">Roast Mode</h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {ROOSTER_MODES.map((m) => (
                  <button key={m.id} className={`rb-btn ${mode === m.id ? 'rb-btn--primary' : ''}`} onClick={() => setMode(m.id)}>{m.label}</button>
                ))}
              </div>
              <p className="rb-help" style={{ marginTop: '0.5rem' }}>Mode changes tone, not facts.</p>
            </section>

            <section className="rb-section">
              <h2 className="rb-section__title">Resume Input</h2>
              <div className="rb-card" style={{ padding: '1.25rem' }}>
                <input id="rr-file" type="file" accept="application/pdf" onChange={(e) => extractFromFile(e.target.files[0])} style={{ display: 'none' }} />
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <label htmlFor="rr-file" className="rb-btn rb-btn--primary" style={{ cursor: 'pointer' }}>Upload PDF</label>
                  <button className="rb-btn" onClick={useBuilderData}>Use Resume Builder Data</button>
                </div>
                <p className="rb-help" style={{ marginTop: '0.5rem' }}>Max 5MB. Or paste text below.</p>
                {file && <p className="rb-help">Selected: {file.name}</p>}
                {loading && <p className="rb-help">Extracting...</p>}
              </div>
              <div className="rb-field" style={{ marginTop: '1rem' }}>
                <label className="rb-field__label">Paste resume text</label>
                <textarea className="rb-textarea" rows={6} value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
              </div>
            </section>

            <section className="rb-section">
              <h2 className="rb-section__title">Job Description (optional)</h2>
              <textarea className="rb-textarea" rows={4} value={jdText} onChange={(e) => setJdText(e.target.value)} placeholder="Helps with relevant feedback..." />
            </section>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="rb-btn rb-btn--primary" onClick={roast} disabled={loading}>Roast My Resume</button>
              <button className="rb-btn rb-btn--ghost" onClick={reset}>Start Over</button>
            </div>
            {error && <p className="rb-help" style={{ color: 'var(--accent)', marginTop: '0.75rem' }}>{error}</p>}
          </div>

          <div className="rb-preview-pane">
            <div className="rb-preview" style={{ padding: '1.5rem' }}>
              <h2 style={{ margin: '0 0 0.5rem' }}>Rooster Verdict</h2>
              {result ? (
                <>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.75rem' }}>{result.verdict}</p>
                  <p className="rb-help" style={{ marginBottom: '1rem' }}>Roast Rating: {result.rating}/10 (Mode: {ROOSTER_MODES.find(m => m.id === mode)?.label})</p>
                  {result.roasts.map((r, i) => (
                    <div key={i} className="rb-card" style={{ marginBottom: '0.75rem' }}>
                      <strong style={{ color: 'var(--accent)' }}>Rooster says:</strong>
                      <p style={{ margin: '0.25rem 0' }}>{r.roast}</p>
                      <p className="rb-help"><strong>Evidence:</strong> {r.evidence}</p>
                      <p className="rb-help"><strong>Why:</strong> {r.why}</p>
                      <p className="rb-help"><strong>Fix:</strong> {r.fix}</p>
                      <p className="rb-help"><strong>Severity:</strong> {r.severity}</p>
                    </div>
                  ))}
                </>
              ) : (
                <p className="rb-help">Feed me your resume and I'll cook it - constructively.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}