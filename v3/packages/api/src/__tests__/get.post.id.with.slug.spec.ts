import { getPostIdWithSlug } from '../services/get.post.id.with.slug'
import { Client } from '@notionhq/client'

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

describe('get post id with slug', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...OLD_ENV }
    process.env.NOTION_AUTH_TOKEN = 'token-123'
    process.env.NOTION_COLLECTION_ID = 'collection-xyz'
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it('instancia Client com auth token e chama dataSources.query corretamente', async () => {
    notionhqMock.mockResolvedValueOnce({ results: [{ id: 'page-1' }] })

    const id = await getPostIdWithSlug({ slug: 'my-slug' })

    expect(Client).toHaveBeenCalledWith({ auth: 'token-123' })

    expect(notionhqMock).toHaveBeenCalledWith({
      data_source_id: 'collection-xyz',
      filter: {
        property: 'slug',
        rich_text: { equals: 'my-slug' },
      },
    })

    expect(id).toBe('page-1')
  })

  it('retorna undefined quando não há resultados', async () => {
    notionhqMock.mockResolvedValueOnce({ results: [] })

    const id = await getPostIdWithSlug({ slug: 'not-found' })

    expect(id).toBeUndefined()
  })

  it('retorna undefined quando query não retorna objeto válido', async () => {
    notionhqMock.mockResolvedValueOnce(undefined)

    const id = await getPostIdWithSlug({ slug: 'invalid' })

    expect(id).toBeUndefined()
  })

  it('retorna id da primeira página quando múltiplos resultados', async () => {
    notionhqMock.mockResolvedValueOnce({
      results: [{ id: 'page-1' }, { id: 'page-2' }],
    })

    const id = await getPostIdWithSlug({ slug: 'multi' })

    expect(id).toBe('page-1')
  })
})
