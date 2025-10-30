import { Service } from '../../../shared/core/service'
import { Readable, Repository } from '../../../shared/core/repository'
import { Left, Right } from '../../../shared/core/either'
import { Post } from '../entities/post'

interface Request {
  id: string
}

interface Env {
  posts: Readable<Repository<Post>>
}

export const getPostData = Service(
  ({ id }: Request) =>
    async ({ posts }: Env) => {
      const page = await posts.get(id)

      if (!page) return Left({ message: 'page not found' })

      if (process.env.NODE_ENV !== 'production') return Right(page)

      if (!page.published) return Left({ message: 'page not found' })

      return Right(page)
    },
)
