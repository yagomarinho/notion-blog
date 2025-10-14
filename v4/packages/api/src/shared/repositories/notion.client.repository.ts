import { ExtendedRecordMap } from 'notion-types'
import { Entity } from '../core/entity'
import { Readable, Repository } from '../core/repository'
import { applyTag } from '../core/tagged'
import { extractPropertiesFromRecordMap } from '../utils/extract.properties.from.record.map'

import { NotionAPI } from 'notion-client'
import { Converter, ReadonlyConverter } from '../types'

export type ExtendedNotionPage<E extends Entity> = E & {
  rawPage: ExtendedRecordMap
}

export interface Config<E extends Entity> {
  auth_token: string
  converter: ReadonlyConverter<Converter<ExtendedNotionPage<E>>>
  client?: (authToken: string) => NotionAPI
}

export function NotionClientRepository<E extends Entity>({
  auth_token,
  converter,
  client = authToken =>
    new NotionAPI({
      authToken,
    }),
}: Config<E>): Readable<Repository<ExtendedNotionPage<E>>> {
  const notion = client(auth_token)

  async function get(id: string): Promise<ExtendedNotionPage<E>> {
    const rawPage = await notion.getPage(id)
    const properties = extractPropertiesFromRecordMap(rawPage, id)

    return converter.from({
      id,
      properties,
      rawPage,
    })
  }

  return applyTag('repository')({
    get,
  })
}
