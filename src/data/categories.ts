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
        name: 'IronOS — Gym Management System + Companion App',
        problem:
          'Gyms track members and progress on paper or spreadsheets; members have no visibility into their own history or reason to stay engaged.',
        decision:
          'Built a gym management system paired with a gamified mobile app — Go backend over a REST API, React/TypeScript frontend — members log workouts and diet, keep progress records, and share achievements socially.',
        outcome:
          'One system now runs both the gym’s member management and a live member-facing app with social workout sharing.',
        skills: ['Go', 'REST', 'React', 'TypeScript'],
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
    skills: ['eino', 'RAG', 'Vector search', 'Pinecone', 'Qdrant', 'Apache Parquet'],
    projects: [
      {
        name: 'AI systems — in progress',
        problem: 'No dedicated AI product shipped yet.',
        decision:
          'Building RAG pipelines and agents with the eino framework, backed by Pinecone and Qdrant for vector search.',
        outcome: 'Stack is in place; a full case study is coming soon.',
        skills: ['eino', 'RAG', 'Vector search', 'Pinecone', 'Qdrant', 'Apache Parquet'],
      },
    ],
  },
]
