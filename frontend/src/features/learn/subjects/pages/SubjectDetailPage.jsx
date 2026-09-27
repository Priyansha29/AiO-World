/**
 * Subject detail page — the connection point for one subject.
 *
 * Composes the shared CatalogDetail with data straight from the taxonomy: the
 * subject title, description, subject group, its related skills, and honest
 * empty states for every future resource type (learning resources, practice,
 * books, courses, certifications, career roadmaps). The "Learning resources"
 * section is live: note PDFs from the manifest + public Supabase `Files` bucket
 * (`data/notes.js` → `services/notes.js`) render as open-in-new-tab links;
 * without notes (or without storage configured) the honest empty state stays.
 * No fake resources are ever rendered.
 */
import { useEffect } from 'react'
import Navbar from '../../../../components/Navbar'
import PlatformNav from '../../../../components/platform/PlatformNav'
import CatalogDetail from '../../../../shared/catalog/CatalogDetail'
import {
  groupForSubject,
  skillsForSubject,
  SUBJECT_BY_KEY,
} from '../../../../shared/taxonomy'
import { SUBJECT_NOTES } from '../data/notes'
import { getSubjectNotes } from '../services/notes'
import '../subjects.css'

/** The resource connection points, each with an honest not-yet-here state. */
function learningResources(noteFiles) {
  if (noteFiles.length > 0) {
    return {
      heading: 'Learning resources',
      items: noteFiles.map((file) => ({
        label: file.name.replace(/\.pdf$/i, ''),
        href: file.url,
      })),
    }
  }
  return { heading: 'Learning resources', body: 'No study notes or learning resources have been added for this subject yet.' }
}

function resourceSections(skills, noteFiles) {
  const sections = [
    learningResources(noteFiles),
    { heading: 'Practice', body: 'No practice problems have been added for this subject yet.' },
    { heading: 'Books', body: 'No books have been added for this subject yet.' },
    { heading: 'Courses', body: 'No courses have been added for this subject yet.' },
    { heading: 'Certifications', body: 'No certifications have been added for this subject yet.' },
    { heading: 'Related career roadmaps', body: 'No career roadmaps link to this subject yet.' },
  ]
  return skills.length > 0 ? [{ heading: 'Related skills', items: skills }, ...sections] : sections
}

export default function SubjectDetailPage({ subjectId }) {
  const subject = SUBJECT_BY_KEY[subjectId] ?? null

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [subjectId])

  if (!subject) {
    return (
      <main className="sbj-page">
        <Navbar />
        <div className="sbj-shell">
          <PlatformNav />
          <CatalogDetail
            title="Subject"
            record={null}
            missingTitle="Subject not found."
            missingBody="That subject is not in the catalogue yet — check the spelling, or head back and browse all subjects."
            backHref="#/learn/subjects"
            backLabel="All subjects"
          />
        </div>
      </main>
    )
  }

  const group = groupForSubject(subject.key)
  const skills = skillsForSubject(subject.key).map((skill) => skill.label)
  const notesEntry = SUBJECT_NOTES[subject.key]
  const noteFiles = getSubjectNotes({
    key: subject.key,
    label: subject.label,
    notes: notesEntry?.files,
    notesFolder: notesEntry?.folder,
  })

  return (
    <main className="sbj-page">
      <Navbar />
      <div className="sbj-shell">
        <PlatformNav />
        <CatalogDetail
          eyebrow="Learn · Subject"
          title={subject.label}
          sub={subject.description}
          record={subject}
          backHref="#/learn/subjects"
          backLabel="All subjects"
          facts={[{ label: 'Subject group', value: group?.label ?? 'Ungrouped' }]}
          sections={resourceSections(skills, noteFiles)}
        />
      </div>
    </main>
  )
}