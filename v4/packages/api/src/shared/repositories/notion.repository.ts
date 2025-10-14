import { Client, QueryDataSourceParameters } from '@notionhq/client'

import { Entity } from '../core/entity'
import {
  isComposite,
  Operators,
  Query,
  Queryable,
  Repository,
  Sort,
  Where,
  WhereComposite,
  WhereLeaf,
} from '../core/repository'
import { applyTag } from '../core/tagged'
import { Converter, ReadonlyConverter, WriteonlyConverter } from '../types'

type NotionSupportedTypes =
  | 'title'
  | 'rich_text'
  | 'email'
  | 'checkbox'
  | 'created_time'
  | 'created_by'
  | 'last_edited_time'
  | 'last_edited_by'
  | 'number'

type NotionOperators =
  | 'equals' // ==
  | 'does_not_equal' // !=
  | 'greater_than' // >
  | 'greater_than_or_equal_to' // >=
  | 'less_than' // <
  | 'less_than_or_equal_to' // <=
  | 'contains' // array-contains
  | ['greater_than_or_equal_to', 'less_than_or_equal_to'] //between

interface NotionItem {
  property: string
  type: NotionSupportedTypes
  operators: {
    [x in Operators]?: NotionOperators
  }
  converter: WriteonlyConverter<any>
}

type NotionMapper<E extends Entity> = {
  [x in keyof E]?: NotionItem
}
export interface Config<E extends Entity> {
  auth_token: string
  collection_id: string
  converter: ReadonlyConverter<Converter<E>>
  propertyMapper: NotionMapper<E>
  client?: (auth: string) => Client
}

export function NotionRepository<E extends Entity>({
  auth_token,
  collection_id,
  converter,
  propertyMapper,
  client = auth =>
    new Client({
      auth,
    }),
}: Config<E>): Queryable<Repository<E>> {
  const notion = client(auth_token)

  const query = async ({ where, limit, sorts: s }: Query<E>) => {
    const filter = where
      ? filterMapper({
          whereAdapter: whereAdapter(propertyMapper),
        })(where)
      : undefined

    const sorts = s ? sortMapper({ propertyMapper })(s) : undefined

    const result = await notion.dataSources.query({
      data_source_id: collection_id,
      filter,
      sorts,
      page_size: limit,
    })

    return result.results
      .filter(p => p.object === 'page' && !(p as any).in_trash)
      .map(converter.from)
  }

  return applyTag('repository')({
    query,
  })
}

// -----------
// Filter Mapper Helper
// -----------

interface WhereMap {
  property: string
  type: NotionSupportedTypes
  operator: NotionOperators
  value: any
}

interface Options {
  whereAdapter: (where: WhereLeaf<any>['value']) => WhereMap
}

function whereAdapter<E extends Entity>(propertyMapper: NotionMapper<E>) {
  return ({ fieldname, operator, value }): WhereMap => {
    const map: NotionItem = propertyMapper[fieldname]
    if (!map) throw new Error('invalid fieldname')

    const { property, type, operators, converter } = map

    const op = operators[operator]
    if (!op) throw new Error('Invalid where operator')

    return {
      property,
      type,
      operator: op,
      value: converter.to(value),
    }
  }
}

function filterMapper(opt: Options) {
  return (where: Where<any>): QueryDataSourceParameters['filter'] =>
    isComposite(where)
      ? filterCompositeMapper(opt)(where)
      : filterLeafMapper(opt)(where)
}

function filterCompositeMapper(opt: Options) {
  const filter = filterMapper(opt)
  return (where: WhereComposite<any>): any => ({
    [where.value]: [filter(where.left), filter(where.right)],
  })
}

function filterLeafMapper(opt: Options) {
  return (where: WhereLeaf<any>): QueryDataSourceParameters['filter'] => {
    if (operatorType(where.value.operator) === 'composite')
      return compositeOperatorMapper(opt)(where)
    return leafOperatorMapper(opt)(where)
  }
}

function compositeOperatorMapper(opt: Options) {
  const orOperators = ['in', 'array-contains-any']

  return ({ value: where }: WhereLeaf<any>): any => {
    const { property, operator, type, value } = opt.whereAdapter(where)

    const op = orOperators.includes(where.operator) ? 'or' : 'and'

    if (typeof operator === 'string')
      return {
        property,
        [op]: value.map(v => ({
          [type]: {
            [operator]: v,
          },
        })),
      }

    return {
      property,
      and: [
        { [type]: { [operator[0]]: value.start } },
        { [type]: { [operator[1]]: value.end } },
      ],
    }
  }
}

function leafOperatorMapper(opt: Options) {
  return ({ value: where }: WhereLeaf<any>): any => {
    const { property, operator, type, value } = opt.whereAdapter(where)

    if (typeof operator === 'string')
      return {
        property,
        [type]: {
          [operator]: value,
        },
      }

    return {
      property,
      and: [
        { [type]: { [operator[0]]: value.start } },
        { [type]: { [operator[1]]: value.end } },
      ],
    }
  }
}

function operatorType(operator: Operators): 'composite' | 'leaf' {
  const leafs = ['==', '!=', '>', '>=', '<', '<=', 'array-contains']
  const composites = ['in', 'not-in', 'between', 'array-contains-any']

  if (leafs.includes(operator)) return 'leaf'
  if (composites.includes(operator)) return 'composite'

  throw new Error('invalid operator')
}

// -----------
// Sorts Helper
// -----------

interface SortOptions {
  propertyMapper: NotionMapper<any>
}

function sortMapper({ propertyMapper }: SortOptions) {
  return (sorts: Sort<any>[]): QueryDataSourceParameters['sorts'] =>
    sorts.map(({ property, direction }) => ({
      property: (propertyMapper as any)[property].property,
      direction: direction === 'asc' ? 'ascending' : 'descending',
    }))
}
