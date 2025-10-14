import { isRight } from '../../../../shared/core/either'
import { InMemoryRepository } from '../../../../shared/repositories/in.memory.repository'
import { Post } from '../../entities/post'
import { getPostList } from '../get.post.list'

const repository: Post[] = [
  Post.create({
    slug: 'slug-1',
    title: 'title-1',
    description: 'desc-1',
    published: true,
  }),
  Post.create({
    slug: 'slug-4',
    title: 'title-4',
    description: 'desc-4',
    published: true,
  }),
  Post.create({
    slug: 'slug-2',
    title: 'title-2',
    description: 'desc-2',
    published: false,
  }),
  Post.create({
    slug: 'slug-3',
    title: 'title-3',
    description: 'desc-3',
    published: false,
  }),
]

const posts = InMemoryRepository<Post>()

repository.map(p => posts.set(p))

describe('get post list', () => {
  const OLD_ENV = { ...process.env }

  afterEach(() => {
    process.env = { ...OLD_ENV }
  })

  it('usa filtro published=true em produção', async () => {
    process.env.NODE_ENV = 'production'

    const result = await getPostList()({ posts })

    expect(isRight(result)).toBeTruthy()

    const list = result.value

    expect(list).toHaveLength(2)

    expect(list[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        slug: 'slug-1',
        title: 'title-1',
        description: 'desc-1',
        published: true,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )

    expect(list[1]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        slug: 'slug-4',
        title: 'title-4',
        description: 'desc-4',
        published: true,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )
  })

  it('omite o filtro quando NODE_ENV !== production', async () => {
    process.env.NODE_ENV = 'development'

    const result = await getPostList()({ posts })

    expect(isRight(result)).toBeTruthy()

    const list: any = result.value

    expect(list.length).toBe(4)
  })

  it('retorna lista vazia quando não há páginas válidas', async () => {
    process.env.NODE_ENV = 'production'

    const result = await getPostList()({
      posts: InMemoryRepository({
        repository: [
          Post.create({
            slug: 'slug-2',
            title: 'title-2',
            description: 'desc-2',
            published: false,
          }),
          Post.create({
            slug: 'slug-3',
            title: 'title-3',
            description: 'desc-3',
            published: false,
          }),
        ],
      }),
    })

    expect(isRight(result)).toBeTruthy()

    const list = result.value

    expect(list).toEqual([])
  })
})
