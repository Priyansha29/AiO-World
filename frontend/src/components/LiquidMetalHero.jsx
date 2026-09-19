import { useCallback, useEffect, useRef, useState } from 'react'
import { LiquidMetal, liquidMetalPresets } from '@paper-design/shaders-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { motion, useReducedMotion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.2, staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

const REST = { offsetX: 0, offsetY: 0, rotation: 0, scale: 1 }

function themeColors() {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return dark
    ? { back: '#15120d', tint: '#d7b98c' }
    : { back: '#ece5d8', tint: '#d7b98c' }
}

function LiquidMetalHero({
  id,
  badge,
  title,
  subtitle,
  primaryCtaLabel,
  secondaryCtaLabel,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
  lanes = [],
  onSelectLane,
}) {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const shaderRef = useRef(null)
  const rafRef = useRef(0)
  const cur = useRef({ ...REST })
  const tgt = useRef({ ...REST })
  const active = useRef(false)
  const [activeLane, setActiveLane] = useState(null)
  const [colors, setColors] = useState(() => themeColors())

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setColors(themeColors())
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const apply = useCallback(() => {
    const mount = shaderRef.current?.paperShaderMount
    if (!mount) return
    mount.setUniforms({
      u_offsetX: cur.current.offsetX,
      u_offsetY: cur.current.offsetY,
      u_rotation: cur.current.rotation,
      u_scale: cur.current.scale,
    })
  }, [])

  const rafTick = useRef(() => {})

  const runFrame = useCallback(() => {
    const k = 0.07
    const { offsetX: tx, offsetY: ty, rotation: tr, scale: ts } = tgt.current
    const c = cur.current
    c.offsetX += (tx - c.offsetX) * k
    c.offsetY += (ty - c.offsetY) * k
    c.rotation += (tr - c.rotation) * k
    c.scale += (ts - c.scale) * k
    apply()
    const settled =
      Math.abs(tx - c.offsetX) < 0.0004 &&
      Math.abs(ty - c.offsetY) < 0.0004 &&
      Math.abs(tr - c.rotation) < 0.01 &&
      Math.abs(ts - c.scale) < 0.001
    if (settled && !active.current) {
      rafRef.current = 0
      return
    }
    rafRef.current = requestAnimationFrame(rafTick.current)
  }, [apply])

  useEffect(() => {
    rafTick.current = runFrame
  })

  const ensureLoop = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(rafTick.current)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      tgt.current.offsetX = nx * 0.045
      tgt.current.offsetY = ny * 0.045
      tgt.current.rotation = nx * 2.5
      tgt.current.scale = 1 + (1 - Math.min(1, Math.hypot(nx, ny) / 1.2)) * 0.03
      active.current = true
      ensureLoop()
    }
    const onLeave = () => {
      active.current = false
      tgt.current = { ...REST }
      ensureLoop()
    }
    const node = sectionRef.current
    const shaderNode = shaderRef.current
    if (node) {
      node.addEventListener('pointermove', onMove)
      node.addEventListener('pointerleave', onLeave)
    }
    return () => {
      node?.removeEventListener('pointermove', onMove)
      node?.removeEventListener('pointerleave', onLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      cur.current = { ...REST }
      shaderNode?.paperShaderMount?.setUniforms({ ...REST })
    }
  }, [reduceMotion, ensureLoop])

  const hoverLane = (lane) => {
    setActiveLane(lane)
    shaderRef.current?.paperShaderMount?.setUniforms({
      u_colorTint: lane?.color ?? colors.tint,
    })
  }

  const leaveLane = () => {
    setActiveLane(null)
    shaderRef.current?.paperShaderMount?.setUniforms({ u_colorTint: colors.tint })
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--bg)]"
      aria-label="Project X hero"
    >
      <LiquidMetal
        ref={shaderRef}
        {...liquidMetalPresets[2]}
        colorBack={colors.back}
        colorTint={colors.tint}
        shape="diamond"
        softness={0.55}
        repetition={1.8}
        scale={0.78}
        fit="contain"
        speed={0.8}
        style={{ position: 'fixed', inset: 0, zIndex: -10 }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(64%_50%_at_50%_46%,transparent_0%,transparent_34%,var(--bg)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24 lg:px-8">
        <div className="container max-w-7xl">
          <motion.div
            className="space-y-8 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {badge && (
              <motion.div className="flex justify-center" variants={itemVariants}>
                <Badge
                  variant="secondary"
                  className="border-foreground/20 bg-foreground/10 text-foreground backdrop-blur-sm transition-colors duration-300 hover:bg-foreground/20"
                >
                  {badge}
                </Badge>
              </motion.div>
            )}

            <motion.div className="mx-auto max-w-4xl space-y-6" variants={itemVariants}>
              <h1 className="text-5xl font-bold leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
                {title}
              </h1>
              <p className="mx-auto max-w-2xl text-xl leading-relaxed text-foreground/90 sm:text-2xl">
                {subtitle}
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              variants={buttonVariants}
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button
                  onClick={onPrimaryCtaClick}
                  size="lg"
                  className="bg-foreground px-8 py-6 text-lg font-semibold text-background shadow-2xl transition-all duration-300 hover:bg-foreground/90"
                >
                  {primaryCtaLabel}
                </Button>
              </motion.div>

              {secondaryCtaLabel && onSecondaryCtaClick && (
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    onClick={onSecondaryCtaClick}
                    variant="outline"
                    size="lg"
                    className="border-foreground/30 px-8 py-6 text-lg font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:border-foreground/50 hover:bg-foreground/10"
                  >
                    {secondaryCtaLabel}
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {lanes.length > 0 && (
              <motion.div className="pt-10" variants={itemVariants}>
                <Card className="border-foreground/20 bg-foreground/10 shadow-2xl backdrop-blur-md">
                  <div className="p-6 sm:p-8">
                    <div className="mx-auto mb-6 flex max-w-xs items-center gap-3">
                      <span className="h-px flex-1 bg-foreground/20" aria-hidden="true" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                        Pick a lane
                      </span>
                      <span className="h-px flex-1 bg-foreground/20" aria-hidden="true" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {lanes.map((lane) => (
                        <button
                          key={lane.key}
                          type="button"
                          onMouseEnter={() => hoverLane(lane)}
                          onMouseLeave={leaveLane}
                          onFocus={() => hoverLane(lane)}
                          onBlur={leaveLane}
                          onClick={() => onSelectLane?.(lane)}
                          className={`group flex flex-col items-start gap-1 rounded-xl border px-5 py-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                            activeLane?.key === lane.key
                              ? 'border-foreground/40 bg-foreground/10'
                              : 'border-foreground/15 hover:border-foreground/30'
                          }`}
                        >
                          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
                            {lane.label}
                          </span>
                          <span className="text-sm text-foreground/70">{lane.tagline}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-b from-transparent to-[var(--bg)]"
        aria-hidden="true"
      />
    </section>
  )
}

export default LiquidMetalHero