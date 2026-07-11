import ContactRow from './ContactRow'
import { EmailIcon, GitHubIcon, LinkedInIcon, MobileIcon } from './icons'

export default function CardFooter() {
  return (
    <div className="flex w-full items-end justify-between">
      <div className="flex min-w-0 flex-1 flex-col items-start gap-[clamp(0.3125rem,1.3vw,0.5rem)]">
        <div className="hidden sm:block">
          <p className="text-[clamp(0.8125rem,2.6vw,1rem)] font-semibold leading-tight text-[#E5D0AC]">
            Karl Abechuela
          </p>
          <p className="text-[clamp(0.5625rem,1.7vw,0.75rem)] text-[#E5D0AC]">
            Software Engineer, AI &amp; Automation
          </p>
        </div>
        <div className="flex w-full min-w-0 flex-col items-start gap-[clamp(0.1875rem,0.7vw,0.3125rem)]">
          <ContactRow icon={<MobileIcon className="h-3 w-3" />} text="09632530577" />
          <ContactRow
            icon={<EmailIcon className="h-3 w-3" />}
            text="abechuelak@gmail.com"
            href="mailto:abechuelak@gmail.com"
          />
          <ContactRow
            icon={<GitHubIcon className="h-3 w-3" />}
            text="https://github.com/Xaidel"
            href="https://github.com/Xaidel"
          />
          <ContactRow
            icon={<LinkedInIcon className="h-3 w-3" />}
            text="https://www.linkedin.com/in/karlabechuela"
            href="https://www.linkedin.com/in/karlabechuela"
          />
        </div>
      </div>
      <div className="mb-[clamp(1rem,3.5vw,1.75rem)] flex shrink-0 flex-col items-end text-right">
        <p className="text-[clamp(0.4375rem,1.3vw,0.625rem)] text-[#E5D0AC]">
          Naga City, Philippines
        </p>
      </div>
    </div>
  )
}
