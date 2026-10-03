import { useEffect } from 'react'
import Navbar from '../../../components/Navbar'
import { findTool, toolCategory, toolCategoryIcon } from '../data/tools-data.jsx'
import { TOOL_COMPONENTS } from '../data/tool-registry'
import '../../../components/platform/platform.css'
import '../tools.css'

export default function ToolPage({ toolId }) {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const tool = findTool(toolId)
  const Calculator = TOOL_COMPONENTS[toolId]

  return (
    <main className="tools-page" id="top">
      <Navbar />
      <div className="pf-shell">
        <a className="tools-back" href="#/tools">
          ← All tools
        </a>

        <header className="pf-hero">
          <p className="pf-hero__eyebrow">
            Tools · {tool ? toolCategory(tool.category).label : 'Tool'}
          </p>
          <h1 className="pf-hero__title">{tool ? tool.title : 'That tool does not exist.'}</h1>
          {tool && <p className="pf-hero__sub">{tool.description}</p>}
        </header>

        {!tool && (
          <div className="pf-empty" aria-label="Tool not found">
            <div className="pf-empty__glyph" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9.5 14.5 14.5M14.5 9.5 9.5 14.5" />
              </svg>
            </div>
            <h2 className="pf-empty__title">We could not find that tool.</h2>
            <p className="pf-empty__body">It may have a different name — back to the toolbox and search again.</p>
            <div className="pf-empty__ctas">
              <a className="pf-btn pf-btn--primary" href="#/tools">
                Back to Tools
              </a>
            </div>
          </div>
        )}

        {tool && tool.status !== 'live' && (
          <div className="pf-empty" aria-label={`${tool.title} — on the roadmap`}>
            <div className="pf-empty__glyph" aria-hidden>{toolCategoryIcon(tool.category)}</div>
            <h2 className="pf-empty__title">
              {tool.title} is on the Tools roadmap
            </h2>
            <p className="pf-empty__body">{tool.empty}</p>
            <div className="pf-empty__ctas">
              <a className="pf-btn pf-btn--primary" href="#/tools">
                Back to Tools
              </a>
            </div>
          </div>
        )}

        {tool && tool.status === 'live' && Calculator && (
          <section className="tools-body" aria-label={tool.title}>
            <Calculator />
          </section>
        )}
      </div>
    </main>
  )
}