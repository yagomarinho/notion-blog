import { MongoClient } from 'mongodb'
import { PostCoverRepository } from './modules/blog.post/repositories/post.cover.repository'
import { PostRepository } from './modules/blog.post/repositories/post.repository'
import { DeployTimer } from './shared/utils/deploy.timer'
import config from './config'
import { ExtractedPostPropsRepository } from './modules/blog.post/repositories/extracted.post.props.repository'
import { ExtractedPostContentRepository } from './modules/blog.post/repositories/extracted.post.content.repository'
import { ETLReconciler } from './modules/blog.post/services/etl.reconciler'
import { isLeft } from './shared/core/either'

export const Env = async () => {
  const timer = DeployTimer()

  // Instanciando o mesmo MongoClient para os repositórios
  const client = new MongoClient(config.databases.post.uri)
  const covers = PostCoverRepository({ client })
  const posts = PostRepository({ client })

  const props = ExtractedPostPropsRepository()
  const contents = ExtractedPostContentRepository()

  await covers.connect()
  await posts.connect()

  const result = await ETLReconciler()({ contents, posts, props })

  // eslint-disable-next-line no-console
  if (isLeft(result)) console.log(result.value.message)

  return {
    timer,
    covers,
    posts,
    props,
    contents,
  }
}
