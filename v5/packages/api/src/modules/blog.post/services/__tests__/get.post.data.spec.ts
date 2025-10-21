import { getPostData } from '../get.post.data'
import { InMemoryRepository } from '../../../../shared/repositories/in.memory.repository'
import { Post } from '../../entities/post'

import { ExtendedRecordMap } from 'notion-types'
import { isLeft, isRight } from '../../../../shared/core/either'

const PAGE_ID = 'f0b05891-ce0f-4175-8d71-93878e590806'
const PAGE_ID2 = '228db688-7a82-4c6b-8999-700b54d565ed'
const NON_EXISTANT_PAGE_ID = 'e3c0a0be-26a2-4281-b76c-0849ab3ce654'

const COLLECTION_ID = '5345d05c-8554-468c-b5e4-ab80332a1c7f'

const posts = InMemoryRepository<Post>()

const recordMap: ExtendedRecordMap = {
  block: {
    [PAGE_ID]: {
      role: 'reader',
      value: {
        id: PAGE_ID,
        type: 'text',
        parent_id: 'page_id_123',
        parent_table: 'block',
        properties: {
          title: [['title']],
          slug: [['my-slug']],
          description: [['description']],
          published: [['no']],
        },
        format: {},
        created_time: 1727362380000,
        last_edited_time: 1727362390000,
        alive: true,
      },
    },
    block_id_2: {},
  },
  collection: {
    [COLLECTION_ID]: {
      role: 'reader',
      value: {
        id: COLLECTION_ID,
        name: [['Tasks']],
        schema: {
          title: { name: 'Name', type: 'title' },
          status: { name: 'Status', type: 'select' },
        },
        parent_id: 'page_id_123',
        parent_table: 'block',
        alive: true,
      },
    },
  },
  collection_view: {
    view_id_abc: {
      role: 'reader',
      value: {
        id: 'view_id_abc',
        type: 'table',
        name: 'Default view',
        format: {},
        query: {},
      },
    },
  },
  notion_user: {
    user_id_xyz: {
      role: 'reader',
      value: {
        id: 'user_id_xyz',
        email: 'user@example.com',
        given_name: 'John',
        family_name: 'Doe',
      },
    },
  },
  space: {
    space_id_123: {
      role: 'reader',
      value: {
        id: 'space_id_123',
        name: 'Workspace Name',
        domain: 'workspace',
      },
    },
  },
} as any

jest.mock('notion-client', () => {
  const getPage = jest.fn()
  const MockNotionAPI = jest.fn().mockImplementation(() => ({
    getPage,
  }))

  ;(MockNotionAPI as any).__getPage = getPage
  return { NotionAPI: MockNotionAPI }
})

const p1 = Post.create({
  id: PAGE_ID,
  title: 'page-1',
  slug: 'slug-1',
  description: 'desc-1',
  content: recordMap,
  published: true,
})

const p2 = Post.create({
  id: PAGE_ID2,
  title: 'page-2',
  slug: 'slug-2',
  description: 'desc-2',
  content: recordMap,
  published: false,
})

posts.set(p1)
posts.set(p2)

describe('get post data', () => {
  const OLD_ENV = { ...process.env }

  afterEach(() => {
    process.env = { ...OLD_ENV }
  })

  it('should be able to get a post data', async () => {
    process.env.NODE_ENV = 'production'

    const result = await getPostData({ id: PAGE_ID })({ posts })

    expect(isRight(result)).toBeTruthy()

    const data = result.value

    expect(data).toEqual(
      expect.objectContaining({
        ...p1,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )
  })

  it('should be able to return a unpublished post in no-production environment', async () => {
    process.env.NODE_ENV = 'development'

    const result = await getPostData({ id: PAGE_ID2 })({ posts })

    expect(isRight(result)).toBeTruthy()

    const data = result.value
    expect(data).toEqual(
      expect.objectContaining({
        ...p2,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )
  })

  it('should not be able to return a unpublished post in production environment', async () => {
    process.env.NODE_ENV = 'production'

    const result = await getPostData({ id: PAGE_ID2 })({ posts })

    expect(isLeft(result)).toBeTruthy()
  })

  it('should not be able to return a non-existant post', async () => {
    const result = await getPostData({ id: NON_EXISTANT_PAGE_ID })({ posts })

    expect(isLeft(result)).toBeTruthy()
  })
})
