import type { ReactNode } from 'react'

export default function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-neutral-800 px-[clamp(1rem,4vw,1.75rem)] py-[clamp(1.25rem,4vw,1.75rem)] last:border-b-0">
      <h2 className="mb-4 font-mono text-lg font-bold uppercase tracking-[0.08em] text-[#E5D0AC]">
        {title}
      </h2>
      {children}
    </section>
  )
}
