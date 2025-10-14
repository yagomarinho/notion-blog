import { Service } from '../../../shared/core/service'
import { Readable, Repository } from '../../../shared/core/repository'
import { ExtendedNotionPage } from '../../../shared/repositories/notion.client.repository'
import { Post } from '../entities/post'
import { Left, Right } from '../../../shared/core/either'

interface Request {
  id: string
}

interface Env {
  pages: Readable<Repository<ExtendedNotionPage<Post>>>
}

export const getPostData = Service(
  ({ id }: Request) =>
    async ({ pages }: Env) => {
      const page = await pages.get(id)

      if (!page) return Left({ message: 'page not found' })

      if (process.env.NODE_ENV !== 'production') return Right(page)

      if (!page.published) return Left({ message: 'page not found' })

      return Right(page)
    },
)
