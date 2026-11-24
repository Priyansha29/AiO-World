import ElsewhereHero from './ui/elsewhere-hero'
import { getSelectedCollege } from '../features/campus/services/profile-store'

const LINKS = [
  { label: 'Campus', href: getSelectedCollege() ? '#/campus' : '#/setup' },
  { label: 'Learn', href: '#/learn' },
  { label: 'Career', href: '#/career' },
  { label: 'Fun', href: '#/fun' },
  { label: 'Tools', href: '#/tools' },
  { label: 'Sidequests', href: '#/sidequests' },
]

export default function Hero() {
  return (
    <ElsewhereHero
      brand="AiO World"
      links={LINKS}
      navCta={{ label: 'Explore', href: '#explore' }}
      headline="What do you want to do today?"
      subline="Ambient soundscapes that follow the day — keys by morning, cicadas by night. Learn a skill, build your future, or crunch numbers in focus."
      primaryCta={{ label: 'Explore the lanes', href: '#explore' }}
      listenLabel="Listen"
      listenOffLabel="Pause sound"
      soundHint="Turn on soundscape"
      signature={{
        name: 'AiO World',
        url: '#top',
      }}
    />
  )
}
