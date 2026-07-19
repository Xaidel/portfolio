import { timeline } from '../data/profile'

export default function Timeline() {
  return (
    <ol className="flex flex-col">
      {timeline.map((entry, i) => {
        const last = i === timeline.length - 1
        return (
          <li key={`${entry.period}-${entry.title}`} className="flex gap-4">
            <div className="flex w-3 shrink-0 flex-col items-center">
              <span
                aria-hidden
                className={`mt-1 h-3 w-3 shrink-0 rounded-full border-2 ${
                  entry.current
                    ? 'border-[#F6CE71] bg-[#F6CE71]/20 shadow-[0_0_8px_rgba(246,206,113,0.45)]'
                    : 'border-neutral-700 bg-neutral-950'
                }`}
              />
              {!last && <span aria-hidden className="mt-1 w-px flex-1 bg-neutral-800" />}
            </div>
            <div className={last ? '' : 'pb-5'}>
              <p className="font-mono text-xs tracking-wide text-neutral-600">{entry.period}</p>
              <p className="mt-0.5 text-sm font-semibold text-neutral-300">{entry.title}</p>
              <p className="text-sm text-neutral-500">{entry.org}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
