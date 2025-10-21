import { Entity, EntityProps } from '../../../shared/core/entity'
import { applyTag } from '../../../shared/core/tagged'
import { NotionRepository } from '../../../shared/repositories/notion.repository'
import { Converter, ReadonlyConverter } from '../../../shared/types'

export const URI = 'post-cover'
export type URI = typeof URI

export interface PostCoverProps {
  slug: string
  title: string
  description: string
  tags: string[]
  published: boolean
  publish_at?: Date
}

export interface PostCover extends PostCoverProps, Entity<URI> {}

export interface CreatePost
  extends Omit<PostCoverProps, 'tags'>,
    Partial<EntityProps> {
  tags?: string[]
}

export function PostCover(
  id: string,
  slug: string,
  title: string,
  description: string,
  tags: string[],
  published: boolean,
  created_at: Date,
  updated_at: Date,
  publish_at?: Date,
): PostCover {
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
  })
}

PostCover.create = ({
  id,
  slug,
  title,
  description,
  tags = [],
  published = false,
  publish_at,
  created_at,
  updated_at,
}: CreatePost) => {
  const now = new Date()
  return PostCover(
    id ?? '',
    slug,
    title,
    description,
    tags,
    published,
    created_at ?? now,
    updated_at ?? now,
    publish_at,
  )
}

const writeConverter = { to: (v: any) => v }

const coverConverter: ReadonlyConverter<Converter<PostCover>> = {
  from: page =>
    PostCover.create({
      id: page.id,
      title: page.properties.title?.title?.[0]?.plain_text ?? '',
      description:
        page.properties.description?.rich_text?.[0]?.plain_text ?? '',
      tags: page.properties.tags?.multi_select?.map(item => item.name) ?? [],
      slug: page.properties.slug?.rich_text?.[0]?.plain_text ?? '',
      published: page.properties.published?.checkbox,
      created_at: new Date(page.created_time),
      updated_at: new Date(page.last_edited_time),
      publish_at: page.properties.publish_at?.date?.start
        ? new Date(page.properties.publish_at?.date?.start)
        : undefined,
    }),
}

export const PostCoverRepository = () =>
  NotionRepository<PostCover>({
    auth_token: process.env.NOTION_AUTH_TOKEN!,
    collection_id: process.env.NOTION_COLLECTION_ID!,
    converter: coverConverter,
    propertyMapper: {
      title: {
        property: 'title',
        type: 'title',
        converter: writeConverter,
        operators: {},
      },
      description: {
        property: 'description',
        type: 'rich_text',
        converter: writeConverter,
        operators: {},
      },
      tags: {
        property: 'tags',
        type: 'multi_select',
        converter: writeConverter,
        operators: {},
      },
      slug: {
        property: 'slug',
        type: 'rich_text',
        converter: writeConverter,
        operators: {
          '==': 'equals',
        },
      },
      published: {
        property: 'published',
        type: 'checkbox',
        converter: writeConverter,
        operators: {
          '==': 'equals',
          '!=': 'does_not_equal',
        },
      },
      publish_at: {
        property: 'publish_at',
        type: 'date',
        converter: writeConverter,
        operators: {},
      },
      created_at: {
        property: 'created_at',
        type: 'created_time',
        converter: writeConverter,
        operators: {},
      },
      updated_at: {
        property: 'updated_at',
        type: 'last_edited_time',
        converter: writeConverter,
        operators: {},
      },
    },
  })
