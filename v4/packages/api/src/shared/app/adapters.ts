import { Request as ExpressRequest, RequestHandler } from 'express'
import { Handler } from '../core/handler'
import { Request } from '../core/request'

export function requestAdapter(request: ExpressRequest): Request {
  return {
    __tag: 'request',
    ctx: {
      params: request.params,
      query: request.query,
    },
    body: request.body,
    headers: request.headers,
  }
}

export function expressHandlerAdapter(handler: Handler<{}>): RequestHandler
export function expressHandlerAdapter<E>(
  handler: Handler<E>,
  env: E,
): RequestHandler
export function expressHandlerAdapter<E = {}>(
  handler: Handler<any>,
  env: E = {} as E,
): RequestHandler {
  return (request, response) => {
    try {
      const res = handler(requestAdapter(request))(env)

      if (res instanceof Promise) {
        return res.then(r => response.status(r.status).json(r.body))
      }
      return response.status(res.status).json(res.body)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      return response.status(500).json({ message: 'Internal server error!' })
    }
  }
}
