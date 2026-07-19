import { categories } from '../data/categories'
import { LogoMark } from './icons'

export default function DetailView({
  onBack,
  headerHidden = false,
  contentRevealed = true,
}: {
  onBack: () => void
  headerHidden?: boolean
  contentRevealed?: boolean
}) {
  const headerStyle = headerHidden ? { opacity: 0 } : undefined
  const restStyle = {
    opacity: contentRevealed ? 1 : 0,
    transform: contentRevealed ? 'translateY(0)' : 'translateY(10px)',
  }

  return (
    <div className="min-h-svh w-full overflow-y-auto bg-black px-[clamp(1rem,4vw,2rem)] pt-[clamp(1.5rem,5vw,3rem)] pb-16 text-neutral-300">
      <div data-detail-content className="mx-auto max-w-[920px]">
        <button
          type="button"
          data-rest-content
          onClick={onBack}
          style={restStyle}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-800 px-4 py-2 text-sm text-neutral-500 outline-none transition-colors hover:text-[#E5D0AC] hover:border-[#F6CE71]/60 focus-visible:ring-1 focus-visible:ring-[#F6CE71]"
        >
          ← Back to card
        </button>

        <div
          data-shared="panel"
          className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl shadow-black/40"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-900 px-[clamp(1rem,4vw,1.75rem)] py-[clamp(1.25rem,4vw,2rem)]">
            <div className="flex items-center gap-3">
              <LogoMark
                data-shared="logo"
                style={headerStyle}
                className="h-[clamp(1.75rem,4vw,2.5rem)] w-[clamp(1.75rem,4vw,2.5rem)] shrink-0 text-[#F6CE71]"
              />
              <div>
                <p
                  data-shared="name"
                  style={headerStyle}
                  className="font-mono text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-wide text-[#E5D0AC]"
                >
                  Karl Abechuela
                </p>
                <p
                  data-shared="title"
                  style={headerStyle}
                  className="mt-1 text-[clamp(0.875rem,2vw,1rem)] text-neutral-500"
                >
                  Software Engineer, AI &amp; Automation
                </p>
              </div>
            </div>
            <p
              data-shared="tagline"
              style={headerStyle}
              className="whitespace-nowrap text-sm uppercase tracking-[0.1em] text-[#F6CE71]"
            >
              Ship first, panic never.
            </p>
          </div>

          <div data-rest-content style={restStyle} className="flex flex-wrap gap-4 border-b border-neutral-800 px-[clamp(1rem,4vw,1.75rem)] py-4 text-sm text-neutral-500">
            <a href="mailto:abechuelak@gmail.com" className="hover:text-neutral-300">
              abechuelak@gmail.com
            </a>
            <span>09632530577</span>
            <a
              href="https://github.com/Xaidel"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300"
            >
              github.com/Xaidel
            </a>
            <a
              href="https://www.linkedin.com/in/karlabechuela"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300"
            >
              linkedin.com/in/karlabechuela
            </a>
            <span>Naga City, Philippines</span>
          </div>

          <div data-rest-content style={restStyle}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="border-b border-neutral-800 px-[clamp(1rem,4vw,1.75rem)] py-[clamp(1.25rem,4vw,1.75rem)] last:border-b-0"
              >
                <h2 className="mb-4 font-mono text-lg font-bold uppercase tracking-[0.08em] text-[#E5D0AC]">
                  {cat.label}
                </h2>

                <div className="flex flex-col gap-4">
                  {cat.projects.map((proj) => (
                    <div
                      key={proj.name}
                      className="rounded-2xl border border-neutral-800 bg-neutral-900 p-[clamp(0.875rem,3vw,1.25rem)]"
                    >
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-base font-semibold text-neutral-300">{proj.name}</p>
                        <p className="text-right text-xs text-[#F6CE71]">
                          {proj.skills.join(' · ')}
                        </p>
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
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
