// ----------
// Decide Intent Helper
// ----------

import { Identifier } from '../../../shared/core/entity'
import { Post } from '../entities/post'
import { ExtractedPostContent } from '../repositories/extracted.post.content.repository'
import { ExtractedPostProps } from '../repositories/extracted.post.props.repository'
import { convertExtractToPost } from './convert.extract.to.post'

export interface KindNone {
  kind: 'none'
  data: undefined
}

export interface KindRemove {
  kind: 'remove'
  data: Identifier
}

export interface KindUpsert {
  kind: 'upsert'
  data: Post
}

export type IntentResult = KindNone | KindRemove | KindUpsert

export function decideIntent({
  properties,
  content,
  post,
}: {
  properties?: ExtractedPostProps
  content?: ExtractedPostContent
  post?: Post
}): IntentResult {
  if (!properties || !content)
    return post ? kind('remove', { id: post.id }) : kind('none')

  if (!properties.published) {
    return post ? kind('remove', { id: post.id }) : kind('none')
  }

  const converted = convertExtractToPost({ properties, content, post })

  if (!post) return kind('upsert', converted)

  return isPostUpdated(post, converted)
    ? kind('upsert', converted)
    : kind('none')
}

function isPostUpdated(prev: Post, updated: Post) {
  return JSON.stringify(prev) !== JSON.stringify(updated)
}

function kind(kind: 'none'): KindNone
function kind(kind: 'remove', data: Identifier): KindRemove
function kind(kind: 'upsert', data: Post): KindUpsert
function kind(kind: string, data?: any) {
  return {
    kind,
    data,
  }
}
