import { useRef, useState } from 'react'
import type { CaseStudy as CaseStudyData } from '../data/caseStudies'

export default function CaseStudy({
  study,
  onBack,
}: {
  study: CaseStudyData
  onBack: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const [activeId, setActiveId] = useState(study.sections[0]?.id ?? '')

  const updateActive = () => {
    const container = containerRef.current
    if (!container) return
    const headerLine = 140
    let current = study.sections[0]?.id ?? ''
    for (const s of study.sections) {
      const el = sectionRefs.current[s.id]
      if (el && el.getBoundingClientRect().top <= headerLine) current = s.id
    }
    const last = study.sections[study.sections.length - 1]
    const atBottom =
      container.scrollTop + container.clientHeight >= container.scrollHeight - 4
    if (atBottom && last) current = last.id
    setActiveId(current)
  }

  const goTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      ref={containerRef}
      onScroll={updateActive}
      className="fixed inset-0 z-[600] overflow-y-auto bg-neutral-950 text-neutral-300"
    >
      <div
        data-circle-reveal
        className="mx-auto max-w-[1080px] px-[clamp(1rem,4vw,2rem)] py-[clamp(1.5rem,5vw,3rem)]"
      >
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-800 px-4 py-2 text-sm text-neutral-500 outline-none transition-colors hover:border-[#F6CE71]/60 hover:text-[#E5D0AC] focus-visible:ring-1 focus-visible:ring-[#F6CE71]"
        >
          ← Back to projects
        </button>

        <div className="flex flex-col gap-10 lg:flex-row">
          <aside className="order-1 lg:order-2 lg:w-60 lg:shrink-0">
            <div className="sticky top-0 z-10 bg-neutral-950 py-3 lg:top-8 lg:bg-transparent lg:py-0">
              <p className="mb-3 hidden text-xs uppercase tracking-[0.15em] text-neutral-600 lg:block">
                Case study
              </p>
              <nav
                aria-label="Case study sections"
                className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
              >
                {study.sections.map((s, i) => {
                  const active = s.id === activeId
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => goTo(s.id)}
                      className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[#F6CE71] lg:rounded-none lg:border-0 lg:border-l-2 lg:px-0 lg:py-2 lg:pl-4 ${
                        active
                          ? 'border-[#F6CE71]/60 bg-[#F6CE71]/10 text-[#F6CE71] lg:border-[#F6CE71] lg:bg-transparent'
                          : 'border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300 lg:border-neutral-800 lg:hover:border-neutral-700'
                      }`}
                    >
                      <span
                        className={`mr-1.5 text-xs ${active ? 'text-[#F6CE71]' : 'text-neutral-600'}`}
                      >
                        {i + 1}
                      </span>
                      {s.heading}
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          <div className="order-2 min-w-0 flex-1 lg:order-1">
            <h1 className="mb-10 font-mono text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-wide text-[#E5D0AC]">
              {study.name}
            </h1>

            <div className="flex flex-col gap-12">
              {study.sections.map((s) => (
                <article
                  key={s.id}
                  ref={(el) => {
                    sectionRefs.current[s.id] = el
                  }}
                  className="scroll-mt-28"
                >
                  <h2 className="mb-3 font-mono text-lg font-bold uppercase tracking-[0.08em] text-[#E5D0AC]">
                    {s.heading}
                  </h2>
                  {s.paragraphs && (
                    <div className="flex flex-col gap-3 text-sm leading-relaxed text-neutral-400">
                      {s.paragraphs.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  )}
                  {s.bullets && (
                    <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-neutral-400 marker:text-[#F6CE71]">
                      {s.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {s.images && (
                    <div className="mt-5 flex flex-col gap-8">
                      {s.images.map((img) => (
                        <figure key={img.src}>
                          <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
                            <img
                              src={img.src}
                              alt={img.alt}
                              loading="lazy"
                              className="block w-full"
                            />
                          </div>
                          <figcaption className="mt-3">
                            <p className="text-sm font-medium text-[#E5D0AC]">{img.caption}</p>
                            <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                              {img.detail}
                            </p>
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
