export type CategoryId = 'software-engineering' | 'automation' | 'ai'

export interface Project {
  name: string
  problem: string
  decision: string
  outcome: string
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
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'System design'],
    projects: [
      {
        name: 'Placeholder project — Software Engineering',
        problem: 'Placeholder: the concrete problem this project solved.',
        decision: 'Placeholder: the engineering decision that mattered.',
        outcome: 'Placeholder: the measurable outcome.',
      },
    ],
  },
  {
    id: 'automation',
    label: 'Automation',
    skills: ['Scripting', 'n8n', 'Scheduling'],
    projects: [
      {
        name: 'Order Status Reconciliation (Shopify + 3PLs)',
        problem: 'Manual "where\'s my order" checks: 6-8hr replies, 12% status mismatches.',
        decision: 'n8n webhooks, per-3PL adapters, dedup, Slack alerts on mismatch.',
        outcome: 'Replies <10min, mismatches ~2%, WISMO hours 15/wk → 3/wk.',
      },
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    skills: ['LLM integration', 'RAG', 'Prompt engineering', 'Agents', 'Vector search'],
    projects: [
      {
        name: 'Placeholder project — AI',
        problem: 'Placeholder: the concrete problem this project solved.',
        decision: 'Placeholder: the engineering decision that mattered.',
        outcome: 'Placeholder: the measurable outcome.',
      },
    ],
  },
]
