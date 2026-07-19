import CardHeader from './CardHeader'
import CardFooter from './CardFooter'
import CardSheen from './CardSheen'
import FlipHint from './FlipHint'

export default function CardFront() {
  return (
    <div
      data-shared="panel"
      className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 p-[clamp(0.75rem,4vw,1.75rem)] shadow-2xl shadow-black/40"
    >
      <CardHeader />
      <div aria-hidden="true" className="flex-1" />
      <CardFooter />
      <FlipHint className="absolute top-[clamp(0.75rem,3vw,1.25rem)] left-[clamp(0.75rem,3vw,1.25rem)]" />
      <p className="absolute right-[clamp(0.75rem,4vw,1.75rem)] bottom-[clamp(0.75rem,4vw,1.75rem)] text-[clamp(0.5625rem,1.6vw,0.6875rem)] text-neutral-500">
        Press &apos;D&apos; for detailed mode
      </p>
      <CardSheen />
    </div>
  )
}
