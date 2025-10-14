import 'dotenv/config'

import { Application } from './shared/app/application'

import { routes } from './routes'

const app = Application({ routes })

// eslint-disable-next-line no-console
app.start().then(() => console.log(`Server Start Running...`))
