export type CategoryId = 'software-engineering' | 'automation' | 'ai'

export interface Project {
  name: string
  problem: string
  decision: string
  outcome: string
  skills: string[]
}

export interface CategoryDef {
  id: CategoryId
  label: string
  skills: string[]
  projects: Project[]
}

export const categories: CategoryDef[] = [
  {
    id: 'software-engineering',
    label: 'Software Engineering',
    skills: ['Go', 'REST', 'React', 'TypeScript'],
    projects: [
      {
        name: 'Pharmassist — Medicine Price & Availability Map',
        problem:
          'Patients in Naga City pay out of pocket for medicines and have no way to know, before traveling, which nearby pharmacy has a drug in stock or at the lowest total price.',
        decision:
          'Built a mobile-first PWA — TanStack Start, React 19, and TypeScript over a Postgres backend, shipped with Docker and Caddy — that ranks pharmacies by the total shelf price of a complete medicine list on a map-first results screen, with typo-tolerant search, MDRP price-ceiling checks, prescription OCR, and pharmacy directions.',
        outcome:
          'A seeded-data pilot validates the full search-to-directions loop across 50 medicines and 10 Naga pharmacies, with MDRP compliance and privacy controls built in from day one.',
        skills: ['TanStack Start', 'React', 'TypeScript', 'PostgreSQL'],
      },
    ],
  },
  {
    id: 'automation',
    label: 'Automation',
    skills: ['n8n', 'Scripting', 'Scheduling', 'Slack API'],
    projects: [
      {
        name: 'Order Status Reconciliation',
        problem:
          'Support manually checked order status for every "where’s my order" request — slow, repetitive, and error-prone.',
        decision:
          'Automated the lookup with n8n workflows that pull live order status from the source system and post directly to Slack.',
        outcome:
          'Order-status checks resolve automatically instead of manual digging, freeing up support time.',
        skills: ['n8n', 'Scripting', 'Scheduling', 'Slack API'],
      },
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    skills: ['TanStack Start', 'React', 'TypeScript', 'Docker', 'PostgreSQL'],
    projects: [
      {
        name: 'Teach — AI Learning Platform',
        problem:
          'Learners paste AI-generated code they don’t fully understand, but passive reading doesn’t build the skills — they need active, evaluated practice.',
        decision:
          'Built a platform that turns AI-generated code into active practice — an AI Teacher explains concepts and generates exercises, while a real sandboxed compiler (Rust, Go, Python in isolated Docker containers) and a deterministic evaluation gate grade each submission.',
        outcome:
          'The multi-language sandbox is live: submissions are evaluated by each language’s real test toolchain — cargo nextest, go test, pytest — with enforced resource limits, and pass/fail results persisted in Postgres.',
        skills: ['TanStack Start', 'React', 'TypeScript', 'Docker', 'PostgreSQL'],
      },
    ],
  },
]
