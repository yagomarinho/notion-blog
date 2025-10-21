import { IncomingHttpHeaders } from 'node:http'
import { applyTag, Tagged, verifyTag } from './tagged'

export type Context = Record<string, any>

export interface RequestProps<B> {
  ctx: Context
  body: B
  headers: IncomingHttpHeaders
}

export interface Request<B = any> extends RequestProps<B>, Tagged<'request'> {}

export function Request<B>({
  ctx,
  body,
  headers,
}: RequestProps<B>): Request<B> {
  return applyTag('request')({
    ctx,
    body,
    headers,
  })
}

export const isRequest = (value: unknown): value is Request =>
  verifyTag('request')(value)
