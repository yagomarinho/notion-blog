/* Handlers */
import { getPostListHandler } from './modules/blog.post/handlers/get.post.list.handler'
import { getPostDataHandler } from './modules/blog.post/handlers/get.post.data.handler'
import { triggerWebhookHandler } from './modules/blog.post/handlers/trigger.webhook.handler'

/* Middlewares */
import { verifySignatureMiddleware } from './modules/blog.post/middlewares/verify.signature'
import { apiKeyAuthorization } from './shared/middlewares/api.key.authorization'

/* Utils */
import type { DeployTimer } from './shared/utils/deploy.timer'
import { handlerPipe } from './shared/helpers/handler.pipe'
import { Route } from './shared/core/route'

/* Entities and Datas */
import { PostCover } from './modules/blog.post/repositories/post.cover.repository'
import { Post } from './modules/blog.post/entities/post'
import { ExtractedPostProps } from './modules/blog.post/repositories/extracted.post.props.repository'
import { ExtractedPostContent } from './modules/blog.post/repositories/extracted.post.content.repository'

/* Repositories */
import { Readable, Repository } from './shared/core/repository'

interface Env {
  timer: DeployTimer
  covers: Repository<PostCover>
  posts: Repository<Post>
  props: Readable<Repository<ExtractedPostProps>>
  contents: Readable<Repository<ExtractedPostContent>>
}

export const routes = ({
  covers,
  posts,
  timer,
  props,
  contents,
}: Env): Route[] => [
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
    env: { timer, posts, props, contents },
  }),
]
