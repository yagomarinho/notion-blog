import { Entity, Identifier } from '../entity'
import { Query } from './query'
import { Tagged } from '../tagged'

export type RepositoryResult<E> = E | Promise<E>

export const URI = 'repository'
export type URI = typeof URI

export interface Repository<E extends Entity = any> extends Tagged<URI> {
  readonly get: (id: string) => RepositoryResult<E | undefined>
  readonly set: (entity: E) => RepositoryResult<E>
  readonly remove: (e: Identifier) => RepositoryResult<void>
  readonly query: (q: Query<E>) => RepositoryResult<E[]>
  // readonly batch: (b: Batch) => Promise<BatchResult>
}

export interface Readable<R extends Repository> extends Tagged<URI> {
  readonly get: R['get']
}
export interface Queryable<R extends Repository> extends Tagged<URI> {
  readonly query: R['query']
}
