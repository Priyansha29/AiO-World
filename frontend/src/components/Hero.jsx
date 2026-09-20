import LiquidMetalHero from './LiquidMetalHero'
import { LEARN, CAREER, PLAY, TOOLS } from '@/data/content'

const LANE_TINTS = {
  learn: '#3a7d5c',
  career: '#b0763a',
  play: '#a85f80',
  tools: '#4e6f9e',
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Hero() {
  const lanes = [LEARN, CAREER, PLAY, TOOLS].map((lane) => ({
    key: lane.key,
    label: lane.label,
    color: LANE_TINTS[lane.key],
  }))

  return (
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
      onPrimaryCtaClick={() => scrollToSection('explore')}
      onSecondaryCtaClick={() => scrollToSection('explore')}
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
  )
}

export default Hero