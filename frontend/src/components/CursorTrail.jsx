import { useEffect, useRef } from 'react'

// Luminous multi-stop aurora palette inspired by wascape.com
const PALETTE_STOPS = [
  [46, 140, 255],   // cerulean blue
  [139, 92, 246],   // violet
  [52, 197, 214],   // cyan
  [224, 122, 160],  // warm rose
]

const SPRITE_COUNT = 32
const SPRITE_SIZE = 128
const CANVAS_SCALE = 0.34
const STAMP_SPACING = 10
const PARTICLE_LIFETIME_MS = 1150
const IDLE_SLEEP_MS = 1400

function buildSprites() {
  const palette = Array.from({ length: SPRITE_COUNT }, (_, idx) => {
    const t = (idx / SPRITE_COUNT) * PALETTE_STOPS.length
    const a = PALETTE_STOPS[Math.floor(t) % PALETTE_STOPS.length]
    const b = PALETTE_STOPS[(Math.floor(t) + 1) % PALETTE_STOPS.length]
    const frac = t - Math.floor(t)
    return [
      Math.round(a[0] + (b[0] - a[0]) * frac),
      Math.round(a[1] + (b[1] - a[1]) * frac),
      Math.round(a[2] + (b[2] - a[2]) * frac),
    ]
  })

  return palette.map(([r, g, b]) => {
    const offscreen = document.createElement('canvas')
    offscreen.width = SPRITE_SIZE
    offscreen.height = SPRITE_SIZE
    const octx = offscreen.getContext('2d')
    if (octx) {
      const half = SPRITE_SIZE / 2
      const grad = octx.createRadialGradient(half, half, 0, half, half, half)
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.4)`)
      grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, 0.16)`)
      grad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0.04)`)
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
      octx.fillStyle = grad
      octx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE)
    }
    return offscreen
  })
}

/**
 * Full-viewport ambient pointer trail inspired by wascape.com.
 * Renders soft pre-baked aurora glow sprites onto a 0.34x downscaled canvas
 * with additive (`screen`) blending and goes completely idle when stationary.
 */
export default function CursorTrail() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (reducedMotion.matches || !finePointer.matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    const resize = () => {
      width = Math.max(1, Math.round(CANVAS_SCALE * window.innerWidth))
      height = Math.max(1, Math.round(CANVAS_SCALE * window.innerHeight))
      canvas.width = width
      canvas.height = height
    }
    resize()
    window.addEventListener('resize', resize)

    const sprites = buildSprites()
    const particles = []
    let hueCursor = Math.random() * SPRITE_COUNT
    let carryDist = 0
    let lastX = 0
    let lastY = 0
    let hasMoved = false
    let lastMoveAt = 0
    let rafId = 0

    const render = (now) => {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.085)'
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = 'lighter'
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i]
        const age = (now - p.born) / PARTICLE_LIFETIME_MS
        if (age >= 1) {
          particles.splice(i, 1)
          continue
        }
        p.x += p.vx
        p.y += p.vy
        const size = (0.5 + 0.75 * age) * SPRITE_SIZE
        ctx.globalAlpha = (1 - age) * (1 - age) * 0.09
        ctx.drawImage(sprites[p.hue], p.x - size / 2, p.y - size / 2, size, size)
      }
      ctx.globalAlpha = 1

      if (particles.length === 0 && now - lastMoveAt > IDLE_SLEEP_MS) {
        ctx.globalCompositeOperation = 'source-over'
        ctx.clearRect(0, 0, width, height)
        rafId = 0
        return
      }
      rafId = requestAnimationFrame(render)
    }

    const onPointerMove = (e) => {
      const sx = CANVAS_SCALE * e.clientX
      const sy = CANVAS_SCALE * e.clientY
      if (!hasMoved) {
        lastX = sx
        lastY = sy
        hasMoved = true
      }

      const dx = sx - lastX
      const dy = sy - lastY
      const dist = Math.hypot(dx, dy)
      carryDist += dist

      while (carryDist >= STAMP_SPACING) {
        carryDist -= STAMP_SPACING
        const t = dist === 0 ? 1 : 1 - carryDist / dist
        particles.push({
          x: lastX + dx * t,
          y: lastY + dy * t,
          hue: Math.floor(hueCursor) % SPRITE_COUNT,
          born: performance.now(),
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22 - 0.06,
        })
        hueCursor = (hueCursor + 0.3) % SPRITE_COUNT
      }

      lastX = sx
      lastY = sy
      lastMoveAt = performance.now()
      if (!rafId) rafId = requestAnimationFrame(render)
    }

    const onMotionChange = () => {
      if (reducedMotion.matches) {
        particles.length = 0
        if (rafId) cancelAnimationFrame(rafId)
        rafId = 0
        ctx.globalCompositeOperation = 'source-over'
        ctx.clearRect(0, 0, width, height)
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    reducedMotion.addEventListener('change', onMotionChange)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', resize)
      reducedMotion.removeEventListener('change', onMotionChange)
      if (rafId) cancelAnimationFrame(rafId)
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, width, height)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 h-full w-full print:hidden"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
