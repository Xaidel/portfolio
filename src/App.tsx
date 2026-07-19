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

type Phase = 'card' | 'transitioning' | 'detail'

function App() {
  const [phase, setPhase] = useState<Phase>('card')
  const [flipped, setFlipped] = useState(false)
  const [clones, setClones] = useState<CloneSpec[] | null>(null)
  const [contentRevealed, setContentRevealed] = useState(false)
  const cardMainRef = useRef<HTMLDivElement>(null)
  const detailWrapRef = useRef<HTMLDivElement>(null)
  const panelElRef = useRef<HTMLElement | null>(null)
  const panelDonePromiseRef = useRef<Promise<unknown>>(Promise.resolve())

  const enterDetail = () => {
    if (phase !== 'card' || flipped) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('detail')
      setContentRevealed(true)
      return
    }
    setContentRevealed(false)
    setPhase('transitioning')
  }

  const backToCard = () => {
    setClones(null)
    setContentRevealed(false)
    setPhase('card')
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

  // Stage 1: the card renders hidden (opacity 0, same commit as the phase
  // flip) the instant we enter 'transitioning', and the detail panel
  // renders `fixed` with no explicit offsets yet — which per the CSS spec
  // keeps it at its natural ("static") position, i.e. exactly where the
  // finished detail page would put it. So measuring it here, before paint,
  // gives the real target box. We then snap it back to the card's rect and
  // animate real left/top/width/height back to that target: the actual
  // card object growing into the actual panel, not a stand-in clone.
  // The header text/logo can't ride along with that (their position within
  // the card and within the detail header aren't the same relative
  // layout), so they fly separately as overlay clones, landing alongside
  // the box. Stage 2 (contact row, categories) only starts once both of
  // those finish — see handleStage1Complete.
  useLayoutEffect(() => {
    if (phase !== 'transitioning') return
    const cardEl = cardMainRef.current
    const detailEl = detailWrapRef.current
    if (!cardEl || !detailEl) return

    const fromRects = new Map<string, DOMRect>()
    cardEl.querySelectorAll<HTMLElement>('[data-shared]').forEach((el) => {
      const rect = el.getBoundingClientRect()
      // Name/title are hidden on narrow card layouts (`hidden sm:block`) and
      // collapse to a zero-size rect there — skip animating those.
      if (rect.width > 0 && rect.height > 0) {
        fromRects.set(el.dataset.shared as string, rect)
      }
    })

    const toRects = new Map<string, DOMRect>()
    detailEl.querySelectorAll<HTMLElement>('[data-shared]').forEach((el) => {
      toRects.set(el.dataset.shared as string, el.getBoundingClientRect())
    })

    const specs: CloneSpec[] = SHARED_KEYS.filter(
      (key) => fromRects.has(key) && toRects.has(key),
    ).map((key) => ({ key, from: fromRects.get(key)!, to: toRects.get(key)! }))
    setClones(specs)

    const panelEl = detailEl.querySelector<HTMLElement>('[data-shared="panel"]')
    const panelFrom = fromRects.get('panel')
    const panelTo = toRects.get('panel')
    panelElRef.current = panelEl
    if (panelEl && panelFrom && panelTo) {
      // panelTo was measured just above while the panel was still in normal
      // static flow (correctly constrained by its parent's max-width) —
      // only now do we pull it out of flow and snap it to the card's rect,
      // so the fixed-position box never has a chance to size itself wrong.
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

  // Stage 2: box + header text have landed — drop the card, swap the panel
  // back to normal flow, then fade/slide the project content in on its own.
  const handleStage1Complete = () => {
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

  const handleClonesComplete = () => {
    panelDonePromiseRef.current.then(handleStage1Complete)
  }

  return (
    <>
      {(phase === 'card' || phase === 'transitioning') && (
        <main
          ref={cardMainRef}
          style={{ opacity: phase === 'transitioning' ? 0 : 1 }}
          className={`fixed inset-0 flex items-center justify-center overflow-hidden bg-black p-4 ${
            phase === 'transitioning' ? 'pointer-events-none' : ''
          }`}
        >
          <Card flipped={flipped} onFlippedChange={setFlipped} />
        </main>
      )}
      {(phase === 'transitioning' || phase === 'detail') && (
        <div ref={detailWrapRef} className={phase === 'transitioning' ? 'pointer-events-none' : ''}>
          <DetailView
            onBack={backToCard}
            headerHidden={phase === 'transitioning'}
            contentRevealed={contentRevealed}
          />
        </div>
      )}
      {phase === 'transitioning' && clones && (
        <TransitionOverlay specs={clones} onComplete={handleClonesComplete} />
      )}
    </>
  )
}

export default App
