import Link from 'next/link'
import { Divisor } from './divisor'
import { TagGroup } from './tag'
import { Time } from './time'

export interface Cover {
  id: string
  title: string
  description: string
  tags: string[]
  slug: string
  published: boolean
  publish_at?: Date
  created_at: Date
  updated_at: Date
}

export const Card = ({ slug, title, description, tags, publish_at }: Cover) => (
  <Link
    prefetch={false}
    href={`/post/${slug}`}
    className="relative flex flex-col gap-2 md:gap-4 px-4 py-8 md:py-16 w-full"
  >
    <header className="flex flex-row justify-between items-center flex-wrap">
      <TagGroup tags={tags} />
      {publish_at && <Time value={publish_at} />}
    </header>
    <span className="font-inter font-bold text-base md:text-lg">{title}</span>
    <p className="font-roboto text-sm md:text-base text-[#A2A2A2] leading-[150%]">
      {description}
    </p>
    <div className="absolute bottom-0 left-1/2 translate-x-[-50%] flex justify-center items-center">
      <Divisor />
    </div>
  </Link>
)
