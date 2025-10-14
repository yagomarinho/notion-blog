import Link from 'next/link'

export interface Cover {
  slug: string
  title: string
  description: string
  created_at: Date
  updated_at: Date
}

export const Card = ({ slug, title, description, updated_at }: Cover) => (
  <Link
    prefetch={false}
    href={`/post/${slug}`}
    className="flex flex-col gap-2 border-b border-white/15 py-8 w-full"
  >
    <span className="font-inter font-bold text-base md:text-lg">{title}</span>
    <p className="font-roboto text-sm md:text-base text-[#A2A2A2] leading-[150%]">
      {description}
    </p>
    <time className="font-roboto text-xs md:text-sm text-[#6C9FF2]">
      Atualizado em {updated_at.toLocaleDateString()}
    </time>
  </Link>
)
