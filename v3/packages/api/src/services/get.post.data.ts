import { NotionAPI } from 'notion-client'
import { extractPropertiesFromRecordMap } from '../utils/extract.properties.from.record.map'

export async function getPostData({ pageId }: { pageId: string }) {
  const notion = new NotionAPI({
    authToken: process.env.NOTION_API_AUTH_V2,
  })

  const recordMap = await notion.getPage(pageId)

  const properties = extractPropertiesFromRecordMap(recordMap, pageId)
  const result = { recordMap, properties }

  if (process.env.NODE_ENV !== 'production') return result

  if (
    properties.published[0][0] === false ||
    (typeof properties.published[0][0] === 'string' &&
      properties.published[0][0].toLowerCase() === 'no')
  )
    return

  return result
}
