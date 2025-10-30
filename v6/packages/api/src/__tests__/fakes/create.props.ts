import {
  ExtractedPostProps,
  URI,
} from '../../modules/blog.post/repositories/extracted.post.props.repository'
import { applyTag } from '../../shared/core/tagged'

export const createProps = ({
  id,
  slug,
  title,
  description,
  tags = [],
  published = false,
  publish_at = new Date(),
  created_at = new Date(),
  updated_at = new Date(),
}: {
  id: string
  slug: string
  title: string
  description: string
  tags?: string[]
  published?: boolean
  publish_at?: Date
  created_at?: Date
  updated_at?: Date
}): ExtractedPostProps =>
  applyTag(URI)({
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
