import { useState } from 'react'
import { LEARN, CAREER, PLAY, TOOLS } from '../data/content'
import './Hero.css'

function ModeCard({ mode, tag }) {
  return (
    <a className={`mode mode--${mode.accent}`} href={mode.href}>
      <span className="mode__top">
        <span className="mode__dot" aria-hidden="true" />
        <span className="mode__tag">{tag}</span>
      </span>
      <span className="mode__label">{mode.label}</span>
      <span className="mode__blurb">{mode.blurb}</span>
      <span className="mode__example">
        {mode.example.map((item) => (
          <span key={item} className="mode__chip">
            {item}
          </span>
        ))}
      </span>
    </a>
  )
}

function Hero() {
  const [bore, setBore] = useState(false)

  return (
    <section className="hero" id="top">
      <div className="hero__halo" aria-hidden="true" />

      <p className="hero__eyebrow">One place for everything student life throws at you</p>

      <h1 className="hero__title">
        What do you want
        <br />
        to do <span className="hero__today">today?</span>
      </h1>

      <p className="hero__lede">
        Learn a skill, build your future, play something with friends, or crunch
        a couple of quick numbers — all from the same tab. Pick a lane, we'll
        handle the rest.
      </p>

      <div className="hero__modes">
        <ModeCard mode={LEARN} tag="Start small" />
        <ModeCard mode={CAREER} tag="Get noticed" />
        <ModeCard mode={PLAY} tag="Just for fun" />
        <ModeCard mode={TOOLS} tag="Daily drivers" />
      </div>

      <button
        type="button"
        className={`hero__bored${bore ? ' hero__bored--hit' : ''}`}
        onClick={() => setBore(true)}
        onBlur={() => setBore(false)}
        aria-pressed={bore}
      >
        <span className="hero__bored-emoji" aria-hidden="true">
          {bore ? '🤝' : '🎲'}
        </span>
        <span>{bore ? "Cool — freedom mode armed" : "I'm bored — surprise me"}</span>
      </button>
    </section>
  )
}

export default Hero