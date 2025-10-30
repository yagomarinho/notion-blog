import request from 'supertest'

import { Application } from '../shared/app/application'
import { verifySignature } from '../shared/utils/verify.signature'
import { routes } from '../routes'

import { InMemoryRepository } from '../shared/repositories/in.memory.repository'
import { PostCover } from '../modules/blog.post/repositories/post.cover.repository'
import { Post } from '../modules/blog.post/entities/post'
import { ExtractedPostProps } from '../modules/blog.post/repositories/extracted.post.props.repository'
import { ExtractedPostContent } from '../modules/blog.post/repositories/extracted.post.content.repository'
import { createContent } from './fakes/create.content'
import { createProps } from './fakes/create.props'

jest.mock('notion-client', () => {
  const getPage = jest.fn()
  const MockNotionAPI = jest.fn().mockImplementation(() => ({
    getPage,
  }))

  ;(MockNotionAPI as any).__getPage = getPage
  return { NotionAPI: MockNotionAPI }
})

jest.mock('../shared/utils/verify.signature', () => ({
  verifySignature: jest.fn(),
}))

const mockVerifySignature = verifySignature as jest.Mock

function setVerification(bool: boolean) {
  mockVerifySignature.mockReturnValue(bool)
}

describe('application tests', () => {
  const OLD_ENV = { ...process.env }
  const collectionId = 'collection-123'
  const content: any = {}

  const env = {
    covers: InMemoryRepository<PostCover>(),
    posts: InMemoryRepository<Post>(),
    props: InMemoryRepository<ExtractedPostProps>(),
    contents: InMemoryRepository<ExtractedPostContent>(),
    timer: { deploy: jest.fn(), clear: jest.fn() },
  }

  const app = Application({ routes: routes(env) }).exposeApp()

  beforeAll(async () => {
    process.env.NODE_ENV = 'production'
    process.env.NOTION_COLLECTION_ID = collectionId
    process.env.DEFAULT_TIME_DEPLOY_CLOCK = '1'
    process.env.API_ACCESS_TOKEN = 'token-123'
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be able to request a post list', async () => {
    const p1 = Post.create({
      slug: 'slug-1',
      title: 'title-1',
      description: 'desc-1',
      published: true,
      publish_at: new Date(Date.now() - 60),
      estimated_readtime: 5,
      external_ref: '',
      content,
    })

    const p2 = Post.create({
      slug: 'slug-2',
      title: 'title-2',
      description: 'desc-2',
      published: false,
      estimated_readtime: 5,
      publish_at: new Date(Date.now() - 65),
      external_ref: '',
      content,
    })

    const p3 = Post.create({
      slug: 'slug-3',
      title: 'title-3',
      description: 'desc-3',
      published: false,
      estimated_readtime: 5,
      publish_at: new Date(Date.now() - 70),
      external_ref: '',
      content,
    })

    const p4 = Post.create({
      slug: 'slug-4',
      title: 'title-4',
      description: 'desc-4',
      published: true,
      estimated_readtime: 55,
      publish_at: new Date(Date.now() - 75),
      external_ref: '',
      content,
    })

    env.covers.set(p1)
    env.covers.set(p2)
    env.covers.set(p3)
    env.covers.set(p4)

    const response = await request(app)
      .get('/posts')
      .set('Authorization', `Bearer ${process.env.API_ACCESS_TOKEN}`)

    expect(response.status).toBe(200)

    const list = response.body

    expect(list instanceof Array).toBeTruthy()
    expect(list.length).toBe(2)
    expect(list[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        slug: p1.slug,
        title: p1.title,
        description: p1.description,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    )
    expect(list[1]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        slug: p4.slug,
        title: p4.title,
        description: p4.description,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    )
  })

  it('should be able to get a post data', async () => {
    const p1 = Post.create({
      slug: 'slug-1',
      title: 'title-1',
      description: 'desc-1',
      published: true,
      publish_at: new Date(Date.now() - 60),
      estimated_readtime: 5,
      external_ref: '',
      content,
    })

    const p2 = Post.create({
      slug: 'slug-2',
      title: 'title-2',
      description: 'desc-2',
      published: false,
      estimated_readtime: 5,
      publish_at: new Date(Date.now() - 65),
      external_ref: '',
      content,
    })

    const p3 = Post.create({
      slug: 'slug-3',
      title: 'title-3',
      description: 'desc-3',
      published: false,
      estimated_readtime: 5,
      publish_at: new Date(Date.now() - 70),
      external_ref: '',
      content,
    })

    const p4 = Post.create({
      slug: 'slug-4',
      title: 'title-4',
      description: 'desc-4',
      published: true,
      estimated_readtime: 55,
      publish_at: new Date(Date.now() - 75),
      external_ref: '',
      content,
    })

    env.posts.set(p1)
    env.posts.set(p2)
    env.posts.set(p3)
    env.posts.set(p4)

    const slug = 'slug-4'
    const response = await request(app)
      .get(`/post/${slug}`)
      .set('Authorization', `Bearer ${process.env.API_ACCESS_TOKEN}`)

    expect(response.status).toBe(200)

    const data = response.body
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        published: true,
        content,
      }),
    )

    const slug2 = 'slug-2'
    const response2 = await request(app)
      .get(`/post/${slug2}`)
      .set('Authorization', `Bearer ${process.env.API_ACCESS_TOKEN}`)

    expect(response2.status).toBe(404)
  })

  it('should be able to post a webhook event', async () => {
    setVerification(true)

    const post = Post.create({
      slug: 'slug-1',
      title: 'title-1',
      description: 'desc-1',
      published: true,
      publish_at: new Date(Date.now() - 60),
      estimated_readtime: 5,
      external_ref: 'external_ref-id',
      content,
    })

    const newContent = createContent({
      id: post.external_ref,
      content,
    })

    const newProps = createProps({
      id: post.external_ref,
      slug: 'updated_slug',
      title: 'updated_title',
      description: 'updated_description',
      published: true,
      publish_at: new Date(),
      created_at: post.created_at,
    })

    await Promise.all([
      env.posts.set(post),
      env.props.set(newProps),
      env.contents.set(newContent),
    ])

    const response = await request(app)
      .post('/posts/webhooks/notion')
      .set('X-Notion-Signature', 'bearer token')
      .set('Authorization', `Bearer ${process.env.API_ACCESS_TOKEN}`)
      .send({
        id: post.external_ref,
        type: 'page.properties_updated',
        data: { parent: { data_source_id: collectionId } },
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ handled: true })
    expect(env.timer.deploy).toHaveBeenCalled()
  })

  afterAll(() => {
    process.env = OLD_ENV
  })
})
