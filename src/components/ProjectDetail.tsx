export default function ProjectDetail({
  project,
  onBack,
}: {
  project: string
  onBack: () => void
}) {
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center overflow-y-auto bg-neutral-950 px-6 text-neutral-300">
      <div data-circle-reveal className="flex max-w-md flex-col items-center gap-6 text-center">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#F6CE71]">{project}</p>
        <p className="text-[clamp(1.125rem,3vw,1.5rem)] leading-relaxed">
          This project is still on documenting phase. Come back soon.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-800 px-5 py-2.5 text-sm text-neutral-500 outline-none transition-colors hover:border-[#F6CE71]/60 hover:text-[#E5D0AC] focus-visible:ring-1 focus-visible:ring-[#F6CE71]"
        >
          ← Back to projects
        </button>
      </div>
    </div>
  )
}
