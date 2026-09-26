/**
 * The repeated shape of a Sidequests section: an eyebrow, a title, one line of
 * sub-copy, and an optional control on the right.
 *
 * Every section reuses this so the page has one rhythm. The asymmetry is
 * deliberate — the heading block is measured against a narrow column while the
 * content beside it runs to the full shell width, rather than everything
 * sitting in one centred stack.
 *
 * The heading and the body each arrive on a short fade-and-rise. Both are
 * transform and opacity, so `MotionConfig reducedMotion="user"` strips them out
 * on its own: a reader who asked for less motion simply gets the words, already
 * there.
 */
import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1]

/**
 * @param {{
 *   id: string,
 *   eyebrow?: string,
 *   title: string,
 *   sub?: string,
 *   aside?: React.ReactNode,
 *   children: React.ReactNode,
 *   tone?: 'default' | 'tinted',
 *   action?: React.ReactNode,
 * }} props
 */
export default function Section({
  id,
  eyebrow,
  title,
  sub,
  aside,
  children,
  tone = 'default',
  action = null,
}) {
  return (
    <section
      className={`sq-section sq-section--${tone}`}
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <motion.header
        className="sq-section__head"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="sq-section__intro">
          {eyebrow ? <p className="sq-section__eyebrow">{eyebrow}</p> : null}
          <h2 className="sq-section__title" id={`${id}-title`}>
            {title}
          </h2>
          {sub ? <p className="sq-section__sub">{sub}</p> : null}
        </div>
        {action ? <div className="sq-section__action">{action}</div> : null}
      </motion.header>

      <motion.div
        className="sq-section__body"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease, delay: 0.06 }}
      >
        {children}
      </motion.div>

      {aside ? <div className="sq-section__aside">{aside}</div> : null}
    </section>
  )
}
