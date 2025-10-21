import { isRight } from '../../../shared/core/either'
import { Handler } from '../../../shared/core/handler'
import { Queryable, Repository } from '../../../shared/core/repository'
import { Response } from '../../../shared/core/response'
import { PostCover } from '../entities/post.cover'
import { getPostList } from '../services/get.post.list'

interface Env {
  covers: Queryable<Repository<PostCover>>
}

export const getPostListHandler = Handler(() => async ({ covers }: Env) => {
  const result = await getPostList()({ covers })

  if (isRight(result)) return Response.ok(result.value)

  return Response({ status: 400, body: result.value })
})
