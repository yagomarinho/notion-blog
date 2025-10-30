import { Collection, MongoClient, ObjectId } from 'mongodb'

import { Entity } from '../core/entity'
import {
  isComposite,
  Repository,
  Sort,
  Where,
  WhereComposite,
  WhereLeaf,
} from '../core/repository'
import { applyTag } from '../core/tagged'
import { Converter } from '../types'
import { OmitEntityProps } from '../types/omit.entity'

export type ProjectFields<E extends Entity> = {
  [x in keyof OmitEntityProps<E>]?: 0 | 1
} & { [x: string]: 0 | 1 }

export interface ClientConfig<E extends Entity> {
  client: MongoClient
  database: string
  collection: string
  converter: Converter<E>
  projection?: ProjectFields<E>
}

export interface Config<E extends Entity> {
  uri: string
  database: string
  collection: string
  converter: Converter<E>
  projection?: ProjectFields<E>
}

export interface MongoDBRepository<E extends Entity> extends Repository<E> {
  readonly connect: () => Promise<void>
  readonly disconnect: () => Promise<void>
  readonly clear: () => Promise<void>
}

enum CONNECTION_STATUS {
  READY,
  CONNECTED,
  DISCONNECTED,
}

export function MongoDBRepository<E extends Entity>(
  config: ClientConfig<E>,
): MongoDBRepository<E>
export function MongoDBRepository<E extends Entity>(
  config: Config<E>,
): MongoDBRepository<E>
export function MongoDBRepository<E extends Entity>({
  database,
  collection,
  converter,
  projection,
  ...rest
}: ClientConfig<E> | Config<E>): MongoDBRepository<E> {
  const client: MongoClient =
    (rest as any).client ?? new MongoClient((rest as any).uri)
  let coll: Collection<Document>
  let status = CONNECTION_STATUS.READY

  const connect: MongoDBRepository<E>['connect'] = async () => {
    if (status !== CONNECTION_STATUS.READY)
      throw new Error('Connection has been initialized')

    if (await isConnected(client)) {
      status = CONNECTION_STATUS.CONNECTED
      coll = client.db(database).collection(collection)

      return
    }

    const connection = await client.connect()

    coll = connection.db(database).collection(collection)
    status = CONNECTION_STATUS.CONNECTED
  }

  const disconnect = verifyConnectionProxy<MongoDBRepository<E>['disconnect']>(
    async () => {
      await client.close()
      status = CONNECTION_STATUS.DISCONNECTED
    },
  )

  const get = verifyConnectionProxy<Repository<E>['get']>(async id => {
    const item = await coll.findOne(
      { _id: ObjectId.createFromHexString(id) },
      { projection },
    )

    if (item === null) return

    return converter.from(item)
  })

  const set = verifyConnectionProxy<Repository<E>['set']>(async (entity: E) => {
    const { _id, ...props } = converter.to(entity)

    const result = await coll.updateOne(
      { _id: _id },
      { $set: props },
      { upsert: true },
    )

    return result.upsertedCount
      ? converter.from(
          await coll.findOne({ _id: result.upsertedId! }, { projection }),
        )
      : entity
  })

  const remove = verifyConnectionProxy<Repository<E>['remove']>(
    async ({ id }) => {
      await coll.deleteOne({ _id: ObjectId.createFromHexString(id) })
    },
  )

  const query = verifyConnectionProxy<Repository<E>['query']>(
    async ({ where, sorts, cursor, limit } = {}) => {
      let find = coll.find(where ? whereAdaptToFindQuery(where) : {})

      if (limit) {
        const skip = cursor ? parseInt(cursor) * limit : 0
        find = find.limit(limit).skip(skip)
      }

      if (sorts) {
        find = find.sort(applySorts(sorts))
      }

      if (projection) find.project(projection)

      return (await find.toArray()).map(converter.from)
    },
  )

  const batch = verifyConnectionProxy<Repository<E>['batch']>(async b => {
    const bulk = b.map(item => {
      if (item.type === 'remove')
        return {
          deleteOne: {
            filter: { _id: ObjectId.createFromHexString(item.data.id) },
          },
        }

      const { _id, ...props } = converter.to(item.data)

      return {
        updateOne: {
          filter: { _id },
          update: { $set: props },
          upsert: true,
        },
      }
    })

    const result = await coll.bulkWrite(bulk, { ordered: false })

    return {
      status: result.isOk() ? 'successful' : 'failed',
      time: new Date(),
    }
  })

  const clear = verifyConnectionProxy<MongoDBRepository<E>['clear']>(
    async () => {
      await coll.deleteMany({})
    },
  )

  function verifyConnectionProxy<F extends (...args: any[]) => any>(
    fn: F,
  ): (...args: Parameters<F>) => ReturnType<F> {
    return (...args) => {
      if (status !== CONNECTION_STATUS.CONNECTED)
        throw new Error('connection not established')

      return fn(...args)
    }
  }

  return applyTag('repository')({
    get,
    set,
    remove,
    query,
    batch,
    connect,
    disconnect,
    clear,
  })
}

async function isConnected(client?: MongoClient) {
  if (!client || !client.db()) {
    return false
  }
  try {
    const res = await client.db().admin().ping()
    return res.ok === 1
  } catch {
    return false
  }
}

// -------------
// Where Helpers
// -------------

function whereAdaptToFindQuery(where: Where<any>): any {
  return isComposite(where)
    ? whereCompositeAdapter(where)
    : whereLeafAdapter(where)
}

function whereCompositeAdapter(where: WhereComposite<any>) {
  const operator = where.value === 'and' ? '$and' : '$or'
  const wheres = [
    whereAdaptToFindQuery(where.left),
    whereAdaptToFindQuery(where.right),
  ]
  return { [operator]: wheres }
}

function whereLeafAdapter(where: WhereLeaf<any>) {
  const { fieldname, operator, value } = where.value

  if (operator === 'array-contains') return { [fieldname]: value }

  if (operator === 'between')
    return { [fieldname]: { $gte: value.start, $lte: value.end } }

  const operatorMapper = {
    '==': '$eq',
    '!=': '$ne',
    '>': '$gt',
    '>=': '$gte',
    '<': '$lt',
    '<=': '$lte',
    in: '$in',
    'not-in': '$nin',
    'array-contains-any': '$in',
  }

  return { [fieldname]: { [operatorMapper[operator]]: value } }
}

// -------------
// Sorts Helpers
// -------------

function applySorts(sorts: Sort<any>[]): any {
  return sorts.reduce(
    (acc, { property, direction }) => (
      (acc[property as any] = direction === 'asc' ? 1 : -1),
      acc
    ),
    {} as any,
  )
}
