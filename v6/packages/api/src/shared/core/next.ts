import { Request } from './request'
import { Result } from './result'
import { applyTag, Tagged, verifyTag } from './tagged'

export interface NextProps<B> {
  readonly request: Request<B>
}

export interface Next<B = any> extends NextProps<B>, Tagged<'next'> {}

export type HandleNext<E> = Result<E, Next>

export function Next<B>({ request }: NextProps<B>): Next<B> {
  return applyTag('next')({ request })
}

export const isNext = (value: unknown): value is Next =>
  verifyTag('next')(value)
