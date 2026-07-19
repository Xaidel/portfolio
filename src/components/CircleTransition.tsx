import { useCallback, useEffect, useRef } from 'react'
import { animate } from 'animejs'

export type CircleTransitionConfig = {
  /** Expansion/contraction time of the circle, in ms. */
  duration?: number
  /** Anime.js ease name for the expansion/contraction. */
  ease?: string
  /** Color of the thin rim that leads the wipe's edge. */
  leadColor?: string
  /** Color of the body of the wipe — match the destination page background so the reveal is seamless. */
  coverColor?: string
  /** How far the body trails the rim, in ms. 0 removes the rim entirely. */
  leadDelay?: number
  /** Fade time for the covered overlay when it appears/disappears in place, in ms. */
  fadeDuration?: number
  /** Extra radius past the furthest viewport corner, in px, so the edge never peeks in. */
  overshoot?: number
  /** Stacking level of the overlay; must sit above both the outgoing and incoming pages. */
  zIndex?: number
}

const DEFAULTS = {
  duration: 800,
  ease: 'inOutQuart',
  leadColor: '#F6CE71',
  coverColor: '#0a0a0a',
  leadDelay: 90,
  fadeDuration: 260,
  overshoot: 24,
  zIndex: 1200,
} satisfies Required<CircleTransitionConfig>

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function centerOf(el: Element) {
  const rect = el.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

// Diameter of a circle centered at (x, y) that reaches past the furthest
// viewport corner — recomputed at each use so resizes between open and
// close can never leave a corner uncovered.
function coveringDiameter(x: number, y: number, overshoot: number) {
  const reach = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )
  return 2 * (reach + overshoot)
}

// The overlay lives outside React: it exists only for the lifetime of one
// transition, holds no state anyone else reads, and building it
// imperatively lets the async open/close flows own it start-to-finish
// without render-timing handshakes. The root spans the viewport and eats
// all pointer events, so the UI is locked for the whole transition.
function mountOverlay(cfg: Required<CircleTransitionConfig>) {
  const root = document.createElement('div')
  Object.assign(root.style, {
    position: 'fixed',
    inset: '0',
    zIndex: String(cfg.zIndex),
    pointerEvents: 'auto',
    overflow: 'hidden',
  })
  const circle = (color: string) => {
    const el = document.createElement('div')
    Object.assign(el.style, {
      position: 'absolute',
      borderRadius: '50%',
      backgroundColor: color,
      willChange: 'transform',
    })
    root.appendChild(el)
    return el
  }
  const lead = circle(cfg.leadColor)
  const cover = circle(cfg.coverColor)
  const place = (x: number, y: number) => {
    const d = coveringDiameter(x, y, cfg.overshoot)
    for (const el of [lead, cover]) {
      Object.assign(el.style, {
        left: `${x - d / 2}px`,
        top: `${y - d / 2}px`,
        width: `${d}px`,
        height: `${d}px`,
      })
    }
  }
  document.body.appendChild(root)
  return { root, lead, cover, place }
}

// Two rAFs: the first fires before the paint that follows the swap's
// commit, the second after it — guaranteeing the incoming page is really
// on screen (under the opaque cover) before we start revealing it.
function paintFrame() {
  return new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  )
}

// Entrance for the incoming page's content, so pages don't carry their own
// animation logic: anything tagged [data-circle-reveal] rises in while the
// cover fades. Mounted under the opaque cover, so the pre-animation frame
// is never visible.
function revealIncoming() {
  const els = document.querySelectorAll<HTMLElement>('[data-circle-reveal]')
  if (els.length === 0) return Promise.resolve()
  return animate(els, {
    opacity: [0, 1],
    translateY: [16, 0],
    duration: 450,
    delay: 60,
    ease: 'outQuad',
  }).then()
}

/**
 * Circular page wipe driven by Anime.js. A circle grows out of an origin
 * element until it swallows the viewport, the page swaps underneath while
 * hidden, and the circle gets out of the way — with an exact mirror for
 * the trip back. Only transforms and opacity are animated.
 *
 * `openFrom` / `closeTo` each take the swap as a callback, so all
 * sequencing lives here and callers just flip their own state at the
 * moment the screen is covered. Re-entrant calls while a transition is
 * running are ignored, and `prefers-reduced-motion` collapses both trips
 * to an instant swap.
 */
export function useCircleTransition(config: CircleTransitionConfig = {}) {
  const cfgRef = useRef(config)
  useEffect(() => {
    cfgRef.current = config
  })
  const busyRef = useRef(false)

  /** Expand from `origin` until covered, run `swap`, then fade the wipe out to reveal the new page. */
  const openFrom = useCallback(async (origin: Element, swap: () => void) => {
    if (busyRef.current) return
    busyRef.current = true
    try {
      if (prefersReducedMotion()) {
        swap()
        return
      }
      const cfg = { ...DEFAULTS, ...cfgRef.current }
      const { root, lead, cover, place } = mountOverlay(cfg)
      const { x, y } = centerOf(origin)
      place(x, y)
      lead.style.transform = 'scale(0)'
      cover.style.transform = 'scale(0)'
      try {
        await Promise.all([
          animate(lead, { scale: [0, 1], duration: cfg.duration, ease: cfg.ease }).then(),
          animate(cover, {
            scale: [0, 1],
            duration: cfg.duration,
            delay: cfg.leadDelay,
            ease: cfg.ease,
          }).then(),
        ])
        swap()
        await paintFrame()
        await Promise.all([
          revealIncoming(),
          animate(root, {
            opacity: [1, 0],
            duration: cfg.fadeDuration,
            ease: 'outQuad',
          }).then(),
        ])
      } finally {
        root.remove()
      }
    } finally {
      busyRef.current = false
    }
  }, [])

  /**
   * Mirror of `openFrom`: fade the wipe in over the current page, run
   * `swap`, then shrink the circle into `getOrigin()` — measured after the
   * swap, so scrolling or resizing while away can't make it miss.
   */
  const closeTo = useCallback(async (getOrigin: () => Element | null, swap: () => void) => {
    if (busyRef.current) return
    busyRef.current = true
    try {
      if (prefersReducedMotion()) {
        swap()
        return
      }
      const cfg = { ...DEFAULTS, ...cfgRef.current }
      const { root, lead, cover, place } = mountOverlay(cfg)
      const fallback = () => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
      const before = getOrigin()
      const start = before ? centerOf(before) : fallback()
      place(start.x, start.y)
      root.style.opacity = '0'
      try {
        await animate(root, {
          opacity: [0, 1],
          duration: cfg.fadeDuration,
          ease: 'inQuad',
        }).then()
        swap()
        await paintFrame()
        // Any covering circle hides the whole viewport, so re-centering on
        // the origin's fresh position is invisible here.
        const after = getOrigin()
        const end = after ? centerOf(after) : fallback()
        place(end.x, end.y)
        await Promise.all([
          animate(cover, { scale: [1, 0], duration: cfg.duration, ease: cfg.ease }).then(),
          animate(lead, {
            scale: [1, 0],
            duration: cfg.duration,
            delay: cfg.leadDelay,
            ease: cfg.ease,
          }).then(),
        ])
      } finally {
        root.remove()
      }
    } finally {
      busyRef.current = false
    }
  }, [])

  return { openFrom, closeTo }
}
