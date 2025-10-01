import { NotionAPI } from 'notion-client'

import { getPostData } from '../services/get.post.data'
import { extractPropertiesFromRecordMap } from '../utils/extract.properties.from.record.map'

jest.mock('notion-client', () => {
  const getPage = jest.fn()
  const MockNotionAPI = jest.fn().mockImplementation(() => ({
    getPage,
  }))

  ;(MockNotionAPI as any).__getPage = getPage
  return { NotionAPI: MockNotionAPI }
})

export const notionClientMock = (NotionAPI as unknown as any)
  .__getPage as jest.Mock

jest.mock('../utils/extract.properties.from.record.map', () => ({
  extractPropertiesFromRecordMap: jest.fn(),
}))

const mockExtract = extractPropertiesFromRecordMap as jest.Mock

function setPublished(value: any) {
  mockExtract.mockReturnValue({ published: [[value]] })
}

describe('get post data', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...OLD_ENV }
    process.env.NOTION_API_AUTH_V2 = 'auth-v2-token'
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  const pageId = 'page-123'
  const recordMap = { blocks: { [pageId]: {} } } as any

  it('should be able to get a post data', async () => {
    process.env.NODE_ENV = 'development'

    notionClientMock.mockResolvedValueOnce(recordMap)

    setPublished('yes')

    const res = await getPostData({ pageId })

    expect(NotionAPI).toHaveBeenCalledWith({
      authToken: 'auth-v2-token',
    })
    expect(notionClientMock).toHaveBeenCalledWith(pageId)
    expect(res).toEqual({
      recordMap,
      properties: { published: [['yes']] },
    })
  })

  it('should be able to return a unpublished post in no-production environment', async () => {
    process.env.NODE_ENV = 'test'

    notionClientMock.mockResolvedValueOnce(recordMap)

    setPublished('no')

    const res = await getPostData({ pageId })

    expect(res).toEqual({
      recordMap,
      properties: { published: [['no']] },
    })
  })

  it('should not be able to return a unpublished post in production environment', async () => {
    process.env.NODE_ENV = 'production'

    notionClientMock.mockResolvedValueOnce(recordMap)

    setPublished('No')

    const res = await getPostData({ pageId })

    expect(res).toBeUndefined()
  })

  it('should not be able to return a unpublished post in production environment with boolean arg', async () => {
    process.env.NODE_ENV = 'production'

    notionClientMock.mockResolvedValueOnce(recordMap)

    setPublished(false)

    const res = await getPostData({ pageId })

    expect(res).toBeUndefined()
  })

  it('should be able to return a published post in production environment with "yes" arg', async () => {
    process.env.NODE_ENV = 'production'

    notionClientMock.mockResolvedValueOnce(recordMap)

    setPublished('yes')

    const res = await getPostData({ pageId })

    expect(res).toEqual({
      recordMap,
      properties: { published: [['yes']] },
    })
  })

  it('should be able to return a published post in production environment with boolean arg', async () => {
    process.env.NODE_ENV = 'production'

    notionClientMock.mockResolvedValueOnce(recordMap)

    setPublished(true)

    const res = await getPostData({ pageId })

    expect(res).toEqual({
      recordMap,
      properties: { published: [[true]] },
    })
  })
})
