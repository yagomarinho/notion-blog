import { Right } from '../../../shared/core/either'
import { Query, Queryable, Repository } from '../../../shared/core/repository'
import { Service } from '../../../shared/core/service'
import { Post } from '../entities/post'

interface Env {
  posts: Queryable<Repository<Post>>
}

export const getPostList = Service(() => async ({ posts }: Env) => {
  const base = Query.sorts(
    [{ property: 'updated_at', direction: 'desc' }],
    Query.limit<Post>(10),
  )
  let q = Query.where<Post>('published', '==', true, base)

  if (process.env.NODE_ENV !== 'production') q = base

  const elements = await posts.query(q)

  return Right(elements)
})
