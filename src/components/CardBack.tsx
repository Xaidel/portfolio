import { useState } from 'react'
import CardSheen from './CardSheen'
import FlipHint from './FlipHint'
import ViewAllLink from './ViewAllLink'
import CategoryTags from './CategoryTags'
import SkillRow from './SkillRow'
import ProjectPanel from './ProjectPanel'
import ContactCTA from './ContactCTA'
import { categories, type CategoryId } from '../data/categories'

export default function CardBack() {
  const [categoryId, setCategoryId] = useState<CategoryId>(categories[0].id)
  const [projectIndex, setProjectIndex] = useState(0)

  const category = categories.find((c) => c.id === categoryId) ?? categories[0]
  const project = category.projects[projectIndex]

  const selectCategory = (id: CategoryId) => {
    setCategoryId(id)
    setProjectIndex(0)
  }

  const stepProject = (delta: number) => {
    setProjectIndex((i) => (i + delta + category.projects.length) % category.projects.length)
  }

  return (
    <div className="relative flex h-full w-full flex-col gap-[clamp(0.1875rem,1vw,0.5rem)] overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 p-[clamp(0.625rem,3.5vw,1.75rem)] shadow-2xl shadow-black/40">
      <div className="grid w-full shrink-0 grid-cols-[auto_1fr_auto] items-center gap-2">
        <FlipHint />
        <p className="text-center text-[clamp(0.4375rem,1.1vw,0.5625rem)] font-medium uppercase leading-none tracking-[0.1em] text-neutral-600">
          Featured projects
        </p>
        <ViewAllLink />
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-[clamp(0.1875rem,1vw,0.5rem)]">
        <div className="flex flex-col gap-[clamp(0.1875rem,1vw,0.5rem)]">
          <CategoryTags categories={categories} activeId={categoryId} onSelect={selectCategory} />
          <SkillRow skills={category.skills} />
        </div>
        <ProjectPanel
          project={project}
          index={projectIndex}
          total={category.projects.length}
          onPrev={() => stepProject(-1)}
          onNext={() => stepProject(1)}
        />
        <ContactCTA />
      </div>
      <CardSheen />
    </div>
  )
}
