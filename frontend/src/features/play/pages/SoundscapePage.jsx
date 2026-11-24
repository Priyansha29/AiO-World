import ElsewhereHero from '@/components/ui/elsewhere-hero'

export default function SoundscapePage() {
  return (
    <ElsewhereHero
      brand="AiO Focus"
      headline="Study from somewhere else."
      subline="Generative ambient soundscapes that follow your workflow — morning keys by day, nocturnal cicadas by night."
      links={[
        { label: 'Campus', href: '#/campus' },
        { label: 'Tools', href: '#/tools' },
        { label: 'Career', href: '#/career' },
        { label: 'Play', href: '#/play' },
      ]}
      navCta={{ label: 'Home', href: '#/' }}
      primaryCta={{ label: 'Explore Tools', href: '#/tools' }}
      listenLabel="Start Soundscape"
      listenOffLabel="Pause Audio"
      soundHint="Tap to activate soundscape"
      signature={{
        name: 'AiO Focus Room',
        url: '#/',
      }}
    />
  )
}
