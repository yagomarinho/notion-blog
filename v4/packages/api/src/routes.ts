import { NotionRepository } from './shared/repositories/notion.repository'
import { Post } from './modules/blog.post/entities/post'

/* Handlers */
import { getPostListHandler } from './modules/blog.post/handlers/get.post.list.handler'
import { getPostDataHandler } from './modules/blog.post/handlers/get.post.data.handler'
import { triggerWebhookHandler } from './modules/blog.post/handlers/trigger.webhook.handler'

/* Middlewares */
import { verifySignatureMiddleware } from './modules/blog.post/middlewares/verify.signature'

/* Utils */
import { DeployTimer } from './shared/utils/deploy.timer'
import { handlerPipe } from './shared/helpers/handler.pipe'
import { Route } from './shared/core/route'
import { NotionClientRepository } from './shared/repositories/notion.client.repository'

const timer = DeployTimer()

const writeConverter = { to: (v: any) => v }

const posts = NotionRepository<Post>({
  auth_token: process.env.NOTION_AUTH_TOKEN!,
  collection_id: process.env.NOTION_COLLECTION_ID!,
  converter: {
    from: page =>
      Post.create({
        id: page.id,
        title: page.properties.title?.title?.[0]?.plain_text ?? '',
        description:
          page.properties.description?.rich_text?.[0]?.plain_text ?? '',
        slug: page.properties.slug?.rich_text?.[0]?.plain_text ?? '',
        published: page.properties.published?.checkbox,
        created_at: new Date(page.created_time),
        updated_at: new Date(page.last_edited_time),
      }),
  },
  propertyMapper: {
    title: {
      property: 'title',
      type: 'title',
      converter: writeConverter,
      operators: {},
    },
    description: {
      property: 'description',
      type: 'rich_text',
      converter: writeConverter,
      operators: {},
    },
    slug: {
      property: 'slug',
      type: 'rich_text',
      converter: writeConverter,
      operators: {
        '==': 'equals',
      },
    },
    published: {
      property: 'published',
      type: 'checkbox',
      converter: writeConverter,
      operators: {
        '==': 'equals',
        '!=': 'does_not_equal',
      },
    },
    created_at: {
      property: 'created_at',
      type: 'created_time',
      converter: writeConverter,
      operators: {},
    },
    updated_at: {
      property: 'updated_at',
      type: 'last_edited_time',
      converter: writeConverter,
      operators: {},
    },
  },
})

const pages = NotionClientRepository<Post>({
  auth_token: process.env.NOTION_API_AUTH_V2!,
  converter: {
    from: page => ({
      ...Post.create({
        id: page.id,
        title: page.properties.title?.[0]?.[0] ?? '',
        description: page.properties.description?.[0]?.[0] ?? '',
        slug: page.properties.slug?.[0]?.[0] ?? '',
        published: page.properties.published?.[0]?.[0]?.toLowerCase() === 'yes',
        created_at: new Date(page.rawPage.created_time),
        updated_at: new Date(page.rawPage.last_edited_time),
      }),
      rawPage: page.rawPage,
    }),
  },
})

export const routes: Route[] = [
  Route({
    path: '/posts',
    handler: getPostListHandler,
    env: { posts },
  }),
  Route({
    path: '/post/:slug',
    handler: getPostDataHandler,
    env: { posts, pages },
  }),
  Route({
    method: 'post',
    path: '/posts/webhooks/notion',
    handler: handlerPipe(verifySignatureMiddleware, triggerWebhookHandler),
    env: { timer },
  }),
]
