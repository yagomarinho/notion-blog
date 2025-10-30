import type { Server } from 'http'

import express from 'express'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import cors from 'cors'

import { Route } from '../core/route'

/* Adapters */
import { expressHandlerAdapter } from './adapters'

const DEFAULT_PORT = Number(process.env.PORT) || 3333

export interface Options {
  port?: number
  routes?: Route[]
}

export function Application({
  routes = [],
  port = DEFAULT_PORT,
}: Options = {}) {
  let server: Server
  const app = express()

  app.use(
    cors({
      origin: '*',
    }),
  )
  app.use(limiter())
  app.use(helmet())
  app.use(express.json())

  routes.reduce(
    (acc, curr) =>
      acc[curr.method](
        curr.path,
        expressHandlerAdapter(curr.handler, curr.env ?? {}),
      ),
    app,
  )

  function start(): Promise<void> {
    return new Promise((resolve, reject) => {
      server = app.listen(port, err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }

  function stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      server.close(err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }

  function exposeApp() {
    return app
  }

  return {
    start,
    stop,
    exposeApp,
  }
}

function limiter() {
  return rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 25,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_, response) => {
      response.status(429).json({
        status: 'error',
        message: 'To many requests. Please try again later',
      })
    },
  })
}
