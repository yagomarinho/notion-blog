import 'dotenv/config'

import { Application } from './shared/app/application'

import { routes } from './routes'

import { Env } from './env'

Env()
  .then(env => Application({ routes: routes(env) }))
  .then(app =>
    // eslint-disable-next-line no-console
    app.start().then(() => console.log(`Server Start Running...`)),
  )
