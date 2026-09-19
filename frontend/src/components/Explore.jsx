import { LEARN, CAREER, PLAY, TOOLS } from '../data/content'
import './Explore.css'

const EXPLORE = [
  {
    ...LEARN,
    items: [
      { label: 'DSA Roadmap', desc: 'A guided path from arrays to graphs', href: '#learn/dsa-roadmap' },
      { label: 'Web Development', desc: 'From first tag to first deploy', href: '#learn/web-dev' },
      { label: 'Cybersecurity', desc: 'Think like an attacker, then like a defender', href: '#learn/security' },
    ],
  },
  {
    ...CAREER,
    items: [
      { label: 'Resume Checker', desc: 'A rule-based review before AI adds opinion', href: '#career/resume' },
      { label: 'Internship Finder', desc: 'Openings matched to your skills, not random', href: '#career/internships' },
      { label: 'Skill Gap', desc: 'See what stands between you and the role', href: '#career/skill-gap' },
    ],
  },
  {
    ...PLAY,
    items: [
      { label: 'Guess Who', desc: 'Narrow it down the fastest to win', href: '#play/guess-who' },
      { label: 'Trivia', desc: 'Quick rounds with friends, or fly solo', href: '#play/trivia' },
      { label: 'Couple Games', desc: 'For two people, wherever you are', href: '#play/couples' },
    ],
  },
  {
    ...TOOLS,
    items: [
      { label: 'Attendance Calculator', desc: 'How many classes can you still skip?', href: '#tools/attendance' },
      { label: 'CGPA Calculator', desc: 'Plan the semester grade you actually need', href: '#tools/cgpa' },
      { label: 'Study Planner', desc: 'Turn a deadline into a realistic schedule', href: '#tools/planner' },
    ],
  },
]

function Explore() {
  return (
    <section className="explore" id="explore">
      <div className="explore__head">
        <p className="explore__eyebrow">A peek inside</p>
        <h2 className="explore__title">Explore the platform</h2>
        <p className="explore__lede">
          Here is a small taste of each lane. Shown to give you the feel — full
          features are coming next.
        </p>
      </div>

      <div className="explore__grid">
        {EXPLORE.map((group) => (
          <div key={group.key} className={`explore-group explore-group--${group.accent}`}>
            <p className="explore-group__name">{group.label}</p>
            <ul className="explore-group__list">
              {group.items.map((item) => (
                <li key={item.href}>
                  <a className="explore-group__link" href={item.href}>
                    <span className="explore-group__label">{item.label}</span>
                    <span className="explore-group__desc">{item.desc}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Explore