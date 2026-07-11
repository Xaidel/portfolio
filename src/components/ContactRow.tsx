import type { ReactNode } from 'react'

export default function ContactRow({
  icon,
  text,
  href,
}: {
  icon: ReactNode
  text: string
  href?: string
}) {
  const content = (
    <>
      <span className="shrink-0 text-[#F6CE71]">{icon}</span>
      <span className="truncate text-[clamp(0.5625rem,1.6vw,0.75rem)] text-[#E5D0AC]">
        {text}
      </span>
    </>
  )

  if (!href) {
    return <div className="flex min-w-0 items-center gap-2">{content}</div>
  }

  const isExternal = !href.startsWith('mailto:')

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={(e) => e.stopPropagation()}
      className="flex min-w-0 items-center gap-2 rounded-sm outline-none transition-opacity hover:opacity-80 focus-visible:ring-1 focus-visible:ring-[#F6CE71]"
    >
      {content}
    </a>
  )
}
