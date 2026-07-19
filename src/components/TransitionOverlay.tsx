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

// The style crossfade is confined to the start of the flight, where outExpo
// has the clone moving fastest — motion masks the brief blend, and for the
// rest of the trip only one text style is visible. Running it any longer
// leaves both styles legibly stacked once the clone slows near landing.
const CROSSFADE_DURATION = 200

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

// Mirrors CardHeader/CardFooter's classes — the card uses a different font,
// weight, size and (for title/tagline) color than the detail header.
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
  const sourceClass = direction === 'toDetail' ? CARD_CLASS : DETAIL_CLASS
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || specs.length === 0) {
      onComplete()
      return
    }

    const animations: { then: () => Promise<unknown> }[] = []
    specs.forEach((spec, i) => {
      const el = root.querySelector<HTMLElement>(`[data-clone="${spec.key}"]`)
      if (!el) return
      const { from, to } = spec
      const delay = i * 25

      // FLIP invert: the clone is laid out at its final (target) box, then
      // pushed back to where the source element was via transform. It stays
      // fully opaque the whole flight — the source element hides in the same
      // commit this mounts, so the clone reads as the same text taking off.
      const scaleX = from.width / to.width
      const scaleY = from.height / to.height
      el.style.transform = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${scaleX}, ${scaleY})`
      animations.push(
        animate(el, {
          translateX: 0,
          translateY: 0,
          scaleX: 1,
          scaleY: 1,
          duration: SHARED_TRANSITION_DURATION,
          delay,
          ease: 'outExpo',
        }),
      )

      // Text clones carry two stacked layers — one styled as the source,
      // one as the target — crossfaded quickly at takeoff so the
      // font/weight/color change reads as a morph instead of snapping at
      // either end, without the two styles ever sitting visibly stacked.
      const targetLayer = el.querySelector<HTMLElement>('[data-clone-layer="target"]')
      const sourceLayer = el.querySelector<HTMLElement>('[data-clone-layer="source"]')
      if (targetLayer && sourceLayer) {
        targetLayer.style.opacity = '0'
        animations.push(
          animate(targetLayer, {
            opacity: 1,
            duration: CROSSFADE_DURATION,
            delay,
            ease: 'inOutSine',
          }),
        )
        animations.push(
          animate(sourceLayer, {
            opacity: 0,
            duration: CROSSFADE_DURATION,
            delay,
            ease: 'inOutSine',
          }),
        )
      }
    })

    Promise.all(animations.map((a) => a.then())).then(onComplete)
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
          className="absolute"
          style={{
            left: spec.to.left,
            top: spec.to.top,
            width: spec.to.width,
            height: spec.to.height,
            transformOrigin: 'top left',
          }}
        >
          {spec.key === 'logo' ? (
            // Same asset and color on both ends — no crossfade needed, it
            // just rides the box from one size to the other.
            <LogoMark className={`h-full w-full ${targetClass.logo}`} />
          ) : (
            <>
              <div
                data-clone-layer="target"
                className={`absolute inset-0 flex items-center ${targetClass[spec.key]}`}
              >
                {TEXT_CONTENT[spec.key]}
              </div>
              {/* Counter-scaled against the wrapper's FLIP transform: at
                  t=0 the net scale is exactly 1, so this layer is a
                  pixel-perfect stand-in for the source element. */}
              <div
                data-clone-layer="source"
                className={`absolute top-0 left-0 flex items-center ${sourceClass[spec.key]}`}
                style={{
                  width: spec.from.width,
                  height: spec.from.height,
                  transform: `scale(${spec.to.width / spec.from.width}, ${spec.to.height / spec.from.height})`,
                  transformOrigin: 'top left',
                }}
              >
                {TEXT_CONTENT[spec.key]}
              </div>
            </>
          )}
        </div>
      ))}
    </div>,
    document.body,
  )
}
