import { applyTag, Tagged, verifyTag } from './tagged'

export interface Left<L> extends Tagged<'left'> {
  readonly value: L
}

export interface Right<R> extends Tagged<'right'> {
  readonly value: R
}

export type Either<L, R> = Left<L> | Right<R>

export function Right<R>(value: R): Right<R> {
  return applyTag('right')({ value })
}

export function Left<L>(value: L): Left<L> {
  return applyTag('left')({ value })
}

export function Either<L, R>(condition: (value: L | R) => value is R) {
  return (value: L | R): Either<L, R> =>
    condition(value) ? Right(value) : Left(value)
}

export const isLeft = verifyTag('left')
export const isRight = verifyTag('right')
