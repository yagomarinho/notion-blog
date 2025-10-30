import { isLeft } from '../../../shared/core/either'
import { Handler } from '../../../shared/core/handler'
import {
  Queryable,
  Readable,
  Repository,
} from '../../../shared/core/repository'
import { Response } from '../../../shared/core/response'
import { Post } from '../entities/post'
import { PostCover } from '../repositories/post.cover.repository'
import { getPostData } from '../services/get.post.data'
import { getPostIdWithSlug } from '../services/get.post.id.with.slug'

interface Env {
  posts: Readable<Repository<Post>>
  covers: Queryable<Repository<PostCover>>
}

export const getPostDataHandler = Handler(
  request =>
    async ({ covers, posts }: Env) => {
      const { slug } = request.ctx.params

      const r1 = await getPostIdWithSlug({ slug })({ covers })

      if (isLeft(r1))
        return Response({ status: 400, body: { message: 'Bad request' } })

      const r2 = await getPostData({ id: r1.value })({ posts })

      if (isLeft(r2))
        return Response({ status: 404, body: { message: 'Post not found' } })

      return Response.ok(r2.value)
    },
)
