import { useCallback, useRef, useState } from 'react'
import LiquidMetalHero from './LiquidMetalHero'
import BoredomExperience from '../features/boredom/components/BoredomExperience.jsx'
import { LEARN, CAREER, PLAY, TOOLS } from '@/data/content'

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Hero() {
  const [bored, setBored] = useState(false)
  // The boredom machine opens out of this exact button, so it needs to know
  // where the button is.
  const boredCtaRef = useRef(null)

  const lanes = [LEARN, CAREER, PLAY, TOOLS].map((lane) => ({
    key: lane.key,
    label: lane.label,
    color: lane.accent,
  }))

  const startBoredom = useCallback(() => setBored(true), [])
  const endBoredom = useCallback(() => setBored(false), [])

  return (
    <>
      <LiquidMetalHero
        id="top"
        eyebrow="One place for everything student life throws at you"
        title={
          <>
            What do you want <br className="hidden sm:block" /> to do today?
          </>
        }
        subtitle="Learn a skill, build your future, play something with friends, or crunch a couple of quick numbers — all from the same tab. Pick a lane, we'll handle the rest."
        primaryCtaLabel="Explore the lanes"
        secondaryCtaLabel="I'm bored — surprise me"
        secondaryCtaRef={boredCtaRef}
        onPrimaryCtaClick={() => scrollToSection('explore')}
        onSecondaryCtaClick={startBoredom}
        lanes={lanes}
        onSelectLane={(lane) => {
          const order = { learn: 0, career: 1, play: 2, tools: 3 }
          const target = document.querySelectorAll('.explore-group')[order[lane.key]]
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' })
            target.classList.add('explore-group--flash')
            setTimeout(() => target.classList.remove('explore-group--flash'), 1400)
          }
        }}
      />

      {bored && (
        <BoredomExperience
          open
          anchorRef={boredCtaRef}
          onClose={endBoredom}
        />
      )}
    </>
  )
}

export default Hero
