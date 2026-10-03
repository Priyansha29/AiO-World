import { useEffect } from 'react'
import Navbar from '../../../components/Navbar'
import CatalogExplorer from '../../../shared/catalog/CatalogExplorer'
import { TOOLS, TOOL_CATEGORY_ORDER, toolCategory, toolGroupFilter } from '../data/tools-data.jsx'
import '../../../components/platform/platform.css'
import '../tools.css'

function ToolBadge({ tool }) {
  return tool.status === 'live' ? (
    <span className="tools-chip tools-chip--live">Live</span>
  ) : (
    <span className="tools-chip tools-chip--planned">Planned</span>
  )
}

export default function ToolsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <main className="tools-page" id="top">
      <Navbar />
      <div className="pf-shell">
        <header className="pf-hero">
          <p className="pf-hero__eyebrow">Tools</p>
          <h1 className="pf-hero__title">Save the boring math.</h1>
          <p className="pf-hero__sub">
            Small utilities that end the tedious parts of student life — practical
            calculators for academics, career, developers, networking and everyday
            use. Live tools are ready now; the rest are on the roadmap.
          </p>
        </header>

        <CatalogExplorer
          eyebrow="The toolbox"
          title="Every tool"
          sub="Search across tools, or filter by category."
          items={TOOLS}
          searchFields={['title', 'description', 'tags', 'keywords']}
          labelKeys={[]}
          groups={toolGroupFilter()}
          groupBy="category"
          groupOrder={TOOL_CATEGORY_ORDER}
          groupLabelFor={(key) => toolCategory(key).label}
          countLabel="tool"
          searchLabel="Search tools"
          hrefFor={(tool) => `#/tools/${tool.id}`}
          renderMeta={(tool) => <ToolBadge tool={tool} />}
          emptyTitle="No tools yet."
          emptyBody="The toolbox is waiting for its first record — it should never be empty."
          keyField="id"
        />
      </div>
    </main>
  )
}