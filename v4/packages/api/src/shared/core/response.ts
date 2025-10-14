import { Tagged, verifyTag } from './tagged'

export interface ResponseProps<B> {
  status: number
  body: B
}

export interface Response<B = any>
  extends ResponseProps<B>,
    Tagged<'response'> {}

export function Response<B>({ status, body }: ResponseProps<B>): Response<B> {
  return {
    __tag: 'response',
    status,
    body,
  }
}

Response.ok = <B>(body: B) => Response<B>({ status: 200, body })

export const isResponse = (value: unknown): value is Response =>
  verifyTag('response')(value)
