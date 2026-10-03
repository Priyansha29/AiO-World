import { LEARN, CAREER, PLAY, TOOLS } from '../data/content'
import { motion } from 'framer-motion'
import './Explore.css'

const EXPLORE = [
  {
    ...LEARN,
    items: [
      { label: 'DSA Roadmap', desc: 'A guided path from arrays to graphs', href: '#/learn/library/book/demo-dsa-quick-reference' },
      { label: 'Web Development', desc: 'From first tag to first deploy', href: '#/learn/library/book/javascript-info' },
      { label: 'Cybersecurity', desc: 'Think like an attacker, then like a defender', href: '#/learn/library/book/security-engineering' },
    ],
  },
  {
    ...CAREER,
    items: [
      { label: 'Software Engineer', desc: 'Full-stack from first tag to shipped portfolio', href: '#/career/roadmaps/full-stack' },
      { label: 'Frontend Developer', desc: 'Interfaces, interactions and a live portfolio', href: '#/career/roadmaps/frontend' },
      { label: 'AI Engineer', desc: 'Models, pipelines and a demo you can ship', href: '#/career/roadmaps/ai-engineer' },
    ],
  },
  {
    ...PLAY,
    items: [
      { label: '10 websites worth visiting', desc: 'Curious corners of the internet', href: '#/fun' },
      { label: 'From experiments to games', desc: 'Interactive things to try and explore', href: '#/fun' },
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

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.05 },
  }),
}

function Explore() {
  return (
    <section className="explore" id="explore">
      <motion.header
        className="explore__head"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <p className="explore__eyebrow">A peek inside</p>
        <h2 className="explore__title">Explore the platform</h2>
        <p className="explore__lede">
          Four lanes, one tab. Start anywhere — the rest of the platform grows
          out from here.
        </p>
      </motion.header>

      <div className="explore__grid">
        {EXPLORE.map((group, index) => (
          <motion.div
            key={group.key}
            className="explore-group"
            custom={index}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            style={{ '--group-accent': group.accent }}
          >
            <span className="explore-group__accent" aria-hidden="true" />
            <h3 className="explore-group__name">{group.label}</h3>
            <p className="explore-group__tagline">{group.tagline}</p>
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
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Explore