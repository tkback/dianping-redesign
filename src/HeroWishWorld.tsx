import { AnimatePresence, animate, motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import type { MotionStyle, MotionValue } from 'framer-motion'
import { Orbit } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FocusEvent, KeyboardEvent, PointerEvent } from 'react'
import { heroWishPeople } from './data'
import type { HeroWishPerson } from './data'

const TAU = Math.PI * 2
const AUTO_SPEED = 0.00005
const FOCUS_Y = 0.72
const FOCUS_Z = Math.sqrt(1 - FOCUS_Y * FOCUS_Y)
const avatarSizes = [68, 48, 58, 44, 64, 50, 60, 46, 66, 48, 56, 42, 64, 50, 58, 46, 66, 46, 60, 44, 62, 48, 56, 42, 64, 50, 58, 46]

type Point3D = { x: number; y: number; z: number }
type Rotation = { yaw: number; pitch: number }

const spherePoints: Point3D[] = heroWishPeople.map((_, index) => {
  const y = 1 - (index / (heroWishPeople.length - 1)) * 2
  const radius = Math.sqrt(1 - y * y)
  const theta = Math.PI * (3 - Math.sqrt(5)) * index
  return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius }
})

function projectPoint(point: Point3D, yaw: number, pitch: number, radius: number) {
  const cosYaw = Math.cos(yaw)
  const sinYaw = Math.sin(yaw)
  const x = point.x * cosYaw + point.z * sinYaw
  const rotatedZ = -point.x * sinYaw + point.z * cosYaw
  const cosPitch = Math.cos(pitch)
  const sinPitch = Math.sin(pitch)
  const y = point.y * cosPitch - rotatedZ * sinPitch
  const z = point.y * sinPitch + rotatedZ * cosPitch

  return { x: radius * x, y: -radius * y, depth: (z + 1) / 2 }
}

function getFocusRotation(point: Point3D): Rotation {
  const radial = Math.hypot(point.x, point.z)
  return {
    yaw: Math.atan2(-point.x, point.z),
    pitch: Math.atan2(point.y, radial) - Math.atan2(FOCUS_Y, FOCUS_Z),
  }
}

function shortestAngle(target: number, current: number) {
  return ((((target - current) + Math.PI) % TAU) + TAU) % TAU - Math.PI
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

type HeroAvatarProps = {
  person: HeroWishPerson
  index: number
  yaw: MotionValue<number>
  pitch: MotionValue<number>
  radius: number
  selected: boolean
  onSelect: () => void
  buttonRef: (node: HTMLButtonElement | null) => void
}

function HeroAvatar({ person, index, yaw, pitch, radius, selected, onSelect, buttonRef }: HeroAvatarProps) {
  const point = spherePoints[index]
  const x = useTransform([yaw, pitch], ([currentYaw, currentPitch]: number[]) =>
    projectPoint(point, currentYaw, currentPitch, radius).x,
  )
  const y = useTransform([yaw, pitch], ([currentYaw, currentPitch]: number[]) =>
    projectPoint(point, currentYaw, currentPitch, radius).y,
  )
  const opacity = useTransform([yaw, pitch], ([currentYaw, currentPitch]: number[]) => {
    const { depth } = projectPoint(point, currentYaw, currentPitch, radius)
    return 0.14 + Math.pow(depth, 1.65) * 0.86
  })
  const zIndex = useTransform([yaw, pitch], ([currentYaw, currentPitch]: number[]) => {
    const { depth } = projectPoint(point, currentYaw, currentPitch, radius)
    return Math.round(3 + depth * 23)
  })
  const scale = useTransform([yaw, pitch], ([currentYaw, currentPitch]: number[]) => {
    const { depth } = projectPoint(point, currentYaw, currentPitch, radius)
    return 0.16 + Math.pow(depth, 1.45) * 0.94 + (selected ? depth * 0.05 : 0)
  })
  const filter = useTransform([yaw, pitch], ([currentYaw, currentPitch]: number[]) => {
    const { depth } = projectPoint(point, currentYaw, currentPitch, radius)
    return `blur(${(1 - depth) * 1.1}px) saturate(${0.65 + depth * 0.35})`
  })

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      className="wish-avatar"
      style={{ x, y, opacity, zIndex }}
      aria-label={`${person.name}，${person.category}：${person.wish}`}
      aria-pressed={selected}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
    >
      <motion.span
        className="wish-avatar-visual"
        style={{ scale, filter, '--avatar-size': `${avatarSizes[index]}px` } as MotionStyle}
      >
        <img
          src={person.image}
          alt=""
          draggable={false}
          loading={index < 6 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
        />
      </motion.span>
    </motion.button>
  )
}

export default function HeroWishWorld() {
  const reduced = Boolean(useReducedMotion())
  const initialRotation = getFocusRotation(spherePoints[0])
  const yaw = useMotionValue(initialRotation.yaw)
  const pitch = useMotionValue(initialRotation.pitch)
  const worldRef = useRef<HTMLDivElement>(null)
  const avatarRefs = useRef<(HTMLButtonElement | null)[]>([])
  const snapAnimations = useRef<{ stop: () => void }[]>([])
  const hovered = useRef(false)
  const focused = useRef(false)
  const inView = useRef(true)
  const pageVisible = useRef(true)
  const autoAfter = useRef(0)
  const velocity = useRef({ yaw: 0, pitch: 0 })
  const suppressClick = useRef(false)
  const drag = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    moved: false,
  })
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [radius, setRadius] = useState(220)
  const activePerson = heroWishPeople[activeIndex]

  const stopSnap = () => {
    snapAnimations.current.forEach((animation) => animation.stop())
    snapAnimations.current = []
  }

  useEffect(() => {
    const element = worldRef.current
    if (!element) return

    const updateRadius = () => {
      const { width, height } = element.getBoundingClientRect()
      setRadius(Math.max(112, Math.min(width * 0.43, height * 0.36)))
    }
    const resizeObserver = new ResizeObserver(updateRadius)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting
    })
    const updateVisibility = () => {
      pageVisible.current = !document.hidden
    }

    updateRadius()
    updateVisibility()
    resizeObserver.observe(element)
    intersectionObserver.observe(element)
    document.addEventListener('visibilitychange', updateVisibility)

    return () => {
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', updateVisibility)
      stopSnap()
    }
  }, [])

  useEffect(() => {
    if (!reduced) return
    stopSnap()
    velocity.current = { yaw: 0, pitch: 0 }
  }, [reduced])

  useAnimationFrame((time, delta) => {
    if (reduced || !inView.current || !pageVisible.current || drag.current.active) return
    const frame = Math.min(delta, 34)
    const moving = Math.abs(velocity.current.yaw) > 0.000002 || Math.abs(velocity.current.pitch) > 0.000002

    if (moving) {
      yaw.set(yaw.get() + velocity.current.yaw * frame)
      pitch.set(pitch.get() + velocity.current.pitch * frame)
      const decay = Math.exp(-frame / 280)
      velocity.current.yaw *= decay
      velocity.current.pitch *= decay
      if (Math.abs(velocity.current.yaw) <= 0.000002) velocity.current.yaw = 0
      if (Math.abs(velocity.current.pitch) <= 0.000002) velocity.current.pitch = 0
      return
    }

    if (time >= autoAfter.current && !hovered.current && !focused.current) {
      yaw.set(yaw.get() + AUTO_SPEED * frame)
    }
  })

  const selectPerson = (index: number, moveFocus = false) => {
    stopSnap()
    velocity.current = { yaw: 0, pitch: 0 }
    autoAfter.current = performance.now() + 4500
    setActiveIndex(index)

    if (moveFocus) {
      window.requestAnimationFrame(() => avatarRefs.current[index]?.focus())
    }
    if (reduced) return

    const target = getFocusRotation(spherePoints[index])
    const current = { yaw: yaw.get(), pitch: pitch.get() }
    const nextYaw = current.yaw + shortestAngle(target.yaw, current.yaw)
    const nextPitch = current.pitch + shortestAngle(target.pitch, current.pitch)
    const options = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
    snapAnimations.current = [animate(yaw, nextYaw, options), animate(pitch, nextPitch, options)]
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    stopSnap()
    autoAfter.current = Number.POSITIVE_INFINITY
    velocity.current = { yaw: 0, pitch: 0 }
    suppressClick.current = false
    drag.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: performance.now(),
      moved: false,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current
    if (!current.active || current.pointerId !== event.pointerId) return

    const totalX = event.clientX - current.startX
    const totalY = event.clientY - current.startY
    if (!current.moved && Math.hypot(totalX, totalY) > 6) {
      if (event.pointerType === 'touch' && Math.abs(totalY) > Math.abs(totalX)) {
        current.active = false
        autoAfter.current = performance.now() + 3000
        return
      }
      current.moved = true
      suppressClick.current = true
      setDragging(true)
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId)
      }
    }
    if (!current.moved) return

    const now = performance.now()
    const elapsed = Math.max(8, now - current.lastTime)
    const yawChange = (event.clientX - current.lastX) * 0.006
    const pitchChange = (event.clientY - current.lastY) * 0.004
    yaw.set(yaw.get() + yawChange)
    pitch.set(pitch.get() + pitchChange)
    velocity.current.yaw = clamp(velocity.current.yaw * 0.35 + (yawChange / elapsed) * 0.65, -0.0022, 0.0022)
    velocity.current.pitch = clamp(velocity.current.pitch * 0.35 + (pitchChange / elapsed) * 0.65, -0.0015, 0.0015)
    current.lastX = event.clientX
    current.lastY = event.clientY
    current.lastTime = now
  }

  const finishPointer = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const current = drag.current
    if (!current.active || current.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    current.active = false
    autoAfter.current = performance.now() + 4000
    setDragging(false)
    if (cancelled) velocity.current = { yaw: 0, pitch: 0 }
    if (current.moved) {
      window.setTimeout(() => {
        suppressClick.current = false
      }, 0)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const direction = event.key === 'ArrowRight' ? 1 : -1
    const next = (activeIndex + direction + heroWishPeople.length) % heroWishPeople.length
    selectPerson(next, true)
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      focused.current = false
      autoAfter.current = performance.now() + 2500
    }
  }

  return (
    <motion.div
      ref={worldRef}
      className={`hero-wishes wish-world ${dragging ? 'wish-world--dragging' : ''}`}
      role="region"
      aria-label={`大家的真实心愿，${heroWishPeople.length} 种生活灵感，可拖动旋转`}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => finishPointer(event)}
      onPointerCancel={(event) => finishPointer(event, true)}
      onClickCapture={(event) => {
        if (!suppressClick.current) return
        event.preventDefault()
        event.stopPropagation()
        suppressClick.current = false
      }}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => { hovered.current = true }}
      onMouseLeave={() => { hovered.current = false }}
      onFocusCapture={(event) => {
        focused.current = event.target instanceof HTMLElement && event.target.matches(':focus-visible')
        if (focused.current) autoAfter.current = Number.POSITIVE_INFINITY
      }}
      onBlurCapture={handleBlur}
    >
      <div className="hero-track hero-track--one" aria-hidden="true" />
      <div className="hero-track hero-track--two" aria-hidden="true" />
      <div className="hero-track hero-track--three" aria-hidden="true" />

      <div className="wish-world-center" aria-live="polite" aria-atomic="true">
        <div className="wish-world-center-top">
          <span>我听着呢</span>
          <small>{activePerson.category}</small>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activePerson.id}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: reduced ? 0 : 0.24 }}
          >
            <p className="wish-world-quote">“{activePerson.wish}”</p>
            <div className="wish-world-person">
              <strong>{activePerson.name}</strong>
              <span>的生活心愿</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {heroWishPeople.map((person, index) => (
        <HeroAvatar
          key={person.id}
          person={person}
          index={index}
          yaw={yaw}
          pitch={pitch}
          radius={radius}
          selected={activeIndex === index}
          onSelect={() => selectPerson(index)}
          buttonRef={(node) => { avatarRefs.current[index] = node }}
        />
      ))}

      <div className="wish-world-hint">
        <Orbit size={15} strokeWidth={1.7} aria-hidden="true" />
        <span>拖动旋转星球，点一点听见心声</span>
      </div>
    </motion.div>
  )
}
