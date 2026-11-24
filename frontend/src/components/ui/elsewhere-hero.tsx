"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

/**
 * Elsewhere — a full hero block.
 * Day and night footage that cross-fade, an ambient soundscape generated live with the
 * Web Audio API (keys by day, cicadas by night, a low drone underneath), a navigation bar,
 * a headline and two calls to action. The "Listen" button turns the soundscape on.
 * No dependencies, no audio files: everything you hear is synthesised in the browser.
 */

export interface ElsewhereLink {
  label: string
  href: string
}

export interface ElsewhereHeroProps {
  daySrc?: string
  nightSrc?: string
  /** Brand shown top-left */
  brand?: string
  /** Navigation links (hidden on small screens) */
  links?: ElsewhereLink[]
  /** Call to action in the navigation bar */
  navCta?: ElsewhereLink | false
  headline?: string
  subline?: string
  primaryCta?: ElsewhereLink
  /** Label of the second button, which turns the soundscape on and off */
  listenLabel?: string
  listenOffLabel?: string
  /** Small hint next to the sound button. Set to "" to hide it. */
  soundHint?: string
  signature?: { name: string; url: string } | false
  objectPosition?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_DAY =
  "https://cdn.21st.dev/assets/mirror/a6/a639af57ee941fdd518c604efb043501ad0e815dcce9f7efba850998bafa3453.mp4"

const DEFAULT_NIGHT =
  "https://cdn.21st.dev/assets/mirror/4b/4badf32b0bc920a2fd1b066182eee89e98d8615f680e01fb19ff62fb56e86872.mp4"

const DEFAULT_SIGNATURE = {
  name: "guglielmogiannattasio.exe",
  url: "https://www.guglielmogiannattasio.it",
}

const DEFAULT_LINKS: ElsewhereLink[] = [
  { label: "Soundscapes", href: "#soundscapes" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
]

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

const COL_TEXT = "#f5f3ec"

// ─────────────────────────────────────────────────────────────
// AMBIENT AUDIO ENGINE
// Original Elsewhere audio system.
// Web Audio API — no external audio files or dependencies.
// ─────────────────────────────────────────────────────────────

function createAmbientEngine(ctx: AudioContext) {
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  // Shared low drone, present in both day and night.
  const droneGain = ctx.createGain()
  droneGain.gain.value = 0.16
  droneGain.connect(master)

  const filter = ctx.createBiquadFilter()
  filter.type = "lowpass"
  filter.frequency.value = 700
  filter.connect(droneGain)

  const droneA = ctx.createOscillator()
  droneA.type = "sine"
  droneA.frequency.value = 110

  const droneB = ctx.createOscillator()
  droneB.type = "sine"
  droneB.frequency.value = 110 * 1.008

  droneA.connect(filter)
  droneB.connect(filter)

  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.045

  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 260

  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)

  droneA.start()
  droneB.start()
  lfo.start()

  // Day / night layers.
  const dayGain = ctx.createGain()
  dayGain.gain.value = 0
  dayGain.connect(master)

  const nightGain = ctx.createGain()
  nightGain.gain.value = 0
  nightGain.connect(master)

  const timers: ReturnType<typeof setTimeout>[] = []

  const clearTimers = () => {
    timers.forEach(clearTimeout)
    timers.length = 0
  }

  // Distant, muffled typing.
  const distantGain = ctx.createGain()
  distantGain.gain.value = 0.34
  distantGain.connect(master)

  const distantFilter = ctx.createBiquadFilter()
  distantFilter.type = "lowpass"
  distantFilter.frequency.value = 1300
  distantFilter.connect(distantGain)

  function distantKeyClick(time: number) {
    const osc = ctx.createOscillator()
    osc.type = "triangle"
    osc.frequency.value = 280 + Math.random() * 160
    osc.detune.value = (Math.random() - 0.5) * 120

    const g = ctx.createGain()

    g.gain.setValueAtTime(0.0001, time)
    g.gain.linearRampToValueAtTime(0.55, time + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.13)

    osc.connect(g)
    g.connect(distantFilter)

    osc.start(time)
    osc.stop(time + 0.16)
  }

  function scheduleDistantTyping() {
    let t = 0
    const count = 2 + Math.floor(Math.random() * 5)

    for (let i = 0; i < count; i++) {
      timers.push(setTimeout(() => distantKeyClick(ctx.currentTime), t))
      t += 110 + Math.random() * 170
    }

    timers.push(setTimeout(scheduleDistantTyping, t + 700 + Math.random() * 1400))
  }

  // Alien typing — irregular percussive blips.
  function typingBlip(time: number) {
    const osc = ctx.createOscillator()
    osc.type = "square"

    const scale = [560, 620, 680, 760, 900]
    const base = scale[Math.floor(Math.random() * scale.length)]

    osc.frequency.value = Math.random() < 0.12 ? base * 2.6 : base
    osc.detune.value = (Math.random() - 0.5) * 500

    const g = ctx.createGain()

    g.gain.setValueAtTime(0.0001, time)
    g.gain.linearRampToValueAtTime(0.45, time + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)

    osc.connect(g)
    g.connect(dayGain)

    osc.start(time)
    osc.stop(time + 0.07)
  }

  function scheduleTyping() {
    let t = 0
    const count = 3 + Math.floor(Math.random() * 6)

    for (let i = 0; i < count; i++) {
      timers.push(setTimeout(() => typingBlip(ctx.currentTime), t))
      t += 90 + Math.random() * 150
    }

    timers.push(setTimeout(scheduleTyping, t + 900 + Math.random() * 1800))
  }

  // Cicadas.
  function cicadaBurst() {
    const now = ctx.currentTime
    const duration = 0.6 + Math.random() * 1.1

    const carrier = ctx.createOscillator()
    carrier.type = "sawtooth"
    carrier.frequency.value = 4000 + Math.random() * 900

    const band = ctx.createBiquadFilter()
    band.type = "bandpass"
    band.frequency.value = carrier.frequency.value
    band.Q.value = 9

    const amp = ctx.createGain()
    amp.gain.value = 0

    const chop = ctx.createOscillator()
    chop.type = "sine"
    chop.frequency.value = 28 + Math.random() * 14

    const chopDepth = ctx.createGain()
    chopDepth.gain.value = 0.28

    const chopOffset = ctx.createConstantSource()
    chopOffset.offset.value = 0.28

    chop.connect(chopDepth)
    chopDepth.connect(amp.gain)
    chopOffset.connect(amp.gain)

    const envelope = ctx.createGain()

    envelope.gain.setValueAtTime(0, now)
    envelope.gain.linearRampToValueAtTime(0.4, now + duration * 0.25)
    envelope.gain.linearRampToValueAtTime(0, now + duration)

    carrier.connect(band)
    band.connect(amp)
    amp.connect(envelope)
    envelope.connect(nightGain)

    carrier.start(now)
    chop.start(now)
    chopOffset.start(now)

    carrier.stop(now + duration)
    chop.stop(now + duration)
    chopOffset.stop(now + duration)
  }

  function scheduleCicadas() {
    cicadaBurst()

    if (Math.random() < 0.4) {
      timers.push(setTimeout(cicadaBurst, 180 + Math.random() * 260))
    }

    timers.push(setTimeout(scheduleCicadas, 700 + Math.random() * 1600))
  }

  scheduleTyping()
  scheduleCicadas()
  scheduleDistantTyping()

  return {
    setMuted(muted: boolean) {
      master.gain.linearRampToValueAtTime(muted ? 0 : 0.55, ctx.currentTime + 0.4)
    },

    setNight(isNight: boolean) {
      const t = ctx.currentTime
      dayGain.gain.linearRampToValueAtTime(isNight ? 0 : 1, t + 0.8)
      nightGain.gain.linearRampToValueAtTime(isNight ? 1 : 0, t + 0.8)
    },

    dispose() {
      clearTimers()
      ;[droneA, droneB, lfo].forEach((oscillator) => {
        try {
          oscillator.stop()
        } catch {
          // Already stopped.
        }
      })
      master.disconnect()
    },
  }
}

export default function ElsewhereHero({
  daySrc = DEFAULT_DAY,
  nightSrc = DEFAULT_NIGHT,
  brand = "Elsewhere",
  links = DEFAULT_LINKS,
  navCta = { label: "Get the app", href: "#get" },
  headline = "Work from somewhere else.",
  subline = "Ambient soundscapes that follow the day — keys by morning, cicadas by night.",
  primaryCta = { label: "Start focusing", href: "#start" },
  listenLabel = "Listen",
  listenOffLabel = "Pause sound",
  soundHint = "Turn on the sound",
  signature = DEFAULT_SIGNATURE,
  objectPosition = "42% 50%",
  className,
  style,
}: ElsewhereHeroProps) {
  const dayVideoRef = useRef<HTMLVideoElement>(null)
  const nightVideoRef = useRef<HTMLVideoElement>(null)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const engineRef = useRef<ReturnType<typeof createAmbientEngine> | null>(null)

  const [isNight, setIsNight] = useState(false)
  const [muted, setMuted] = useState(true)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true))
    return () => {
      cancelAnimationFrame(raf)
      engineRef.current?.dispose()
      audioCtxRef.current?.close()
    }
  }, [])

  function toggleNight() {
    setIsNight((value) => {
      engineRef.current?.setNight(!value)
      return !value
    })
  }

  function toggleMuted() {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

      if (!AudioCtx) return

      const ctx: AudioContext = new AudioCtx()
      audioCtxRef.current = ctx

      const engine = createAmbientEngine(ctx)
      engineRef.current = engine

      engine.setNight(isNight)
      engine.setMuted(false)

      setMuted(false)
      return
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume()
    }

    setMuted((value) => {
      engineRef.current?.setMuted(!value)
      return !value
    })
  }

  // Each line of the headline area rises in, a beat after the one before.
  const rise = (i: number): CSSProperties => ({
    opacity: shown ? 1 : 0,
    transform: shown ? "none" : "translateY(14px)",
    transition: `opacity 1s ease ${0.15 + i * 0.12}s, transform 1s cubic-bezier(.2,.7,.2,1) ${0.15 + i * 0.12}s`,
  })

  return (
    <section
      className={className}
      aria-label={brand}
      style={{
        position: "relative",
        height: "100dvh",
        minHeight: 560,
        width: "100%",
        overflow: "hidden",
        background: "#0a0d08",
        fontFamily: SANS,
        color: COL_TEXT,
        ...style,
      }}
    >
      <style>{css}</style>

      {/* DAY VIDEO */}
      <video
        ref={dayVideoRef}
        src={daySrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{ ...videoStyle, objectPosition, opacity: isNight ? 0 : 1 }}
      />

      {/* NIGHT VIDEO */}
      <video
        ref={nightVideoRef}
        src={nightSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{ ...videoStyle, objectPosition, opacity: isNight ? 1 : 0 }}
      />

      {/* CINEMATIC OVERLAY — a little deeper at the top, so the headline reads on the daytime sky */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.42), rgba(0,0,0,0.16) 38%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.34))",
          pointerEvents: "none",
        }}
      />

      {/* NAVIGATION */}
      <header className="ew-nav" style={{ ...rise(0) }}>
        <a href="#" className="ew-brand">
          {brand}
        </a>
        <nav aria-label={brand} className="ew-links">
          {links.map((l) => (
            <a key={l.href + l.label} href={l.href} className="ew-link">
              {l.label}
            </a>
          ))}
        </nav>
        {navCta && (
          <a href={navCta.href} className="ew-glass ew-pill ew-small">
            {navCta.label}
          </a>
        )}
      </header>

      {/* HEADLINE */}
      <div className="ew-copy">
        <h1 className="ew-title" style={rise(1)}>
          {headline}
        </h1>
        <p className="ew-sub" style={rise(2)}>
          {subline}
        </p>
        <div className="ew-ctas" style={rise(3)}>
          <a href={primaryCta.href} className="ew-pill ew-primary">
            {primaryCta.label}
          </a>
          <button type="button" onClick={toggleMuted} aria-pressed={!muted} className="ew-glass ew-pill">
            <SoundIcon muted={muted} size={16} />
            {muted ? listenLabel : listenOffLabel}
          </button>
        </div>
      </div>

      {/* CONTROLS */}
      <div
        style={{
          position: "absolute",
          left: "clamp(14px, 3vw, 28px)",
          bottom: "clamp(14px, 3vh, 28px)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(8px, 1.5vw, 12px)",
          zIndex: 2,
        }}
      >
        {/* DAY / NIGHT */}
        <button onClick={toggleNight} aria-label={isNight ? "Switch to day" : "Switch to night"} style={iconButtonStyle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {isNight ? (
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke={COL_TEXT} strokeWidth="1.6" strokeLinejoin="round" />
            ) : (
              <>
                <circle cx="12" cy="12" r="4.5" stroke={COL_TEXT} strokeWidth="1.6" />
                <path
                  d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"
                  stroke={COL_TEXT}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        </button>

        {/* AUDIO */}
        <button onClick={toggleMuted} aria-label={muted ? "Unmute" : "Mute"} style={iconButtonStyle}>
          <SoundIcon muted={muted} size={18} />
        </button>

        {soundHint && muted && (
          <span className="ew-hint" aria-hidden="true">
            ← {soundHint}
          </span>
        )}
      </div>

      {/* SIGNATURE */}
      {signature && (
        <span
          style={{
            position: "absolute",
            right: "clamp(12px, 2.5vw, 24px)",
            bottom: "clamp(10px, 2vw, 18px)",
            fontWeight: 500,
            fontSize: "clamp(11px, 1.4vw, 13px)",
            letterSpacing: "0.01em",
            color: "rgba(245,243,236,0.6)",
            zIndex: 2,
          }}
        >
          by{" "}
          <a href={signature.url} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(245,243,236,0.6)", textDecoration: "none" }}>
            {signature.name}
          </a>
        </span>
      )}
    </section>
  )
}

function SoundIcon({ muted, size }: { muted: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9.5v5h3.6L13 19V5L7.6 9.5H4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      {muted ? (
        <path d="M16 9.5 20 14.5M20 9.5 16 14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      ) : (
        <path d="M16.2 8.8a5 5 0 0 1 0 6.4M18.6 6.6a8.5 8.5 0 0 1 0 10.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      )}
    </svg>
  )
}

const videoStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "opacity 1.2s ease",
}

const iconButtonStyle: CSSProperties = {
  width: "clamp(38px, 6vw, 44px)",
  height: "clamp(38px, 6vw, 44px)",
  borderRadius: "50%",
  border: "1px solid rgba(245,243,236,0.18)",
  background: "rgba(245,243,236,0.08)",
  backdropFilter: "blur(14px) saturate(150%)",
  WebkitBackdropFilter: "blur(14px) saturate(150%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  padding: 0,
  color: COL_TEXT,
}

/* Scoped to class names starting with "ew-". */
const css = `
.ew-nav{position:absolute;top:0;left:0;right:0;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:clamp(14px,3vh,24px) clamp(14px,3vw,28px)}
.ew-brand{font-weight:500;font-size:clamp(11px,1.6vw,13px);letter-spacing:.35em;text-transform:uppercase;color:rgba(245,243,236,.75);text-decoration:none}
.ew-links{display:flex;gap:clamp(18px,2.6vw,32px)}
.ew-link{position:relative;font-size:14px;color:rgba(245,243,236,.82);text-decoration:none;transition:color .3s}
.ew-link::after{content:"";position:absolute;left:0;right:0;bottom:-3px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform .4s cubic-bezier(.2,.7,.2,1)}
.ew-link:hover,.ew-link:focus-visible{color:#f5f3ec}
.ew-link:hover::after,.ew-link:focus-visible::after{transform:scaleX(1)}
.ew-copy{position:absolute;left:0;right:0;top:clamp(84px,12vh,140px);z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 20px}
.ew-title{margin:0;max-width:14ch;font-weight:500;font-size:clamp(40px,7.2vw,104px);line-height:.96;letter-spacing:-.04em;color:#f5f3ec;text-shadow:0 2px 30px rgba(0,0,0,.25);text-wrap:balance}
.ew-sub{margin:clamp(14px,2.2vh,22px) 0 0;max-width:40ch;font-size:clamp(15px,1.5vw,18px);line-height:1.5;color:rgba(245,243,236,.88);text-shadow:0 1px 16px rgba(0,0,0,.35);text-wrap:pretty}
.ew-ctas{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:clamp(20px,3.4vh,32px)}
.ew-pill{display:inline-flex;align-items:center;gap:8px;height:46px;padding:0 22px;border-radius:999px;font:inherit;font-size:15px;font-weight:500;text-decoration:none;cursor:pointer;transition:transform .25s ease,background .3s ease,border-color .3s ease}
.ew-pill:active{transform:scale(.97)}
.ew-small{height:38px;padding:0 16px;font-size:13px}
.ew-primary{background:#f5f3ec;color:#0a0d08;border:1px solid #f5f3ec}
.ew-primary:hover{background:#fff}
.ew-glass{color:#f5f3ec;border:1px solid rgba(245,243,236,.22);background:rgba(245,243,236,.10);backdrop-filter:blur(14px) saturate(150%);-webkit-backdrop-filter:blur(14px) saturate(150%)}
.ew-glass:hover{background:rgba(245,243,236,.18);border-color:rgba(245,243,236,.34)}
.ew-hint{font-size:13px;color:rgba(245,243,236,.7);white-space:nowrap;animation:ew-pulse 2.4s ease-in-out infinite}
@keyframes ew-pulse{0%,100%{opacity:.45}50%{opacity:.9}}
.ew-nav a:focus-visible,.ew-pill:focus-visible{outline:2px solid #f5f3ec;outline-offset:3px}
@media (max-width:720px){.ew-links{display:none}.ew-hint{display:none}}
@media (prefers-reduced-motion:reduce){.ew-hint{animation:none}.ew-link::after,.ew-pill{transition:none}}
`
