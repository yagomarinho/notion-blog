import { Service } from '../../../shared/core/service'
import { Query, Readable, Repository } from '../../../shared/core/repository'
import { Left, Right } from '../../../shared/core/either'
import { Post } from '../entities/post'
import { ExtractedPostProps } from '../repositories/extracted.post.props.repository'
import { ExtractedPostContent } from '../repositories/extracted.post.content.repository'
import { decideIntent } from '../helpers/decide.intent'

interface Request {
  id: string
}

interface Env {
  posts: Repository<Post>
  props: Readable<Repository<ExtractedPostProps>>
  contents: Readable<Repository<ExtractedPostContent>>
}

export const ETLPostData = Service<Request, Env, void>(
  ({ id }) =>
    async ({ posts, props, contents }) => {
      const [properties, content, exists] = await Promise.all([
        props.get(id),
        contents.get(id),
        posts.query(Query.where('external_ref', '==', id)),
      ])

      const [post] = exists
      const intent = decideIntent({ properties, content, post })

      if (intent.kind === 'none') return Left({ message: 'intent.kind none' })
      else if (intent.kind === 'remove') await posts.remove(intent.data)
      else if (intent.kind === 'upsert') await posts.set(intent.data)

      return Right()
    },
)
