export default function SkillRow({ skills }: { skills: string[] }) {
  return (
    <p className="w-full truncate text-center text-[clamp(0.4375rem,1.2vw,0.5625rem)] tracking-tight text-neutral-600">
      {skills.join('  ·  ')}
    </p>
  )
}
