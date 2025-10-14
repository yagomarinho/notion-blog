import { Service } from '../../../shared/core/service'
import { Query, Queryable, Repository } from '../../../shared/core/repository'
import { Post } from '../entities/post'
import { Left, Right } from '../../../shared/core/either'

interface Request {
  slug: string
}
interface Env {
  posts: Queryable<Repository<Post>>
}

export const getPostIdWithSlug = Service(
  ({ slug }: Request) =>
    async ({ posts }: Env) => {
      const result = await posts.query(Query.where('slug', '==', slug))

      const [page] = result

      if (!page) return Left({ message: 'post not found' })

      return Right(page.id)
    },
)
