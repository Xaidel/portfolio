import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { animate } from 'animejs'
import { LogoMark } from './icons'

export type SharedKey = 'logo' | 'name' | 'title' | 'tagline'

export type CloneSpec = {
  key: SharedKey
  from: DOMRect
  to: DOMRect
}

export const SHARED_TRANSITION_DURATION = 650

const TEXT_CONTENT: Record<Exclude<SharedKey, 'logo'>, string> = {
  name: 'Karl Abechuela',
  title: 'Software Engineer, AI & Automation',
  tagline: 'Ship first, panic never.',
}

// Mirrors DetailView's classes for these nodes exactly, so on the way in
// the clone is indistinguishable from the real element the instant it
// lands and swaps in.
const DETAIL_CLASS: Record<SharedKey, string> = {
  logo: 'text-[#F6CE71]',
  name: 'whitespace-nowrap font-mono text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-wide text-[#E5D0AC]',
  title: 'whitespace-nowrap text-[clamp(0.875rem,2vw,1rem)] text-neutral-500',
  tagline: 'whitespace-nowrap text-sm uppercase tracking-[0.1em] text-[#F6CE71]',
}

// Mirrors CardHeader/CardFooter's classes, for the reverse trip — the card
// uses a different font, weight, size and (for title/tagline) color than
// the detail header, so the clone has to switch targets by direction or it
// lands mid-flight looking like detail text and snaps to card text at the
// very end.
const CARD_CLASS: Record<SharedKey, string> = {
  logo: 'text-[#F6CE71]',
  name: 'whitespace-nowrap text-[clamp(0.8125rem,2.6vw,1rem)] font-semibold leading-tight text-[#E5D0AC]',
  title: 'whitespace-nowrap text-[clamp(0.5625rem,1.7vw,0.75rem)] text-[#E5D0AC]',
  tagline: 'whitespace-nowrap text-[clamp(0.5rem,1.3vw,0.6875rem)] font-medium uppercase tracking-[0.1em] text-[#E5D0AC]',
}

export default function TransitionOverlay({
  specs,
  direction,
  onComplete,
}: {
  specs: CloneSpec[]
  direction: 'toDetail' | 'toCard'
  onComplete: () => void
}) {
  const targetClass = direction === 'toDetail' ? DETAIL_CLASS : CARD_CLASS
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || specs.length === 0) {
      onComplete()
      return
    }

    const animations = specs.map((spec, i) => {
      const el = root.querySelector<HTMLElement>(`[data-clone="${spec.key}"]`)
      if (!el) return null
      const { from, to } = spec

      // FLIP invert: the clone is laid out at its final (target) box, then
      // pushed back to where the source element was via transform.
      const scaleX = from.width / to.width
      const scaleY = from.height / to.height
      el.style.transform = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${scaleX}, ${scaleY})`
      el.style.opacity = '0'
      return animate(el, {
        translateX: 0,
        translateY: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: SHARED_TRANSITION_DURATION,
        delay: i * 25,
        ease: 'outExpo',
      })
    })

    Promise.all(animations.filter((a) => a !== null).map((a) => a.then())).then(onComplete)
    // Specs are captured once per transition and this effect should only
    // ever run for the initial mount of a given overlay instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return createPortal(
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-[999]">
      {specs.map((spec) => (
        <div
          key={spec.key}
          data-clone={spec.key}
          className={`absolute flex items-center ${targetClass[spec.key]}`}
          style={{
            left: spec.to.left,
            top: spec.to.top,
            width: spec.to.width,
            height: spec.to.height,
            transformOrigin: 'top left',
          }}
        >
          {spec.key === 'logo' ? <LogoMark className="h-full w-full" /> : TEXT_CONTENT[spec.key]}
        </div>
      ))}
    </div>,
    document.body,
  )
}
