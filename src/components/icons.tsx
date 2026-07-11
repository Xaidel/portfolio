type IconProps = { className?: string }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function LogoMark({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg {...base} viewBox="0 0.5 24 24" className={className}>
      <circle cx="6" cy="7" r="2.25" />
      <circle cx="18" cy="7" r="2.25" />
      <circle cx="12" cy="18" r="2.25" />
      <path d="M7.9 8.4 10.5 16" />
      <path d="M16.1 8.4 13.5 16" />
      <path d="M8.2 7h7.6" />
    </svg>
  )
}

export function PhoneIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6.6 3.5 4 6c-.5 3 3 9 6 12 3 1.5 8 3.5 9-1l-2.9-2.9a1 1 0 0 0-1.1-.2l-2 1a12 12 0 0 1-5-5l1-2a1 1 0 0 0-.2-1.1L6.6 3.5Z" />
    </svg>
  )
}

export function MobileIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  )
}

export function EmailIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

export function WebsiteIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9Z" />
    </svg>
  )
}

export function LinkedInIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8" cy="8" r="1.1" fill="currentColor" stroke="none" />
      <line x1="8" y1="11" x2="8" y2="17" />
      <path d="M12 17v-4a2.5 2.5 0 0 1 5 0v4" />
    </svg>
  )
}

export function GitHubIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 19c-4.5 1.5-4.5-2-6-2.5m12 4.5v-3c0-1 .3-1.7-.5-2.5 2.7-.3 5.5-1.3 5.5-6a4.6 4.6 0 0 0-1.2-3.2 4.3 4.3 0 0 0-.1-3.3s-1-.3-3.3 1.3a11.5 11.5 0 0 0-6 0C7.3 2.2 6.3 2.5 6.3 2.5a4.3 4.3 0 0 0-.1 3.3A4.6 4.6 0 0 0 5 8.8c0 4.7 2.8 5.7 5.5 6-.5.5-.5 1.1-.5 2v3.7" />
    </svg>
  )
}
