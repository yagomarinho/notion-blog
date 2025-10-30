import { Request } from './request'
import { Response } from './response'
import { Result } from './result'
import { applyTag, Tagged, verifyTag } from './tagged'

export type HandleResult<E> = Result<E, Response>

interface H<E = {}> {
  (request: Request): HandleResult<E>
}

export interface Handler<E = {}> extends H<E>, Tagged<'handler'> {}

export function Handler<E = {}>(handler: H<E>): Handler<E> {
  const taggedHandler = applyTag('handler')(handler)

  return taggedHandler
}

export const isHandler = (handler: unknown): handler is Handler<any> =>
  verifyTag('handler')(handler)
