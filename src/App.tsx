import { useEffect, useState } from 'react'
import Card from './components/Card'
import DetailView from './components/DetailView'

function App() {
  const [view, setView] = useState<'card' | 'detail'>('card')
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (view !== 'card' || flipped) return
      if ((e.key === 'd' || e.key === 'D') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (document.activeElement as HTMLElement | null)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        setView('detail')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [view, flipped])

  if (view === 'detail') {
    return <DetailView onBack={() => setView('card')} />
  }

  return (
    <main className="flex h-svh w-full items-center justify-center overflow-hidden bg-black p-4">
      <Card flipped={flipped} onFlippedChange={setFlipped} />
    </main>
  )
}

export default App
