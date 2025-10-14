import { isLeft } from '../../../shared/core/either'
import { Handler } from '../../../shared/core/handler'
import {
  Queryable,
  Readable,
  Repository,
} from '../../../shared/core/repository'
import { Response } from '../../../shared/core/response'
import { ExtendedNotionPage } from '../../../shared/repositories/notion.client.repository'
import { Post } from '../entities/post'
import { getPostData } from '../services/get.post.data'
import { getPostIdWithSlug } from '../services/get.post.id.with.slug'

interface Env {
  pages: Readable<Repository<ExtendedNotionPage<Post>>>
  posts: Queryable<Repository<Post>>
}

export const getPostDataHandler = Handler(
  request =>
    async ({ pages, posts }: Env) => {
      const { slug } = request.ctx.params

      const r1 = await getPostIdWithSlug({ slug })({ posts })

      if (isLeft(r1))
        return Response({ status: 400, body: { message: 'Bad request' } })

      const r2 = await getPostData({ id: r1.value })({ pages })

      if (isLeft(r2))
        return Response({ status: 404, body: { message: 'Post not found' } })

      return Response.ok(r2.value)
    },
)
