import { HandleResult } from './handler'
import { HandleNext } from './next'
import { Request } from './request'
import { applyTag, Tagged, verifyTag } from './tagged'

export type MiddlewareResult<E> = HandleResult<E> | HandleNext<E>

interface M<E = {}> {
  (request: Request): MiddlewareResult<E>
}

export interface Middleware<E = {}> extends M<E>, Tagged<'middleware'> {}

export function Middleware<E = {}>(middleware: M<E>): Middleware<E> {
  const taggedMiddleware = applyTag('middleware')(middleware)

  return taggedMiddleware
}

export const isMiddleware = (
  middleware: unknown,
): middleware is Middleware<any> => verifyTag('middleware')(middleware)
