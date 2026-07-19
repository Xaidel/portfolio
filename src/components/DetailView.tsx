import { useState } from 'react'
import { createPortal } from 'react-dom'
import { about, expertise, principles } from '../data/profile'
import { useCircleTransition } from './CircleTransition'
import DetailSection from './DetailSection'
import FeaturedProjects from './FeaturedProjects'
import { EmailIcon, GitHubIcon, LinkedInIcon, LogoMark, MobileIcon, PinIcon } from './icons'
import ProjectDetail from './ProjectDetail'
import { skillIcons } from './skillIcons'
import Timeline from './Timeline'

export default function DetailView({
  onBack,
  headerHidden = false,
  contentRevealed = true,
}: {
  onBack: () => void
  headerHidden?: boolean
  contentRevealed?: boolean
}) {
  const [openProject, setOpenProject] = useState<string | null>(null)
  const { openFrom, closeTo } = useCircleTransition()

  const closeProject = () => {
    const name = openProject
    if (!name) return
    void closeTo(
      () => document.querySelector(`[data-details-btn="${CSS.escape(name)}"]`),
      () => setOpenProject(null),
    )
  }

  const headerStyle = headerHidden ? { opacity: 0 } : undefined
  // The header row has its own bg-neutral-900 stripe and border — the card
  // has no such stripe, so it has to disappear along with the text or it
  // sits there as a visible seam through the whole box-morph animation.
  const headerRowStyle = headerHidden
    ? { backgroundColor: 'transparent', borderColor: 'transparent' }
    : undefined
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
          <div
            style={headerRowStyle}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-900 px-[clamp(1rem,4vw,1.75rem)] py-[clamp(1.25rem,4vw,2rem)] transition-colors duration-300"
          >
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

          <div
            data-rest-content
            style={restStyle}
            className="flex flex-wrap items-center gap-x-6 gap-y-2.5 border-b border-neutral-800 px-[clamp(1rem,4vw,1.75rem)] py-4 text-sm"
          >
            <a
              href="mailto:abechuelak@gmail.com"
              className="inline-flex items-center gap-2 rounded-sm text-[#E5D0AC] outline-none transition-colors hover:text-[#F6CE71] focus-visible:ring-1 focus-visible:ring-[#F6CE71]"
            >
              <EmailIcon className="h-3.5 w-3.5 shrink-0 text-[#F6CE71]" />
              abechuelak@gmail.com
            </a>
            <span className="inline-flex items-center gap-2 text-neutral-400">
              <MobileIcon className="h-3.5 w-3.5 shrink-0 text-[#F6CE71]/60" />
              09632530577
            </span>
            <a
              href="https://github.com/Xaidel"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-sm text-neutral-400 outline-none transition-colors hover:text-[#E5D0AC] focus-visible:ring-1 focus-visible:ring-[#F6CE71]"
            >
              <GitHubIcon className="h-3.5 w-3.5 shrink-0 text-[#F6CE71]/60 transition-colors group-hover:text-[#F6CE71]" />
              github.com/Xaidel
            </a>
            <a
              href="https://www.linkedin.com/in/karlabechuela"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-sm text-neutral-400 outline-none transition-colors hover:text-[#E5D0AC] focus-visible:ring-1 focus-visible:ring-[#F6CE71]"
            >
              <LinkedInIcon className="h-3.5 w-3.5 shrink-0 text-[#F6CE71]/60 transition-colors group-hover:text-[#F6CE71]" />
              linkedin.com/in/karlabechuela
            </a>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.08em] text-neutral-600 sm:ml-auto">
              <PinIcon className="h-3 w-3 shrink-0" />
              Naga City, Philippines
            </span>
          </div>

          <div data-rest-content style={restStyle}>
            <DetailSection title="About">
              <div className="flex max-w-prose flex-col gap-3 text-sm leading-relaxed text-neutral-400">
                {about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </DetailSection>

            <DetailSection title="Featured Projects">
              <FeaturedProjects
                onOpen={(name, el) => void openFrom(el, () => setOpenProject(name))}
              />
            </DetailSection>

            <DetailSection title="Engineering Principles">
              <ul className="grid gap-2.5 text-sm text-neutral-400 sm:grid-cols-2">
                {principles.map((p) => (
                  <li key={p} className="flex items-baseline gap-2.5">
                    <span aria-hidden className="text-xs text-[#F6CE71]">
                      ▪
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection title="Technical Expertise">
              <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                {expertise.map((group) => (
                  <div key={group.label}>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#F6CE71]">
                      {group.label}
                    </h3>
                    <ul className="flex flex-wrap gap-1.5">
                      {group.skills.map((skill) => {
                        const Icon = skillIcons[skill]
                        return (
                          <li
                            key={skill}
                            className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-400"
                          >
                            {Icon && (
                              <Icon aria-hidden className="h-3 w-3 shrink-0 text-[#F6CE71]/60" />
                            )}
                            {skill}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </DetailSection>

            <DetailSection title="Timeline">
              <Timeline />
            </DetailSection>
          </div>
        </div>
      </div>
      {/* Portaled to body: ancestors here carry transforms during reveal
          animations, which would re-anchor a fixed overlay to themselves. */}
      {openProject != null &&
        createPortal(<ProjectDetail project={openProject} onBack={closeProject} />, document.body)}
    </div>
  )
}
