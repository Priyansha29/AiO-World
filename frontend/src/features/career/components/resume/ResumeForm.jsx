import { useId } from 'react'

function TextInput({ label, id, value, onChange, placeholder, type = 'text', required = false, help }) {
  const generatedId = useId()
  const inputId = id || generatedId
  return (
    <div className="rb-field">
      <label className="rb-field__label" htmlFor={inputId}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={inputId}
        type={type}
        className="rb-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-describedby={help ? `${inputId}-help` : undefined}
      />
      {help && <small id={`${inputId}-help`} className="rb-help">{help}</small>}
    </div>
  )
}

function TextArea({ label, id, value, onChange, placeholder, rows = 3, help }) {
  const generatedId = useId()
  const inputId = id || generatedId
  return (
    <div className="rb-field">
      <label className="rb-field__label" htmlFor={inputId}>{label}</label>
      <textarea
        id={inputId}
        className="rb-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        aria-describedby={help ? `${inputId}-help` : undefined}
      />
      {help && <small id={`${inputId}-help`} className="rb-help">{help}</small>}
    </div>
  )
}

export default function ResumeForm({ resume, setResume }) {
  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now(), institution: '', degree: '', field: '', start: '', end: '', cgpa: '', coursework: '' },
      ],
    }))
  }
  const updateEducation = (id, field, value) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }
  const removeEducation = (id) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }))
  }

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now(), organization: '', role: '', start: '', end: '', responsibilities: '' },
      ],
    }))
  }
  const updateExperience = (id, field, value) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }
  const removeExperience = (id) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }))
  }

  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: Date.now(), name: '', description: '', technologies: '', url: '', github: '' },
      ],
    }))
  }
  const updateProject = (id, field, value) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }
  const removeProject = (id) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }))
  }

  const addCertification = () => {
    setResume((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: Date.now(), name: '', issuer: '', date: '' },
      ],
    }))
  }
  const updateCertification = (id, field, value) => {
    setResume((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }
  const removeCertification = (id) => {
    setResume((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((item) => item.id !== id),
    }))
  }

  return (
    <div className="rb-form">
      <section className="rb-section">
        <h2 className="rb-section__title">Personal Information</h2>
        <div className="rb-grid">
          <TextInput label="Full name" value={resume.personal.fullName} onChange={(v) => setResume((p) => ({ ...p, personal: { ...p.personal, fullName: v } }))} placeholder="e.g., Alex Johnson" />
          <TextInput label="Professional email" type="email" value={resume.personal.email} onChange={(v) => setResume((p) => ({ ...p, personal: { ...p.personal, email: v } }))} placeholder="alex.johnson@example.com" />
          <TextInput label="Phone number" value={resume.personal.phone} onChange={(v) => setResume((p) => ({ ...p, personal: { ...p.personal, phone: v } }))} placeholder="+91 98765 43210" />
          <TextInput label="City" value={resume.personal.city} onChange={(v) => setResume((p) => ({ ...p, personal: { ...p.personal, city: v } }))} placeholder="Mumbai" />
          <TextInput label="Country" value={resume.personal.country} onChange={(v) => setResume((p) => ({ ...p, personal: { ...p.personal, country: v } }))} placeholder="India" />
          <TextInput label="LinkedIn URL" value={resume.personal.linkedin} onChange={(v) => setResume((p) => ({ ...p, personal: { ...p.personal, linkedin: v } }))} placeholder="https://linkedin.com/in/username" />
          <TextInput label="GitHub URL" value={resume.personal.github} onChange={(v) => setResume((p) => ({ ...p, personal: { ...p.personal, github: v } }))} placeholder="https://github.com/username" />
          <TextInput label="Portfolio URL" value={resume.personal.portfolio} onChange={(v) => setResume((p) => ({ ...p, personal: { ...p.personal, portfolio: v } }))} placeholder="https://yourportfolio.com" />
        </div>
      </section>

      <section className="rb-section">
        <h2 className="rb-section__title">Professional Summary</h2>
        <TextArea
          label="Summary (optional)"
          value={resume.summary}
          onChange={(v) => setResume((p) => ({ ...p, summary: v }))}
          placeholder="Brief 2–4 line summary highlighting relevant skills and goals. Focus on what you bring if you're a fresher."
          rows={4}
          help="For freshers: focus on coursework, projects, and technical skills rather than work history."
        />
      </section>

      <section className="rb-section">
        <h2 className="rb-section__title">Education</h2>
        {resume.education.map((item) => (
          <div key={item.id} className="rb-card">
            <div className="rb-grid">
              <TextInput label="Institution" value={item.institution} onChange={(v) => updateEducation(item.id, 'institution', v)} placeholder="University/College name" />
              <TextInput label="Degree" value={item.degree} onChange={(v) => updateEducation(item.id, 'degree', v)} placeholder="B.Tech / B.E / B.Sc etc." />
              <TextInput label="Field of study" value={item.field} onChange={(v) => updateEducation(item.id, 'field', v)} placeholder="Computer Science" />
              <TextInput label="Start date" value={item.start} onChange={(v) => updateEducation(item.id, 'start', v)} placeholder="MM/YYYY" />
              <TextInput label="End date" value={item.end} onChange={(v) => updateEducation(item.id, 'end', v)} placeholder="MM/YYYY or Present" />
              <TextInput label="CGPA/Percentage (optional)" value={item.cgpa} onChange={(v) => updateEducation(item.id, 'cgpa', v)} placeholder="8.5 CGPA / 85%" />
              <TextInput label="Relevant coursework (optional)" value={item.coursework} onChange={(v) => updateEducation(item.id, 'coursework', v)} placeholder="Data Structures, DBMS, OS" />
            </div>
            <button type="button" className="rb-btn rb-btn--ghost" onClick={() => removeEducation(item.id)} aria-label="Remove education entry">Remove</button>
          </div>
        ))}
        <button type="button" className="rb-btn" onClick={addEducation}>+ Add Education</button>
      </section>

      <section className="rb-section">
        <h2 className="rb-section__title">Experience</h2>
        <p className="rb-help">Include internships, part-time work, volunteering, or other relevant experience. Optional for freshers.</p>
        {resume.experience.map((item) => (
          <div key={item.id} className="rb-card">
            <div className="rb-grid">
              <TextInput label="Organization" value={item.organization} onChange={(v) => updateExperience(item.id, 'organization', v)} placeholder="Company/Organization name" />
              <TextInput label="Role" value={item.role} onChange={(v) => updateExperience(item.id, 'role', v)} placeholder="Intern / Developer / Volunteer" />
              <TextInput label="Start date" value={item.start} onChange={(v) => updateExperience(item.id, 'start', v)} placeholder="MM/YYYY" />
              <TextInput label="End date" value={item.end} onChange={(v) => updateExperience(item.id, 'end', v)} placeholder="MM/YYYY or Present" />
            </div>
            <TextArea label="Responsibilities and achievements" value={item.responsibilities} onChange={(v) => updateExperience(item.id, 'responsibilities', v)} placeholder="Use action verbs. e.g., Built..., Optimized..., Reduced..., Implemented..." rows={3} help="Focus on measurable/genuine outcomes where possible. Avoid fabricating metrics." />
            <button type="button" className="rb-btn rb-btn--ghost" onClick={() => removeExperience(item.id)} aria-label="Remove experience entry">Remove</button>
          </div>
        ))}
        <button type="button" className="rb-btn" onClick={addExperience}>+ Add Experience</button>
      </section>

      <section className="rb-section">
        <h2 className="rb-section__title">Projects</h2>
        <p className="rb-help">Project-focused resumes work well for freshers. Include description, tech stack, and links if public.</p>
        {resume.projects.map((item) => (
          <div key={item.id} className="rb-card">
            <TextInput label="Project name" value={item.name} onChange={(v) => updateProject(item.id, 'name', v)} placeholder="Project title" />
            <TextArea label="Description and impact" value={item.description} onChange={(v) => updateProject(item.id, 'description', v)} placeholder="What problem did you solve? What did you build? Key features." rows={3} />
            <TextInput label="Technologies used" value={item.technologies} onChange={(v) => updateProject(item.id, 'technologies', v)} placeholder="React, Node.js, MongoDB, etc." />
            <div className="rb-grid">
              <TextInput label="Project URL (optional)" value={item.url} onChange={(v) => updateProject(item.id, 'url', v)} placeholder="https://live-demo.com" />
              <TextInput label="GitHub URL (optional)" value={item.github} onChange={(v) => updateProject(item.id, 'github', v)} placeholder="https://github.com/username/repo" />
            </div>
            <button type="button" className="rb-btn rb-btn--ghost" onClick={() => removeProject(item.id)} aria-label="Remove project entry">Remove</button>
          </div>
        ))}
        <button type="button" className="rb-btn" onClick={addProject}>+ Add Project</button>
      </section>

      <section className="rb-section">
        <h2 className="rb-section__title">Skills</h2>
        <TextInput label="Technical skills" value={resume.skills.technical} onChange={(v) => setResume((p) => ({ ...p, skills: { ...p.skills, technical: v } }))} placeholder="e.g., JavaScript, Python, Data Structures, Algorithms" help="Separate with commas." />
        <TextInput label="Tools &amp; technologies" value={resume.skills.tools} onChange={(v) => setResume((p) => ({ ...p, skills: { ...p.skills, tools: v } }))} placeholder="e.g., Git, VS Code, Firebase, Postman" help="Separate with commas." />
        <TextInput label="Other relevant skills" value={resume.skills.other} onChange={(v) => setResume((p) => ({ ...p, skills: { ...p.skills, other: v } }))} placeholder="e.g., Problem-solving, Teamwork, Communication" help="Separate with commas." />
      </section>

      <section className="rb-section">
        <h2 className="rb-section__title">Certifications &amp; Achievements</h2>
        {resume.certifications.map((item) => (
          <div key={item.id} className="rb-card">
            <div className="rb-grid">
              <TextInput label="Certification name" value={item.name} onChange={(v) => updateCertification(item.id, 'name', v)} placeholder="Certification title" />
              <TextInput label="Issuer" value={item.issuer} onChange={(v) => updateCertification(item.id, 'issuer', v)} placeholder="Issuing organization" />
              <TextInput label="Date" value={item.date} onChange={(v) => updateCertification(item.id, 'date', v)} placeholder="MM/YYYY" />
            </div>
            <button type="button" className="rb-btn rb-btn--ghost" onClick={() => removeCertification(item.id)} aria-label="Remove certification entry">Remove</button>
          </div>
        ))}
        <button type="button" className="rb-btn" onClick={addCertification}>+ Add Certification/Achievement</button>
      </section>
    </div>
  )
}