import { isLeft, isRight } from '../../../../shared/core/either'
import { applyTag } from '../../../../shared/core/tagged'
import { InMemoryRepository } from '../../../../shared/repositories/in.memory.repository'
import { PostCover } from '../../repositories/post.cover.repository'
import { getPostIdWithSlug } from '../get.post.id.with.slug'

const covers = InMemoryRepository<PostCover>()

covers.set(
  applyTag('post')({
    id: 'post-1',
    slug: 'my-slug',
    title: 'title',
    description: 'description',
    published: true,
    estimated_readtime: 60,
    tags: ['nodejs'],
    created_at: new Date(),
    updated_at: new Date(),
  }),
)

describe('get post id with slug', () => {
  const OLD_ENV = { ...process.env }

  afterEach(() => {
    process.env = { ...OLD_ENV }
  })

  it('instancia Client com auth token e chama dataSources.query corretamente', async () => {
    const result = await getPostIdWithSlug({ slug: 'my-slug' })({ covers })

    expect(isRight(result)).toBeTruthy()

    expect(result.value).toBe('post-1')
  })

  it('retorna undefined quando não há resultados', async () => {
    const result = await getPostIdWithSlug({ slug: 'not-found' })({ covers })

    expect(isLeft(result)).toBeTruthy()

    expect(result.value).toEqual({ message: 'post not found' })
  })
})
