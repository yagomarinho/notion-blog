import { ExtendedRecordMap } from 'notion-types'
import { Entity, EntityProps } from '../../../shared/core/entity'
import { PostCoverProps } from './post.cover'
import { applyTag } from '../../../shared/core/tagged'
import { NotionClientRepository } from '../../../shared/repositories/notion.client.repository'

export const URI = 'post'
export type URI = typeof URI

export interface PostProps extends PostCoverProps {
  content: ExtendedRecordMap
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
  published: boolean,
  content: ExtendedRecordMap,
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
    published,
    publish_at,
    created_at,
    updated_at,
    content,
  })
}

Post.create = ({
  id,
  slug,
  title,
  description,
  tags = [],
  published = false,
  publish_at,
  created_at,
  updated_at,
  content,
}: CreatePost) => {
  const now = new Date()
  return Post(
    id ?? '',
    slug,
    title,
    description,
    tags,
    published,
    content,
    created_at ?? now,
    updated_at ?? now,
    publish_at,
  )
}

export const PostRepository = () =>
  NotionClientRepository<Post>({
    auth_token: process.env.NOTION_API_AUTH_V2!,
    converter: {
      from: page => {
        const input = page.properties.publish_at?.[0]?.[1]?.[0]?.[1]
        const publish_at = input
          ? new Date(`${input?.start_date}T${input?.start_time}:00-03:00`)
          : undefined

        const block = page.recordMap.block?.[page.id]?.value

        return Post.create({
          id: page.id,
          title: page.properties.title?.[0]?.[0] ?? '',
          description: page.properties.description?.[0]?.[0] ?? '',
          slug: page.properties.slug?.[0]?.[0] ?? '',
          tags:
            page.properties.tags?.[0]?.[0]
              ?.split(',')
              .map(v => v.trim())
              .filter(Boolean) ?? [],
          published:
            page.properties.published?.[0]?.[0]?.toLowerCase() === 'yes',
          publish_at,
          created_at: block ? new Date(block.created_time) : undefined,
          updated_at: block ? new Date(block.last_edited_time) : undefined,
          content: page.recordMap,
        })
      },
    },
  })
