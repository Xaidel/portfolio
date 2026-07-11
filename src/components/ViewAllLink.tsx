export default function ViewAllLink({ className = '' }: { className?: string }) {
  return (
    <a
      href="https://github.com/Xaidel"
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      title="View all projects"
      className={`rounded-sm text-[clamp(0.5625rem,1.6vw,0.6875rem)] text-neutral-500 underline-offset-2 outline-none transition-colors hover:text-neutral-300 hover:underline focus-visible:text-neutral-300 focus-visible:underline ${className}`}
    >
      View all
    </a>
  )
}
