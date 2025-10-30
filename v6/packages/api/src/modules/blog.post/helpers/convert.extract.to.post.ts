// ----------
// Converter Extract Data to Structured Data Helper
// ----------

import { Post } from '../entities/post'
import { ExtractedPostContent } from '../repositories/extracted.post.content.repository'
import { ExtractedPostProps } from '../repositories/extracted.post.props.repository'
import { estimateReadingTime } from './estimate.reading.time'

export function convertExtractToPost({
  properties,
  content,
  post,
}: {
  properties: ExtractedPostProps
  content: ExtractedPostContent
  post?: Post
}): Post {
  const p = {
    slug: properties.slug,
    title: properties.title,
    description: properties.description,
    tags: properties.tags,
    content: content.content,
    estimated_readtime: estimateReadingTime(content.content),
    external_ref: properties.id,
    published: true,
    publish_at: properties.publish_at,
    created_at: properties.created_at,
    updated_at: properties.updated_at,
  }

  return post ? { ...post, ...p } : Post.create(p)
}
