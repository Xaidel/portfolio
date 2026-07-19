export const about = [
  'I build backend systems, internal tooling, and AI-powered automation.',
  'I enjoy designing maintainable architectures, reducing operational work through automation, and solving problems with simple, scalable systems.',
]

export const principles = [
  'Simplicity over cleverness',
  'Strong typing wherever possible',
  'Architecture before implementation',
  'Automate repetitive work',
  'Ship small, iterate fast',
  'Documentation is part of development',
]

export interface ExpertiseGroup {
  label: string
  skills: string[]
}

export const expertise: ExpertiseGroup[] = [
  { label: 'Backend', skills: ['Go', 'Java', 'PHP', 'REST APIs', 'gRPC', 'GraphQL', 'TypeScript'] },
  {
    label: 'Frontend',
    skills: [
      'React',
      'TypeScript',
      'TanStack Query',
      'TanStack Table',
      'Tailwind CSS',
      'styled-components',
      'Vite',
    ],
  },
  { label: 'Web Frameworks', skills: ['Next.js', 'TanStack Start', 'Laravel', 'Gin'] },
  {
    label: 'Databases',
    skills: ['PostgreSQL', 'MongoDB', 'Redis', 'AWS S3', 'Pinecone', 'Qdrant'],
  },
  { label: 'Infrastructure', skills: ['Docker', 'Docker Compose', 'Linux', 'CI/CD'] },
  { label: 'AI', skills: ['eino', 'RAG', 'Vector search'] },
  { label: 'Automation', skills: ['n8n', 'Scripting', 'Scheduling', 'Slack API'] },
]

export interface TimelineEntry {
  period: string
  title: string
  org: string
  current?: boolean
}

// Newest first, like git log.
export const timeline: TimelineEntry[] = [
  { period: 'Feb 2026 — now', title: 'Software Engineer', org: 'gyud.ai', current: true },
  { period: 'Sep 2025 — Feb 2026', title: 'Backend Developer', org: 'Outrank Strategy' },
  {
    period: 'Jul 2025',
    title: 'Graduated — BS Information Technology',
    org: 'University of Nueva Caceres',
  },
  {
    period: 'May 2024 — Jun 2025',
    title: 'Full Stack Developer',
    org: 'University of Nueva Caceres',
  },
  {
    period: '2021',
    title: 'Started BS Information Technology',
    org: 'University of Nueva Caceres',
  },
]
