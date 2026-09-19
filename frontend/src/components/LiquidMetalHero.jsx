import { useCallback, useEffect, useRef, useState } from 'react'
import { LiquidMetal, liquidMetalPresets } from '@paper-design/shaders-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import './LiquidMetalHero.css'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.1, staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
}

const REST = { offsetX: 0, offsetY: 0, rotation: 18, scale: 1 }

function themeColors() {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return dark
    ? { back: '#6f5a3a', tint: '#ffedc8' }
    : { back: '#b49a6a', tint: '#ffffff' }
}

function LiquidMetalHero({
  id,
  eyebrow,
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
  const [compact, setCompact] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
  )

  useEffect(() => {
    const mqDark = window.matchMedia('(prefers-color-scheme: dark)')
    const mqCompact = window.matchMedia('(max-width: 640px)')
    const onChangeDark = () => setColors(themeColors())
    const onChangeCompact = (e) => setCompact(e.matches)
    mqDark.addEventListener('change', onChangeDark)
    mqCompact.addEventListener('change', onChangeCompact)
    return () => {
      mqDark.removeEventListener('change', onChangeDark)
      mqCompact.removeEventListener('change', onChangeCompact)
    }
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
    const k = 0.06
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
      tgt.current.offsetX = nx * 0.035
      tgt.current.offsetY = ny * 0.035
      tgt.current.rotation = REST.rotation + nx * 1.6
      tgt.current.scale = REST.scale
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const glassY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const glassScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.55], [0, 44])

  return (
    <section
      id={id}
      ref={sectionRef}
      className="liquid-hero"
      aria-label="Project X hero"
    >
      <div className="liquid-hero__ambient" aria-hidden="true" />

      <motion.div
        className="liquid-hero__glass"
        aria-hidden="true"
        style={reduceMotion ? undefined : { y: glassY, scale: glassScale }}
      >
        <LiquidMetal
          ref={shaderRef}
          {...liquidMetalPresets[0]}
          colorBack={colors.back}
          colorTint={colors.tint}
          shape="diamond"
          softness={0.5}
          repetition={compact ? 1.9 : 1.6}
          distortion={0.16}
          contour={0.8}
          shiftRed={0.35}
          shiftBlue={-0.35}
          angle={70}
          scale={compact ? 0.8 : 0.94}
          rotation={REST.rotation}
          fit="contain"
          speed={reduceMotion ? 0 : 0.45}
          className="h-full w-full"
        />
      </motion.div>

      <motion.div
        className="liquid-hero__veil"
        aria-hidden="true"
      />

      <motion.div
        className="liquid-hero__body"
        style={reduceMotion ? undefined : { opacity: contentOpacity, y: contentY }}
      >
        <motion.div
          className="liquid-hero__inner"
          variants={containerVariants}
          initial={reduceMotion ? false : 'hidden'}
          animate={reduceMotion ? false : 'visible'}
        >
          <motion.div variants={itemVariants}>
            <p className="liquid-hero__eyebrow">{eyebrow}</p>
          </motion.div>

          <motion.h1
            className="liquid-hero__title"
            variants={itemVariants}
          >
            {title}
          </motion.h1>

          <motion.p className="liquid-hero__lede" variants={itemVariants}>
            {subtitle}
          </motion.p>

          <motion.div className="liquid-hero__actions" variants={itemVariants}>
            {primaryCtaLabel && (
              <button
                type="button"
                className="liquid-hero__cta liquid-hero__cta--primary"
                onClick={onPrimaryCtaClick}
              >
                {primaryCtaLabel}
              </button>
            )}
            {secondaryCtaLabel && (
              <button
                type="button"
                className="liquid-hero__cta liquid-hero__cta--ghost"
                onClick={onSecondaryCtaClick}
              >
                {secondaryCtaLabel}
              </button>
            )}
          </motion.div>

          {lanes.length > 0 && (
            <motion.nav
              className="liquid-hero__lanes"
              aria-label="Pick a lane"
              variants={itemVariants}
            >
              <span className="liquid-hero__lanes-label">Pick a lane</span>
              <div className="liquid-hero__lanes-list">
                {lanes.map((lane) => (
                  <button
                    key={lane.key}
                    type="button"
                    onMouseEnter={() => hoverLane(lane)}
                    onMouseLeave={leaveLane}
                    onFocus={() => hoverLane(lane)}
                    onBlur={leaveLane}
                    onClick={() => onSelectLane?.(lane)}
                    aria-current={activeLane?.key === lane.key ? 'true' : undefined}
                    className="liquid-hero__lane"
                  >
                    {lane.label}
                  </button>
                ))}
              </div>
            </motion.nav>
          )}
        </motion.div>
      </motion.div>

      <div className="liquid-hero__fade" aria-hidden="true" />
    </section>
  )
}

export default LiquidMetalHero