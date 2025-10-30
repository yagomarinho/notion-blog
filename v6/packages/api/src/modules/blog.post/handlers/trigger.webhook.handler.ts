import type { DeployTimer } from '../../../shared/utils/deploy.timer'
import { Handler } from '../../../shared/core/handler'
import { Response } from '../../../shared/core/response'
import { Readable, Repository } from '../../../shared/core/repository'
import { ExtractedPostProps } from '../repositories/extracted.post.props.repository'
import { ExtractedPostContent } from '../repositories/extracted.post.content.repository'
import { Post } from '../entities/post'
import { ETLPostData } from '../services/etl.post.data'
import { isLeft } from '../../../shared/core/either'

interface Env {
  props: Readable<Repository<ExtractedPostProps>>
  contents: Readable<Repository<ExtractedPostContent>>
  posts: Repository<Post>
  timer: DeployTimer
}

export const triggerWebhookHandler = Handler<Env>(request => async env => {
  const { body } = request

  const { id, type, data } = body

  if (type !== 'page.properties_updated')
    return Response({ status: 200, body: { handled: false } })

  if (data.parent?.data_source_id !== process.env.NOTION_COLLECTION_ID)
    return Response({ status: 200, body: { handled: false } })

  const result = await ETLPostData({ id })(env)

  if (isLeft(result)) return Response({ status: 200, body: { handled: false } })

  env.timer.deploy()

  return Response({ status: 200, body: { handled: true } })
})
