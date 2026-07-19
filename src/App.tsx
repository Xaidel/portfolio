import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import Card from './components/Card'
import DetailView from './components/DetailView'
import TransitionOverlay, {
  SHARED_TRANSITION_DURATION,
  type CloneSpec,
  type SharedKey,
} from './components/TransitionOverlay'

const SHARED_KEYS: SharedKey[] = ['logo', 'name', 'title', 'tagline']

type Phase = 'card' | 'toDetail' | 'detail' | 'toCard'

function measureShared(fromRoot: HTMLElement, toRoot: HTMLElement) {
  const fromRects = new Map<string, DOMRect>()
  fromRoot.querySelectorAll<HTMLElement>('[data-shared]').forEach((el) => {
    const rect = el.getBoundingClientRect()
    // Name/title are hidden on narrow card layouts (`hidden sm:block`) and
    // collapse to a zero-size rect there — skip animating those.
    if (rect.width > 0 && rect.height > 0) {
      fromRects.set(el.dataset.shared as string, rect)
    }
  })
  const toRects = new Map<string, DOMRect>()
  toRoot.querySelectorAll<HTMLElement>('[data-shared]').forEach((el) => {
    toRects.set(el.dataset.shared as string, el.getBoundingClientRect())
  })
  return { fromRects, toRects }
}

function App() {
  const [phase, setPhase] = useState<Phase>('card')
  const [flipped, setFlipped] = useState(false)
  const [clones, setClones] = useState<CloneSpec[] | null>(null)
  const [contentRevealed, setContentRevealed] = useState(false)
  const [cardContentRevealed, setCardContentRevealed] = useState(true)
  // True during the short fade that precedes either flight. The ref is the
  // synchronous re-entry guard (keydown closures see stale state); the state
  // drives pointer-events so the card can't be flipped mid-pre-fade, which
  // would skew every rect the flight is about to measure.
  const preflightRef = useRef(false)
  const [preflight, setPreflight] = useState(false)
  const cardMainRef = useRef<HTMLDivElement>(null)
  const detailWrapRef = useRef<HTMLDivElement>(null)
  const panelElRef = useRef<HTMLElement | null>(null)
  const panelDonePromiseRef = useRef<Promise<unknown>>(Promise.resolve())

  const enterDetail = () => {
    if (phase !== 'card' || flipped || preflightRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('detail')
      setContentRevealed(true)
      return
    }
    // Mirror of the reverse trip's pre-fade: the card's non-shared chrome
    // (contacts, hints, location) has no clone standing in for it during the
    // flight, so fade it out first instead of blinking off with the card the
    // instant the morph starts.
    preflightRef.current = true
    setPreflight(true)
    setContentRevealed(false)
    // Flatten any hover tilt now, while the extras fade — the flight is
    // about to measure every shared rect, and a tilted card would skew all
    // of them (pointer-events are off, so nothing re-applies it).
    const tiltEl = cardMainRef.current?.querySelector<HTMLElement>('[data-card-tilt]')
    if (tiltEl) tiltEl.style.transform = ''
    const extraEls = cardMainRef.current?.querySelectorAll<HTMLElement>('[data-card-extra]')
    const fadeOut =
      extraEls && extraEls.length > 0
        ? animate(extraEls, {
            opacity: [1, 0],
            translateY: [0, 10],
            duration: 250,
            ease: 'inQuad',
          }).then()
        : Promise.resolve()
    fadeOut.then(() => {
      preflightRef.current = false
      setPreflight(false)
      setCardContentRevealed(false)
      setPhase('toDetail')
    })
  }

  // The reverse trip: fade the project content out first (mirrors stage 2
  // landing last on the way in), then hand off to the same box+text flight
  // machinery below, run backwards — panel shrinks back to the card's rect,
  // logo/name/title/tagline fly back to their card positions.
  const backToCard = () => {
    if (phase !== 'detail' || preflightRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setClones(null)
      setContentRevealed(false)
      setCardContentRevealed(true)
      setPhase('card')
      return
    }
    preflightRef.current = true
    setPreflight(true)
    setCardContentRevealed(false)
    const restEls = detailWrapRef.current?.querySelectorAll<HTMLElement>('[data-rest-content]')
    const fadeOut =
      restEls && restEls.length > 0
        ? animate(restEls, {
            opacity: [1, 0],
            translateY: [0, 10],
            duration: 300,
            ease: 'inQuad',
          }).then()
        : Promise.resolve()
    fadeOut.then(() => {
      preflightRef.current = false
      setPreflight(false)
      setContentRevealed(false)
      setPhase('toCard')
    })
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (phase !== 'card' || flipped) return
      if ((e.key === 'd' || e.key === 'D') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (document.activeElement as HTMLElement | null)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        enterDetail()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, flipped])

  // Box + text flight, run in either direction. Both the card and the
  // detail panel render hidden the instant we enter 'toDetail'/'toCard'
  // (same commit as the phase flip), so this fires before paint with both
  // still fully laid out — including the detail panel, which briefly sits
  // in normal static flow (correctly sized by its parent's max-width)
  // before we ever touch its position. We measure it there, THEN pull it
  // out to `fixed` and snap it to the source rect: the actual panel
  // growing/shrinking into place, not a stand-in clone. The header
  // text/logo can't ride along with that (their position within the card
  // and within the detail header aren't the same relative layout), so they
  // fly separately as overlay clones, landing alongside the box.
  useLayoutEffect(() => {
    if (phase !== 'toDetail' && phase !== 'toCard') return
    const cardEl = cardMainRef.current
    const detailEl = detailWrapRef.current
    if (!cardEl || !detailEl) return

    const forward = phase === 'toDetail'
    const { fromRects, toRects } = forward
      ? measureShared(cardEl, detailEl)
      : measureShared(detailEl, cardEl)

    const specs: CloneSpec[] = SHARED_KEYS.filter(
      (key) => fromRects.has(key) && toRects.has(key),
    ).map((key) => ({ key, from: fromRects.get(key)!, to: toRects.get(key)! }))
    setClones(specs)

    // The detail panel is always the element that morphs — it grows from
    // the card's rect on the way in, and shrinks back to it on the way
    // out. The card's own box just fades as a whole in both directions.
    const panelEl = detailEl.querySelector<HTMLElement>('[data-shared="panel"]')
    const panelFrom = fromRects.get('panel')
    const panelTo = toRects.get('panel')
    panelElRef.current = panelEl
    if (panelEl && panelFrom && panelTo) {
      panelEl.style.position = 'fixed'
      panelEl.style.left = `${panelFrom.left}px`
      panelEl.style.top = `${panelFrom.top}px`
      panelEl.style.width = `${panelFrom.width}px`
      panelEl.style.height = `${panelFrom.height}px`
      panelDonePromiseRef.current = animate(panelEl, {
        left: panelTo.left,
        top: panelTo.top,
        width: panelTo.width,
        height: panelTo.height,
        duration: SHARED_TRANSITION_DURATION,
        ease: 'outExpo',
      }).then()
    } else {
      panelDonePromiseRef.current = Promise.resolve()
    }
  }, [phase])

  // Box + text have landed on the way in: drop the card, swap the panel
  // back to normal flow, then fade/slide the project content in on its own.
  const handleForwardLanded = () => {
    setPhase('detail')
    setClones(null)

    const panelEl = panelElRef.current
    if (panelEl) {
      panelEl.style.position = ''
      panelEl.style.left = ''
      panelEl.style.top = ''
      panelEl.style.width = ''
      panelEl.style.height = ''
    }

    const restEls = detailWrapRef.current?.querySelectorAll<HTMLElement>('[data-rest-content]')
    if (restEls && restEls.length > 0) {
      animate(restEls, {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 380,
        delay: 60,
        ease: 'outQuad',
      }).then(() => setContentRevealed(true))
    } else {
      setContentRevealed(true)
    }
  }

  // Box + text have landed back on the card on the way out: reveal it (its
  // outer box already matches the panel exactly, so no seam there) and drop
  // the detail view — but the card's own non-shared chrome (contact icons,
  // flip hint, "press D" text) was never part of that flight and has no
  // clone standing in for it, so it fades in on its own rather than
  // popping in all at once the instant the card reappears.
  const handleReverseLanded = () => {
    setPhase('card')
    setClones(null)

    const extraEls = cardMainRef.current?.querySelectorAll<HTMLElement>('[data-card-extra]')
    if (extraEls && extraEls.length > 0) {
      animate(extraEls, {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 380,
        delay: 60,
        ease: 'outQuad',
      }).then(() => setCardContentRevealed(true))
    } else {
      setCardContentRevealed(true)
    }
  }

  const handleClonesComplete = () => {
    const forward = phase === 'toDetail'
    panelDonePromiseRef.current.then(forward ? handleForwardLanded : handleReverseLanded)
  }

  const cardVisible = phase === 'card'
  const cardMounted = phase !== 'detail'
  const detailMounted = phase !== 'card'
  const animating = phase === 'toDetail' || phase === 'toCard'
  const inputBlocked = animating || preflight

  return (
    <>
      {cardMounted && (
        <main
          ref={cardMainRef}
          style={{ opacity: cardVisible ? 1 : 0 }}
          className={`fixed inset-0 flex items-center justify-center overflow-hidden bg-black p-4 ${
            inputBlocked ? 'pointer-events-none' : ''
          }`}
        >
          <Card flipped={flipped} onFlippedChange={setFlipped} contentRevealed={cardContentRevealed} />
        </main>
      )}
      {detailMounted && (
        <div ref={detailWrapRef} className={inputBlocked ? 'pointer-events-none' : ''}>
          <DetailView onBack={backToCard} headerHidden={animating} contentRevealed={contentRevealed} />
        </div>
      )}
      {animating && clones && (
        <TransitionOverlay
          specs={clones}
          direction={phase === 'toDetail' ? 'toDetail' : 'toCard'}
          onComplete={handleClonesComplete}
        />
      )}
    </>
  )
}

export default App
