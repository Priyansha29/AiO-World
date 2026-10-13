function formatItems(text) {
  if (!text) return []
  return text
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

function SingleColumn({ resume }) {
  return (
    <article className="rb-preview rb-preview--single" id="resume-preview" aria-label="Resume preview">
      <header className="rb-preview__header">
        <h1 className="rb-preview__name">{resume.personal.fullName || 'Your Name'}</h1>
        <div className="rb-preview__contact">
          {resume.personal.email && <span>{resume.personal.email}</span>}
          {resume.personal.phone && <span>{resume.personal.phone}</span>}
          {(resume.personal.city || resume.personal.country) && (
            <span>{[resume.personal.city, resume.personal.country].filter(Boolean).join(', ')}</span>
          )}
          {resume.personal.linkedin && <span>LinkedIn: {resume.personal.linkedin.replace(/^https?:\/\//, '')}</span>}
          {resume.personal.github && <span>GitHub: {resume.personal.github.replace(/^https?:\/\//, '')}</span>}
          {resume.personal.portfolio && <span>Portfolio: {resume.personal.portfolio.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      {resume.summary && (
        <section className="rb-preview__section">
          <h2 className="rb-preview__section-title">Professional Summary</h2>
          <p className="rb-preview__text">{resume.summary}</p>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="rb-preview__section">
          <h2 className="rb-preview__section-title">Education</h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="rb-preview__item">
              <div className="rb-preview__item-head">
                <strong>{edu.degree || 'Degree'} {edu.field ? `in ${edu.field}` : ''}</strong>
                <span>{[edu.start, edu.end].filter(Boolean).join(' – ') || ''}</span>
              </div>
              <div className="rb-preview__item-sub">{edu.institution}</div>
              {edu.cgpa && <div className="rb-preview__item-sub">{edu.cgpa}</div>}
              {edu.coursework && <div className="rb-preview__item-sub">Relevant coursework: {edu.coursework}</div>}
            </div>
          ))}
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="rb-preview__section">
          <h2 className="rb-preview__section-title">Experience</h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} className="rb-preview__item">
              <div className="rb-preview__item-head">
                <strong>{exp.role || 'Role'}</strong>
                <span>{[exp.start, exp.end].filter(Boolean).join(' – ') || ''}</span>
              </div>
              <div className="rb-preview__item-sub">{exp.organization}</div>
              {exp.responsibilities && <p className="rb-preview__text">{exp.responsibilities}</p>}
            </div>
          ))}
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className="rb-preview__section">
          <h2 className="rb-preview__section-title">Projects</h2>
          {resume.projects.map((proj) => (
            <div key={proj.id} className="rb-preview__item">
              <div className="rb-preview__item-head">
                <strong>{proj.name || 'Project'}</strong>
                <span>
                  {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer">Live</a>}
                  {proj.url && proj.github && ' · '}
                  {proj.github && <a href={proj.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                </span>
              </div>
              {proj.description && <p className="rb-preview__text">{proj.description}</p>}
              {proj.technologies && <div className="rb-preview__item-sub">Tech: {proj.technologies}</div>}
            </div>
          ))}
        </section>
      )}

      {(resume.skills.technical || resume.skills.tools || resume.skills.other) && (
        <section className="rb-preview__section">
          <h2 className="rb-preview__section-title">Skills</h2>
          <div className="rb-preview__skills">
            {resume.skills.technical && <div><strong>Technical:</strong> {resume.skills.technical}</div>}
            {resume.skills.tools && <div><strong>Tools:</strong> {resume.skills.tools}</div>}
            {resume.skills.other && <div><strong>Other:</strong> {resume.skills.other}</div>}
          </div>
        </section>
      )}

      {resume.certifications.length > 0 && (
        <section className="rb-preview__section">
          <h2 className="rb-preview__section-title">Certifications &amp; Achievements</h2>
          {resume.certifications.map((cert) => (
            <div key={cert.id} className="rb-preview__item">
              <div className="rb-preview__item-head">
                <strong>{cert.name}</strong>
                <span>{[cert.issuer, cert.date].filter(Boolean).join(' · ')}</span>
              </div>
            </div>
          ))}
        </section>
      )}
    </article>
  )
}

function TwoColumn({ resume }) {
  return (
    <article className="rb-preview rb-preview--two" id="resume-preview" aria-label="Resume preview">
      <div className="rb-preview__left">
        <header className="rb-preview__header">
          <h1 className="rb-preview__name">{resume.personal.fullName || 'Your Name'}</h1>
        </header>
        <section className="rb-preview__section">
          <h2 className="rb-preview__section-title">Contact</h2>
          <div className="rb-preview__list">
            {resume.personal.email && <div>{resume.personal.email}</div>}
            {resume.personal.phone && <div>{resume.personal.phone}</div>}
            {(resume.personal.city || resume.personal.country) && <div>{[resume.personal.city, resume.personal.country].filter(Boolean).join(', ')}</div>}
            {resume.personal.linkedin && <div>LinkedIn: {resume.personal.linkedin.replace(/^https?:\/\//, '')}</div>}
            {resume.personal.github && <div>GitHub: {resume.personal.github.replace(/^https?:\/\//, '')}</div>}
            {resume.personal.portfolio && <div>Portfolio: {resume.personal.portfolio.replace(/^https?:\/\//, '')}</div>}
          </div>
        </section>
        {(resume.skills.technical || resume.skills.tools || resume.skills.other) && (
          <section className="rb-preview__section">
            <h2 className="rb-preview__section-title">Skills</h2>
            <div className="rb-preview__list">
              {formatItems(resume.skills.technical).map((s, i) => <div key={`t-${i}`}>• {s}</div>)}
              {formatItems(resume.skills.tools).map((s, i) => <div key={`o-${i}`}>• {s}</div>)}
              {formatItems(resume.skills.other).map((s, i) => <div key={`oth-${i}`}>• {s}</div>)}
            </div>
          </section>
        )}
      </div>
      <div className="rb-preview__right">
        {resume.summary && (
          <section className="rb-preview__section">
            <h2 className="rb-preview__section-title">Professional Summary</h2>
            <p className="rb-preview__text">{resume.summary}</p>
          </section>
        )}
        {resume.education.length > 0 && (
          <section className="rb-preview__section">
            <h2 className="rb-preview__section-title">Education</h2>
            {resume.education.map((edu) => (
              <div key={edu.id} className="rb-preview__item">
                <div className="rb-preview__item-head">
                  <strong>{edu.degree} {edu.field}</strong>
                  <span>{[edu.start, edu.end].filter(Boolean).join(' – ')}</span>
                </div>
                <div className="rb-preview__item-sub">{edu.institution}</div>
              </div>
            ))}
          </section>
        )}
        {resume.experience.length > 0 && (
          <section className="rb-preview__section">
            <h2 className="rb-preview__section-title">Experience</h2>
            {resume.experience.map((exp) => (
              <div key={exp.id} className="rb-preview__item">
                <div className="rb-preview__item-head">
                  <strong>{exp.role}</strong>
                  <span>{[exp.start, exp.end].filter(Boolean).join(' – ')}</span>
                </div>
                <div className="rb-preview__item-sub">{exp.organization}</div>
                <p className="rb-preview__text">{exp.responsibilities}</p>
              </div>
            ))}
          </section>
        )}
        {resume.projects.length > 0 && (
          <section className="rb-preview__section">
            <h2 className="rb-preview__section-title">Projects</h2>
            {resume.projects.map((proj) => (
              <div key={proj.id} className="rb-preview__item">
                <div className="rb-preview__item-head">
                  <strong>{proj.name}</strong>
                </div>
                <p className="rb-preview__text">{proj.description}</p>
              </div>
            ))}
          </section>
        )}
        {resume.certifications.length > 0 && (
          <section className="rb-preview__section">
            <h2 className="rb-preview__section-title">Certifications</h2>
            {resume.certifications.map((cert) => (
              <div key={cert.id} className="rb-preview__item">
                <div className="rb-preview__item-head">
                  <strong>{cert.name}</strong>
                  <span>{cert.issuer} {cert.date}</span>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </article>
  )
}

export default function ResumePreview({ resume, template = 'single-column' }) {
  if (template === 'two-column') return <TwoColumn resume={resume} />
  return <SingleColumn resume={resume} />
}