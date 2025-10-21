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
import { PostCoverRepository } from './modules/blog.post/entities/post.cover'
import { PostRepository } from './modules/blog.post/entities/post'
import { apiKeyAuthorization } from './shared/middlewares/api.key.authorization'

const timer = DeployTimer()
const covers = PostCoverRepository()
const posts = PostRepository()

export const routes: Route[] = [
  Route({
    path: '/posts',
    handler: handlerPipe(apiKeyAuthorization, getPostListHandler),
    env: { covers },
  }),
  Route({
    path: '/post/:slug',
    handler: handlerPipe(apiKeyAuthorization, getPostDataHandler),
    env: { covers, posts },
  }),
  Route({
    method: 'post',
    path: '/posts/webhooks/notion',
    handler: handlerPipe(verifySignatureMiddleware, triggerWebhookHandler),
    env: { timer },
  }),
]
