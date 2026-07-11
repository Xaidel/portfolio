import { EmailIcon } from './icons'

export default function ContactCTA() {
  return (
    <a
      href="mailto:abechuelak@gmail.com?subject=Engineering%20role"
      onClick={(e) => e.stopPropagation()}
      className="flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-[#F6CE71]/40 bg-[#F6CE71]/10 px-3 py-[clamp(0.1875rem,1vw,0.4375rem)] text-[clamp(0.5rem,1.5vw,0.75rem)] font-medium text-[#F6CE71] outline-none transition-colors hover:bg-[#F6CE71]/20 focus-visible:ring-1 focus-visible:ring-[#F6CE71]"
    >
      <EmailIcon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">Hiring for an engineering role? Let&apos;s talk</span>
    </a>
  )
}
