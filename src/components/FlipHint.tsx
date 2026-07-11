export default function FlipHint({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-1 text-[clamp(0.5625rem,1.6vw,0.6875rem)] text-neutral-500 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
      </svg>
      <span>Flip</span>
    </div>
  )
}
