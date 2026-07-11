import type { CategoryDef, CategoryId } from '../data/categories'

export default function CategoryTags({
  categories,
  activeId,
  onSelect,
}: {
  categories: CategoryDef[]
  activeId: CategoryId
  onSelect: (id: CategoryId) => void
}) {
  return (
    <div role="group" aria-label="Project categories" className="flex w-full gap-1.5">
      {categories.map((c) => {
        const active = c.id === activeId
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={active}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(c.id)
            }}
            className="-m-2.5 flex-1 truncate rounded-full p-2.5 outline-none focus-visible:ring-1 focus-visible:ring-[#F6CE71]"
          >
            <span
              className={`block truncate rounded-full border px-[clamp(0.375rem,1.5vw,0.625rem)] py-[clamp(0.25rem,1vw,0.4375rem)] text-[clamp(0.5rem,1.4vw,0.6875rem)] font-medium tracking-tight transition-colors ${
                active
                  ? 'border-[#F6CE71]/60 bg-[#F6CE71]/10 text-[#F6CE71]'
                  : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {c.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
