import LiquidMetalHero from './LiquidMetalHero'
import { LEARN, CAREER, PLAY, TOOLS } from '@/data/content'

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Hero() {
  const lanes = [LEARN, CAREER, PLAY, TOOLS]
  const text = lanes.map((lane) => `${lane.label} — ${lane.tagline}`)

  return (
    <LiquidMetalHero
      id="top"
      badge="One place for everything student life throws at you"
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
      features={text}
    />
  )
}

export default Hero