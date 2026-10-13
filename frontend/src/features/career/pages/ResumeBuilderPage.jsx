import { useEffect, useState } from 'react'
import Navbar from '../../../components/Navbar'
import PlatformNav from '../../../components/platform/PlatformNav'
import ResumeForm from '../components/resume/ResumeForm'
import ResumePreview from '../components/resume/ResumePreview'
import { clearResume, createEmptyResume, loadResume, saveResume, TEMPLATES } from '../domain/resume-data'
import '../resume.css'

export default function ResumeBuilderPage() {
  const [resume, setResume] = useState(createEmptyResume())
  const [template, setTemplate] = useState('single-column')
  const [showTips, setShowTips] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    setResume(loadResume())
  }, [])

  useEffect(() => {
    saveResume(resume)
  }, [resume])

  const handleDownloadPdf = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    const preview = document.getElementById('resume-preview')
    if (!preview) return
    const styles = Array.from(document.styleSheets)
      .map((s) => {
        try {
          return s.href ? `<link rel="stylesheet" href="${s.href}">` : ''
        } catch {
          return ''
        }
      })
      .join('')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resume - ${resume.personal.fullName || 'Untitled'}</title>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; }
          @page { margin: 10mm; }
          .rb-preview { box-shadow: none !important; border: none !important; }
        </style>
        ${styles}
      </head>
      <body>
        ${preview.outerHTML}
      </body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const handleClear = () => {
    setConfirmClear(false)
    clearResume()
    setResume(createEmptyResume())
  }

  const handleNew = () => {
    if (window.confirm('Clear all entered content and start a new resume?')) {
      clearResume()
      setResume(createEmptyResume())
    }
  }

  return (
    <main className="rb-page" id="top">
      <Navbar />
      <div className="rb-shell">
        <header className="rb-hero">
          <p className="rb-hero__eyebrow">Career · Resume Builder</p>
          <h1 className="rb-hero__title">Build an ATS-friendly resume</h1>
          <p className="rb-hero__sub">
            Clean, professional, and focused on what matters. Data stays in your browser — no external services, no AI APIs.
          </p>
        </header>

        <PlatformNav />

        <div className="rb-actions">
          <div className="rb-actions__group">
            <label className="rb-field__label" htmlFor="rb-template">Template</label>
            <select id="rb-template" className="rb-select" value={template} onChange={(e) => setTemplate(e.target.value)}>
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="rb-actions__group rb-actions__group--right">
            <button type="button" className="rb-btn" onClick={() => setShowTips((v) => !v)}>
              {showTips ? 'Hide Tips' : 'Show Tips'}
            </button>
            <button type="button" className="rb-btn" onClick={handleNew}>New Resume</button>
            <button type="button" className="rb-btn rb-btn--ghost" onClick={() => setConfirmClear(true)}>Clear Saved Data</button>
            <button type="button" className="rb-btn rb-btn--primary" onClick={handleDownloadPdf}>Download PDF</button>
          </div>
        </div>

        {showTips && (
          <div className="rb-tips" role="region" aria-label="Resume tips">
            <h2 className="rb-tips__title">Tips for ATS-friendly resumes</h2>
            <ul className="rb-tips__list">
              <li>Use standard section headings (Education, Experience, Projects, Skills). Avoid creative titles.</li>
              <li>Focus on achievements with action verbs (Built, Optimized, Reduced, Implemented). Add measurable outcomes only if genuine.</li>
              <li>For freshers, emphasize projects, relevant coursework, and technical skills over work history.</li>
              <li>Keep it clean: single-column is safest for ATS. Avoid graphics, tables, headers/footers with images, or skill rating bars.</li>
              <li>Use readable fonts and consistent spacing. Export as PDF to preserve formatting.</li>
              <li>This builder stores data in your browser's localStorage on this device only. Nothing is sent to external servers.</li>
            </ul>
          </div>
        )}

        {confirmClear && (
          <div className="rb-modal" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) setConfirmClear(false) }}>
            <div className="rb-modal__card">
              <h3 className="rb-modal__title">Clear saved resume data?</h3>
              <p className="rb-modal__body">This will remove the resume saved in your browser on this device. You can't undo this action.</p>
              <div className="rb-modal__actions">
                <button type="button" className="rb-btn rb-btn--ghost" onClick={() => setConfirmClear(false)}>Cancel</button>
                <button type="button" className="rb-btn rb-btn--primary" onClick={handleClear}>Clear</button>
              </div>
            </div>
          </div>
        )}

        <div className="rb-container">
          <div className="rb-editor">
            <ResumeForm resume={resume} setResume={setResume} />
          </div>
          <div className="rb-preview-pane">
            <ResumePreview resume={resume} template={template} />
          </div>
        </div>

        <div className="rb-footnote">
          <p>Data storage: Browser localStorage (key: <code>aioworld.resume.builder</code>) on this device only. No personal information is transmitted to external services.</p>
        </div>
      </div>
    </main>
  )
}