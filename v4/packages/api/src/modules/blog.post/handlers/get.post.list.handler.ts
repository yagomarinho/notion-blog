import { isRight } from '../../../shared/core/either'
import { Handler } from '../../../shared/core/handler'
import { Queryable, Repository } from '../../../shared/core/repository'
import { Response } from '../../../shared/core/response'
import { Post } from '../entities/post'
import { getPostList } from '../services/get.post.list'

interface Env {
  posts: Queryable<Repository<Post>>
}

export const getPostListHandler = Handler(() => async ({ posts }: Env) => {
  const result = await getPostList()({ posts })

  if (isRight(result)) return Response.ok(result.value)

  return Response({ status: 400, body: result.value })
})
