import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from 'react'
import CardFront from './CardFront'
import CardBack from './CardBack'

const MAX_TILT_DEG = 4

function canTilt() {
  return (
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export default function Card({
  flipped,
  onFlippedChange,
  contentRevealed = true,
}: {
  flipped: boolean
  onFlippedChange: (flipped: boolean) => void
  contentRevealed?: boolean
}) {
  const tiltRef = useRef<HTMLDivElement>(null)
  const pressingRef = useRef(false)

  const toggle = () => onFlippedChange(!flipped)

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  // No CSS transition on the rotation: it's applied directly per mousemove
  // event, so whatever value JS just set is exactly what's rendered and
  // hit-tested — no async "catching up" window where a click could land on
  // stale geometry. Real mousemove fires often enough during actual cursor
  // movement that this still reads as smooth.
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!tiltRef.current || !canTilt() || pressingRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const fracX = (e.clientX - rect.left) / rect.width
    const fracY = (e.clientY - rect.top) / rect.height
    const px = fracX - 0.5
    const py = fracY - 0.5
    const rotateY = px * MAX_TILT_DEG * 2
    const rotateX = -py * MAX_TILT_DEG * 2
    tiltRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    tiltRef.current.style.setProperty('--glare-x', `${fracX * 100}%`)
    tiltRef.current.style.setProperty('--glare-y', `${fracY * 100}%`)
  }

  const resetTilt = () => {
    if (tiltRef.current) tiltRef.current.style.transform = ''
  }

  // Pause tilt updates for the duration of a click gesture, as a defensive
  // backstop against any last-moment mousemove landing between mousedown and
  // mouseup.
  useEffect(() => {
    const handlePressStart = () => {
      pressingRef.current = true
    }
    const handlePressEnd = () => {
      pressingRef.current = false
    }
    window.addEventListener('mousedown', handlePressStart)
    window.addEventListener('mouseup', handlePressEnd)
    return () => {
      window.removeEventListener('mousedown', handlePressStart)
      window.removeEventListener('mouseup', handlePressEnd)
    }
  }, [])

  useEffect(() => {
    resetTilt()
  }, [flipped])

  return (
    <div className="relative aspect-[4/3] w-[clamp(300px,88vw,620px)] max-h-[88svh] max-w-full [perspective:1600px] sm:aspect-[3/2] lg:aspect-[7/4]">
      <div
        ref={tiltRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        className="group relative h-full w-full [transform-style:preserve-3d]"
      >
        <div
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-label={flipped ? 'Show card front' : 'Flip card to see projects and contact'}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          className={`relative h-full w-full cursor-pointer rounded-2xl outline-none [transform-style:preserve-3d] transition-transform duration-700 ease-[cubic-bezier(0.4,0.2,0.2,1)] focus-visible:ring-2 focus-visible:ring-[#F6CE71] motion-reduce:transition-none ${
            flipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          <div
            className={`absolute inset-0 [backface-visibility:hidden] ${flipped ? 'pointer-events-none' : ''}`}
          >
            <CardFront contentRevealed={contentRevealed} />
          </div>
          <div
            className={`absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] ${flipped ? '' : 'pointer-events-none'}`}
          >
            <CardBack />
          </div>
        </div>
      </div>
    </div>
  )
}
