import { Entity } from '../core/entity'
import { Readable, Repository } from '../core/repository'
import { applyTag } from '../core/tagged'
import { extractPropertiesFromRecordMap } from '../utils/extract.properties.from.record.map'

import { NotionAPI } from 'notion-client'
import { Converter, ReadonlyConverter } from '../types'

export interface Config<E extends Entity> {
  auth_token: string
  converter: ReadonlyConverter<Converter<E>>
  client?: (authToken: string) => NotionAPI
}

export function NotionClientRepository<E extends Entity>({
  auth_token,
  converter,
  client = authToken =>
    new NotionAPI({
      authToken,
    }),
}: Config<E>): Readable<Repository<E>> {
  const notion = client(auth_token)

  async function get(id: string): Promise<E> {
    const recordMap = await notion.getPage(id)
    const properties = extractPropertiesFromRecordMap(recordMap, id)

    return converter.from({
      id,
      properties,
      recordMap,
    })
  }

  return applyTag('repository')({
    get,
  })
}
