import { useState } from 'react'
import { categories, type CategoryId } from '../data/categories'
import NotchCard from './NotchCard'

export default function FeaturedProjects({
  onOpen,
}: {
  onOpen: (name: string, el: HTMLElement) => void
}) {
  const [categoryId, setCategoryId] = useState<CategoryId>(categories[0].id)
  const category = categories.find((c) => c.id === categoryId) ?? categories[0]

  return (
    <div>
      <div role="group" aria-label="Project categories" className="mb-5 flex flex-wrap gap-2">
        {categories.map((c) => {
          const active = c.id === categoryId
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => setCategoryId(c.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[#F6CE71] ${
                active
                  ? 'border-[#F6CE71]/60 bg-[#F6CE71]/10 text-[#F6CE71]'
                  : 'border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300'
              }`}
            >
              {c.label}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-4">
        {category.projects.map((proj) => (
          <NotchCard
            key={proj.name}
            className="rounded-2xl border border-neutral-800 bg-neutral-900 p-[clamp(0.875rem,3vw,1.25rem)] pb-[clamp(4.5rem,9vw,5rem)]"
            notch={{ buttonWidth: 128, buttonHeight: 42 }}
            action={
              <button
                type="button"
                data-details-btn={proj.name}
                onClick={(e) => onOpen(proj.name, e.currentTarget)}
                className="flex h-full w-full items-center justify-center rounded-full border border-[#F6CE71]/50 bg-neutral-900 text-sm font-medium whitespace-nowrap text-[#F6CE71] transition-colors hover:border-[#F6CE71] hover:bg-neutral-800"
              >
                Details -&gt;
              </button>
            }
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-base font-semibold text-neutral-300">{proj.name}</p>
              <p className="text-right text-xs text-[#F6CE71]">{proj.skills.join(' · ')}</p>
            </div>
            <dl className="grid gap-1.5 text-sm leading-relaxed text-neutral-500">
              <div>
                <dt className="inline font-medium text-[#F6CE71]">Problem — </dt>
                <dd className="inline">{proj.problem}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-[#F6CE71]">Decision — </dt>
                <dd className="inline">{proj.decision}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-[#F6CE71]">Outcome — </dt>
                <dd className="inline">{proj.outcome}</dd>
              </div>
            </dl>
          </NotchCard>
        ))}
      </div>
    </div>
  )
}
