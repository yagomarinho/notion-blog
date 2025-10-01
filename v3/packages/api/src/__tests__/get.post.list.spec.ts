import { getPostList } from '../services/get.post.list'
import { Client } from '@notionhq/client'
import { createPage } from './fakes/page'

jest.mock('@notionhq/client', () => {
  const mockQuery = jest.fn()
  const MockClient = jest.fn().mockImplementation(() => ({
    dataSources: {
      query: mockQuery,
    },
  }))

  ;(MockClient as any).__mockQuery = mockQuery
  return { Client: MockClient }
})

export const notionhqMock = (Client as unknown as any).__mockQuery as jest.Mock

describe('get post list', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...OLD_ENV }
    process.env.NOTION_AUTH_TOKEN = 'test-token'
    process.env.NOTION_COLLECTION_ID = 'collection-123'
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it('usa filtro published=true em produção', async () => {
    process.env.NODE_ENV = 'production'

    const results = [
      createPage({}),
      createPage({ id: 'trash', in_trash: true }),
      createPage({ id: 'not-page', object: 'database' }),
      createPage({ id: 'missing-props', withProps: false }),
    ]

    notionhqMock.mockResolvedValueOnce({ results })

    const list = await getPostList()

    expect(Client).toHaveBeenCalledWith({ auth: 'test-token' })

    expect(notionhqMock).toHaveBeenCalledWith({
      data_source_id: 'collection-123',
      filter: {
        property: 'published',
        checkbox: { equals: true },
      },
      sorts: [{ property: 'updated_at', direction: 'descending' }],
      page_size: 10,
    })

    expect(list).toHaveLength(2)

    expect(list[0]).toEqual({
      slug: 'my-slug',
      title: 'My Title',
      description: 'My Description',
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    })

    expect(list[1]).toEqual({
      slug: '',
      title: '',
      description: '',
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    })
  })

  it('omite o filtro quando NODE_ENV !== production', async () => {
    process.env.NODE_ENV = 'development'

    const results = [createPage({})]

    notionhqMock.mockResolvedValueOnce({ results })

    const list = await getPostList()

    expect(notionhqMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data_source_id: 'collection-123',
        filter: undefined,
        sorts: [{ property: 'updated_at', direction: 'descending' }],
        page_size: 10,
      }),
    )

    expect(list).toEqual([
      {
        slug: 'my-slug',
        title: 'My Title',
        description: 'My Description',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      },
    ])
  })

  it('tolera propriedades aninhadas ausentes (rich_text/title vazios)', async () => {
    process.env.NODE_ENV = 'production'

    const edge: any = createPage({})

    edge.properties.slug.rich_text = []
    edge.properties.title.title = []
    edge.properties.description.rich_text = []

    notionhqMock.mockResolvedValueOnce({ results: [edge] })

    const list = await getPostList()

    expect(list[0]).toMatchObject({
      slug: '',
      title: '',
      description: '',
    })
  })

  it('retorna lista vazia quando não há páginas válidas', async () => {
    process.env.NODE_ENV = 'production'

    notionhqMock.mockResolvedValueOnce({
      results: [
        createPage({ object: 'database' }),
        createPage({ in_trash: true }),
      ],
    })

    const list = await getPostList()

    expect(list).toEqual([])
  })
})
