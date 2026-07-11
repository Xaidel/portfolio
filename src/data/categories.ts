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
    skills: ['Workflow orchestration', 'CI/CD', 'Scripting', 'n8n', 'Scheduling'],
    projects: [
      {
        name: 'Placeholder project — Automation',
        problem: 'Placeholder: the concrete problem this project solved.',
        decision: 'Placeholder: the engineering decision that mattered.',
        outcome: 'Placeholder: the measurable outcome.',
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
