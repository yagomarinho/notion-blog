import request from 'supertest'
import { Client } from '@notionhq/client'
import { Vercel } from '@vercel/sdk'
import { NotionAPI } from 'notion-client'

import { App } from '../app'
import { createPage } from './fakes/page'
import { extractPropertiesFromRecordMap } from '../utils/extract.properties.from.record.map'
import { verifySignature } from '../utils/verify.signature'

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

const notionhqMock = (Client as unknown as any).__mockQuery as jest.Mock

jest.mock('notion-client', () => {
  const getPage = jest.fn()
  const MockNotionAPI = jest.fn().mockImplementation(() => ({
    getPage,
  }))

  ;(MockNotionAPI as any).__getPage = getPage
  return { NotionAPI: MockNotionAPI }
})

const notionClientMock = (NotionAPI as unknown as any).__getPage as jest.Mock

jest.mock('@vercel/sdk', () => {
  const createDeployment = jest.fn()
  const MockVercel = jest.fn().mockImplementation(() => ({
    deployments: { createDeployment },
  }))

  ;(MockVercel as any).__createDeployment = createDeployment
  return { Vercel: MockVercel }
})

const vercelSdkMock = (Vercel as unknown as any).__createDeployment as jest.Mock

jest.mock('../utils/extract.properties.from.record.map', () => ({
  extractPropertiesFromRecordMap: jest.fn(),
}))

const mockExtract = extractPropertiesFromRecordMap as jest.Mock

jest.mock('../utils/verify.signature', () => ({
  verifySignature: jest.fn(),
}))

const mockVerifySignature = verifySignature as jest.Mock

function setPublished(value: any) {
  mockExtract.mockReturnValue({ published: [[value]] })
}

function setVerification(bool: boolean) {
  mockVerifySignature.mockReturnValue(bool)
}

describe('application tests', () => {
  const OLD_ENV = { ...process.env }
  const collectionId = 'collection-123'
  const app = App()

  beforeAll(() => {
    process.env.NODE_ENV = 'production'
    process.env.NOTION_COLLECTION_ID = collectionId
    process.env.DEFAULT_TIME_DEPLOY_CLOCK = '1'
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be able to request a post list', async () => {
    const results = [
      createPage({}),
      createPage({ id: 'trash', in_trash: true }),
      createPage({ id: 'not-page', object: 'database' }),
      createPage({ id: 'missing-props', withProps: false }),
    ]

    notionhqMock.mockResolvedValueOnce({ results })

    const response = await request(app).get('/posts')

    expect(response.status).toBe(200)

    const list = response.body

    expect(list instanceof Array).toBeTruthy()
    expect(list.length).toBe(2)
    expect(list[0]).toEqual({
      slug: 'my-slug',
      title: 'My Title',
      description: 'My Description',
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
    expect(list[1]).toEqual({
      slug: '',
      title: '',
      description: '',
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  })

  it('should be able to get a post data', async () => {
    const pageId = 'page-123'
    const slug = 'my-slug'
    const recordMap = { blocks: { [pageId]: {} } } as any

    notionhqMock.mockResolvedValue({
      results: [createPage({ id: pageId, slug, withProps: true })],
    })

    notionClientMock.mockResolvedValueOnce(recordMap)
    setPublished('yes')

    const response = await request(app).get(`/post/${slug}`)
    expect(response.status).toBe(200)

    const data = response.body
    expect(data).toEqual({
      recordMap,
      properties: { published: [['yes']] },
    })
  })

  it('should be able to post a webhook event', async () => {
    vercelSdkMock.mockResolvedValueOnce({ id: 'dep_123', status: 'READY' })

    setVerification(true)

    const response = await request(app)
      .post('/posts/webhooks/notion')
      .set('X-Notion-Signature', 'bearer token')
      .send({
        type: 'page.properties_updated',
        data: { parent: { data_source_id: collectionId } },
      })

    expect(response.status).toBe(201)
  })

  afterAll(() => {
    process.env = OLD_ENV
  })
})
