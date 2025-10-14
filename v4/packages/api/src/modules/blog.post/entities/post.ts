import { Entity, EntityProps } from '../../../shared/core/entity'
import { applyTag } from '../../../shared/core/tagged'

export const URI = 'post'
export type URI = typeof URI

export interface PostProps {
  slug: string
  title: string
  description: string
  published: boolean
}

export interface Post extends PostProps, Entity<URI> {}

export interface CreatePost extends PostProps, Partial<EntityProps> {}

export function Post(
  id: string,
  slug: string,
  title: string,
  description: string,
  published: boolean,
  created_at: Date,
  updated_at: Date,
): Post {
  return applyTag(URI)({
    id,
    slug,
    title,
    description,
    published,
    created_at,
    updated_at,
  })
}

Post.create = ({
  id,
  slug,
  title,
  description,
  published = false,
  created_at,
  updated_at,
}: CreatePost) => {
  const now = new Date()
  return Post(
    id ?? '',
    slug,
    title,
    description,
    published,
    created_at ?? now,
    updated_at ?? now,
  )
}
