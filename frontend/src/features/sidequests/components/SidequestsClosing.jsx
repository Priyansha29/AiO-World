/**
 * The closing line.
 *
 * The brief's words exactly: "College is more than your degree." / "Go build
 * the rest of your life." It is a soft landing, not a conversion moment — there
 * is no newsletter box, no "sign up", no countdown, no second CTA competing with
 * the line. A section about the rest of your life that ends by asking you to
 * sign up for something would be arguing with itself.
 *
 * The one link is a suggestion, phrased as a suggestion: it goes back to the
 * top so somebody who scrolled past something can return, rather than pushing
 * them into another funnel.
 *
 * The line breathes in once as it arrives, and the link under it follows a beat
 * later. Both are transform and opacity, so `MotionConfig reducedMotion="user"`
 * removes them and the line is simply present.
 */
import { motion } from 'framer-motion'
import { Glyph } from './Glyph'

const ease = [0.25, 0.1, 0.25, 1]

export default function SidequestsClosing() {
  return (
    <footer className="sq-closing">
      <motion.p
        className="sq-closing__line"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, ease }}
      >
        College is more than your degree.
      </motion.p>

      <motion.p
        className="sq-closing__sub"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease, delay: 0.2 }}
      >
        Go build the rest of your life.
      </motion.p>

      <motion.a
        className="sq-closing__back"
        href="#top"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease, delay: 0.28 }}
      >
        <Glyph name="mountain" size={15} />
        <span>Back to the top</span>
      </motion.a>
    </footer>
  )
}
