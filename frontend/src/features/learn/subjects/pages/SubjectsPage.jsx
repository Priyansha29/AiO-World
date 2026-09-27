/**
 * Subjects landing page — the Learn index of every subject.
 *
 * Reads straight from the shared taxonomy (single source of truth), presented
 * through the generic CatalogExplorer: search across title, description, group
 * and related-skill names, a subject-group chip filter, and a grid grouped
 * under the six group headers. No second subject list exists anywhere; the
 * explorer handles the searching, filtering, grouping and empty states.
 */
import { useEffect } from 'react'
import Navbar from '../../../../components/Navbar'
import PlatformNav from '../../../../components/platform/PlatformNav'
import CatalogExplorer from '../../../../shared/catalog/CatalogExplorer'
import {
  SUBJECT_FILTERS,
  SUBJECT_GROUP_ORDER,
  SUBJECT_RECORDS,
  subjectGroupLabel,
} from '../domain/subjects'
import '../subjects.css'

export default function SubjectsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <main className="sbj-page" id="top">
      <Navbar />
      <div className="sbj-shell">
        {/* Hero — the platform-wide header, outside the catalogue itself */}
        <header className="sbj-hero">
          <p className="sbj-hero__eyebrow">Learn · Subjects</p>
          <h1 className="sbj-hero__title">
            Learn by <em>subject.</em>
          </h1>
          <p className="sbj-hero__sub">
            Every subject in one place — the notes, courses, books, practice,
            certifications and career roadmaps that belong to it. Pick a group
            below, or search straight to what you need.
          </p>
        </header>

        <PlatformNav />

        <CatalogExplorer
          items={SUBJECT_RECORDS}
          groups={SUBJECT_FILTERS}
          searchFields={['title', 'description', 'aliases', 'tags']}
          groupBy="group"
          groupOrder={SUBJECT_GROUP_ORDER}
          groupLabelFor={subjectGroupLabel}
          countLabel="subject"
          searchLabel="Search subjects"
          hrefFor={(subject) => `#/learn/subjects/${subject.id}`}
          renderMeta={(subject) => {
            const n = subject.skills.length
            return n === 0
              ? null
              : (
                  <span className="sbj-meta">
                    {n} related {n === 1 ? 'skill' : 'skills'}
                  </span>
                )
          }}
          emptyTitle="No subjects yet."
          emptyBody="The subject catalogue is waiting for its first entry — it should never be empty."
          keyField="id"
        />
      </div>
    </main>
  )
}