import { ExtendedRecordMap } from 'notion-types'
import { NotionClientRepository } from '../../../shared/repositories/notion.client.repository'
import { Entity } from '../../../shared/core/entity'
import { applyTag } from '../../../shared/core/tagged'

export const URI = 'extracted-post-content'
export type URI = typeof URI

export interface ExtractedPostContent extends Entity<URI> {
  readonly content: ExtendedRecordMap
}

export const ExtractedPostContentRepository = () =>
  NotionClientRepository<ExtractedPostContent>({
    auth_token: process.env.NOTION_API_AUTH_V2!,
    converter: {
      from: page => {
        const block = page.recordMap.block?.[page.id]?.value
        const now = new Date()

        return applyTag(URI)({
          id: page.id,
          content: page.recordMap,
          created_at: block ? new Date(block.created_time) : now,
          updated_at: block ? new Date(block.last_edited_time) : now,
        })
      },
    },
  })
