import { isLeft, isRight } from '../../../../shared/core/either'
import { InMemoryRepository } from '../../../../shared/repositories/in.memory.repository'
import { Post } from '../../entities/post'
import { getPostIdWithSlug } from '../get.post.id.with.slug'

const posts = InMemoryRepository<Post>()

posts.set(
  Post.create({
    id: 'post-1',
    slug: 'my-slug',
    title: 'title',
    description: 'description',
    published: true,
  }),
)

describe('get post id with slug', () => {
  const OLD_ENV = { ...process.env }

  afterEach(() => {
    process.env = { ...OLD_ENV }
  })

  it('instancia Client com auth token e chama dataSources.query corretamente', async () => {
    const result = await getPostIdWithSlug({ slug: 'my-slug' })({ posts })

    expect(isRight(result)).toBeTruthy()

    expect(result.value).toBe('post-1')
  })

  it('retorna undefined quando não há resultados', async () => {
    const result = await getPostIdWithSlug({ slug: 'not-found' })({ posts })

    expect(isLeft(result)).toBeTruthy()

    expect(result.value).toEqual({ message: 'post not found' })
  })
})
