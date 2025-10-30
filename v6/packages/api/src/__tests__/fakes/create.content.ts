import { ExtendedRecordMap } from 'notion-types'
import {
  ExtractedPostContent,
  URI,
} from '../../modules/blog.post/repositories/extracted.post.content.repository'
import { applyTag } from '../../shared/core/tagged'

export const createContent = ({
  id,
  content,
  created_at = new Date(),
  updated_at = new Date(),
}: {
  id: string
  content: ExtendedRecordMap
  created_at?: Date
  updated_at?: Date
}): ExtractedPostContent =>
  applyTag(URI)({ id, content, created_at, updated_at })
