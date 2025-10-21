import { Right } from '../../../shared/core/either'
import { Query, Queryable, Repository } from '../../../shared/core/repository'
import { Service } from '../../../shared/core/service'
import { PostCover } from '../entities/post.cover'

interface Env {
  covers: Queryable<Repository<PostCover>>
}

export const getPostList = Service(() => async ({ covers }: Env) => {
  const base = Query.sorts(
    [
      { property: 'publish_at', direction: 'desc' },
      { property: 'updated_at', direction: 'desc' },
    ],
    Query.limit<PostCover>(10),
  )
  let q = Query.where<PostCover>('published', '==', true, base)

  if (process.env.NODE_ENV !== 'production') q = base

  const elements = await covers.query(q)

  return Right(elements)
})
