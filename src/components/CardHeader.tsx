import { LogoMark } from './icons'

export default function CardHeader() {
  return (
    <div className="flex items-center justify-end gap-2.5">
      <LogoMark
        data-shared="logo"
        className="h-[clamp(1.75rem,6.5vw,3rem)] w-[clamp(1.75rem,6.5vw,3rem)] shrink-0 text-[#F6CE71]"
      />
      <div className="flex flex-col items-start">
        <p
          data-shared="tagline"
          className="text-left text-[clamp(0.5rem,1.3vw,0.6875rem)] font-medium uppercase tracking-[0.1em] text-[#E5D0AC]"
        >
          Ship first, panic never.
        </p>
      </div>
    </div>
  )
}
