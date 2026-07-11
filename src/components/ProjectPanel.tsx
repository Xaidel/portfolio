import type { Project } from '../data/categories'

export default function ProjectPanel({
  project,
  index,
  total,
  onPrev,
  onNext,
}: {
  project: Project
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="flex w-full min-h-0 flex-col gap-[clamp(0.25rem,1.2vw,0.5rem)] overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <h3 className="truncate text-[clamp(0.6875rem,2.1vw,0.875rem)] font-semibold text-[#E5D0AC]">
          {project.name}
        </h3>
        {total > 1 && (
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              aria-label="Previous project"
              onClick={(e) => {
                e.stopPropagation()
                onPrev()
              }}
              className="rounded-sm px-1 text-neutral-500 outline-none transition-colors hover:text-[#F6CE71] focus-visible:ring-1 focus-visible:ring-[#F6CE71]"
            >
              ‹
            </button>
            <span className="text-[0.5625rem] text-neutral-600">
              {index + 1}/{total}
            </span>
            <button
              type="button"
              aria-label="Next project"
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
              className="rounded-sm px-1 text-neutral-500 outline-none transition-colors hover:text-[#F6CE71] focus-visible:ring-1 focus-visible:ring-[#F6CE71]"
            >
              ›
            </button>
          </div>
        )}
      </div>
      <dl className="flex flex-col gap-[clamp(0.1875rem,0.8vw,0.375rem)] text-[clamp(0.5rem,1.35vw,0.6875rem)] leading-snug">
        <div className="line-clamp-1">
          <dt className="inline font-medium text-[#F6CE71]">Problem — </dt>
          <dd className="inline text-neutral-300">{project.problem}</dd>
        </div>
        <div className="line-clamp-1">
          <dt className="inline font-medium text-[#F6CE71]">Decision — </dt>
          <dd className="inline text-neutral-300">{project.decision}</dd>
        </div>
        <div className="line-clamp-1">
          <dt className="inline font-medium text-[#F6CE71]">Outcome — </dt>
          <dd className="inline text-neutral-300">{project.outcome}</dd>
        </div>
      </dl>
    </div>
  )
}
