import { Entity, EntityProps } from '../../../shared/core/entity'
import { applyTag } from '../../../shared/core/tagged'
import { OmitEntityProps } from '../../../shared/types/omit.entity'
import { ExtractedPostProps } from '../repositories/extracted.post.props.repository'
import { ExtendedRecordMap } from 'notion-types'

export const URI = 'post'
export type URI = typeof URI

export type Content = ExtendedRecordMap

export interface PostProps extends OmitEntityProps<ExtractedPostProps> {
  readonly estimated_readtime: number
  readonly content: Content
  readonly external_ref: string
}

export interface Post extends PostProps, Entity<URI> {}

export interface CreatePost
  extends Omit<PostProps, 'tags'>,
    Partial<EntityProps> {
  tags?: string[]
}

export function Post(
  id: string,
  slug: string,
  title: string,
  description: string,
  tags: string[],
  content: Content,
  estimated_readtime: number,
  external_ref: string,
  published: boolean,
  created_at: Date,
  updated_at: Date,
  publish_at?: Date,
): Post {
  return applyTag(URI)({
    id,
    slug,
    title,
    description,
    tags,
    content,
    estimated_readtime,
    external_ref,
    published,
    publish_at,
    created_at,
    updated_at,
  })
}

Post.create = ({
  id,
  slug,
  title,
  description,
  tags = [],
  content,
  estimated_readtime,
  external_ref,
  published = false,
  publish_at,
  created_at,
  updated_at,
}: CreatePost) => {
  const now = new Date()
  return Post(
    id ?? '',
    slug,
    title,
    description,
    tags,
    content,
    estimated_readtime,
    external_ref,
    published,
    created_at ?? now,
    updated_at ?? now,
    publish_at,
  )
}
