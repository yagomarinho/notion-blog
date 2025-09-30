import 'dotenv/config'

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'

import { getPostIdWithSlug } from './services/get.post.id.with.slug'
import { getPostData } from './services/get.post.data'
import { getPostsList } from './services/get.posts.list'
import { verifySignature } from './utils/verify.signature'
import { DeployTimer } from './utils/deploy.timer'

const PORT = process.env.PORT || 3333
const app = express()
const timer = DeployTimer()

app.use(
  cors({
    origin: '*',
  }),
)
app.use(helmet())
app.use(express.json())

app.get('/posts', async (req, res) => {
  try {
    const list = await getPostsList()

    return res.json(list)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/post/:slug', async (req, res) => {
  try {
    const { slug } = req.params

    const pageId = await getPostIdWithSlug({ slug })

    if (!pageId) return res.status(400).json({ message: 'Bad request' })

    const page = await getPostData({ pageId })

    if (!page) return res.status(404).json({ message: 'Post not found' })

    return res.json(page)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.post(
  '/posts/webhooks/notion',
  async (req, res, next) => {
    try {
      const { body } = req
      const sign =
        req.headers['X-Notion-Signature'] || req.headers['x-notion-signature']

      if (
        !sign ||
        typeof sign !== 'string' ||
        !verifySignature(
          sign,
          process.env.NOTION_WEBHOOK_TOKEN ?? '',
          JSON.stringify(body),
        )
      )
        return res.status(401).json({ message: 'Unauthorized request' })

      return next()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      return res.status(500).json({ error: 'Internal server error' })
    }
  },
  async (req, res) => {
    try {
      const { body } = req

      const { type, data } = body

      if (
        type === 'page.properties_updated' &&
        data.parent.data_source_id === process.env.NOTION_COLLECTION_ID
      )
        timer.deploy()

      return res.status(201).send()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      return res.status(500).json({ error: 'Internal server error' })
    }
  },
)

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server Start Running at Port: ${PORT}`))
