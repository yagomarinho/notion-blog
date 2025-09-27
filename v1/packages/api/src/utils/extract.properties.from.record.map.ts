import { ExtendedRecordMap } from 'notion-types'
import { toHyphenatedPageId } from './to.hyphenated.page.id'

export function extractPropertiesFromRecordMap(
  recordMap: ExtendedRecordMap,
  pageId: string,
) {
  const block = recordMap.block[toHyphenatedPageId(pageId)].value
  const props = block.properties

  const collectionId = block.parent_id

  const schema = recordMap.collection[collectionId]?.value.schema ?? {}

  const result: Record<string, any> = {}

  for (const [propId, val] of Object.entries(props ?? {})) {
    const meta = schema[propId]
    if (meta) result[meta.name] = val
  }

  return result
}
