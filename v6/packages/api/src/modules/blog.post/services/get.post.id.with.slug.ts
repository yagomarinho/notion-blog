import { Service } from '../../../shared/core/service'
import { Query, Queryable, Repository } from '../../../shared/core/repository'
import { Left, Right } from '../../../shared/core/either'
import { PostCover } from '../repositories/post.cover.repository'

interface Request {
  slug: string
}
interface Env {
  covers: Queryable<Repository<PostCover>>
}

export const getPostIdWithSlug = Service(
  ({ slug }: Request) =>
    async ({ covers }: Env) => {
      const result = await covers.query(Query.where('slug', '==', slug))

      const [page] = result

      if (!page) return Left({ message: 'post not found' })

      return Right(page.id)
    },
)
