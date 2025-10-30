import { ExtendedRecordMap } from 'notion-types'

import { Query, Repository } from '../../../../shared/core/repository'
import { InMemoryRepository } from '../../../../shared/repositories/in.memory.repository'

import { Post } from '../../entities/post'
import { ETLPostData } from '../etl.post.data'
import { ExtractedPostProps } from '../../repositories/extracted.post.props.repository'
import { ExtractedPostContent } from '../../repositories/extracted.post.content.repository'

/* Fakes */
import { createProps } from '../../../../__tests__/fakes/create.props'
import { createContent } from '../../../../__tests__/fakes/create.content'

jest.mock('notion-client', () => {
  const getPage = jest.fn()
  const MockNotionAPI = jest.fn().mockImplementation(() => ({
    getPage,
  }))

  ;(MockNotionAPI as any).__getPage = getPage
  return { NotionAPI: MockNotionAPI }
})

describe('ETLPostData (InMemoryRepository)', () => {
  let posts: Repository<Post>
  let props: Repository<ExtractedPostProps>
  let contents: Repository<ExtractedPostContent>
  let run: (id: string) => any

  beforeEach(() => {
    jest.clearAllMocks()

    posts = InMemoryRepository<any>()
    props = InMemoryRepository<ExtractedPostProps>()
    contents = InMemoryRepository<ExtractedPostContent>()

    run = (id: string) =>
      ETLPostData({ id })({
        posts: posts,
        props: props,
        contents: contents,
      })
  })

  it('should be upserting a new post when properties and content exist and published=true', async () => {
    const postId = 'post-id-1'
    const content = {} as ExtendedRecordMap

    const data = {
      id: postId,
      slug: 'slug-1',
      title: 'title-1',
      description: 'desc-1',
      published: true,
    }

    await Promise.all([
      props.set(createProps(data)),
      contents.set(createContent({ id: postId, content })),
    ])

    await run(postId)

    const [post] = await posts.query(Query.where('external_ref', '==', postId))

    expect(post).toEqual(
      expect.objectContaining({
        ...data,
        external_ref: data.id,
        id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )
  })

  it('should be merging fields when post already exists', async () => {
    const content = {} as ExtendedRecordMap
    const post = Post.create({
      id: 'post-id-1',
      slug: 'slug',
      title: 'title',
      description: 'desc',
      tags: ['tag-1'],
      estimated_readtime: 60,
      external_ref: 'external-id-1',
      published: true,
      content,
      publish_at: new Date(Date.now() - 60 * 1000),
    })

    const newProps = createProps({
      id: post.external_ref,
      slug: 'new-slug',
      title: 'new-title',
      description: 'new-desc',
      created_at: post.created_at,
      published: true,
      publish_at: post.publish_at,
      tags: [...post.tags, 'new-tag-added'],
    })

    const newContent = createContent({
      id: post.external_ref,
      content,
      created_at: post.created_at,
      updated_at: newProps.updated_at,
    })

    await Promise.all([
      posts.set(post),
      props.set(newProps),
      contents.set(newContent),
    ])

    await run(post.external_ref)

    const updatedPost = await posts.get(post.id)

    expect(updatedPost).toEqual(
      expect.objectContaining({
        id: post.id,
        slug: newProps.slug,
        title: newProps.title,
        description: newProps.description,
        tags: newProps.tags,
        content,
        created_at: post.created_at,
        updated_at: expect.any(Date),
      }),
    )
  })

  it('should be removing a post when properties are missing but post exists', async () => {
    const content = {} as ExtendedRecordMap
    const post = Post.create({
      id: 'post-id-1',
      slug: 'slug',
      title: 'title',
      description: 'desc',
      tags: ['tag-1'],
      estimated_readtime: 60,
      external_ref: 'external-id-1',
      published: true,
      content,
      publish_at: new Date(Date.now() - 60 * 1000),
    })

    const savedContent = createContent({
      id: post.external_ref,
      content,
      created_at: post.created_at,
    })

    await Promise.all([posts.set(post), contents.set(savedContent)])

    await run(post.external_ref)

    const remaining = await posts.query(
      Query.where('external_ref', '==', post.external_ref),
    )

    expect(remaining.length).toBe(0)
  })

  it('should be removing a post when published=false and post exists', async () => {
    const content = {} as ExtendedRecordMap
    const post = Post.create({
      id: 'post-id-1',
      slug: 'slug',
      title: 'title',
      description: 'desc',
      tags: ['tag-1'],
      estimated_readtime: 60,
      external_ref: 'external-id-1',
      published: true,
      content,
      publish_at: new Date(Date.now() - 60 * 1000),
    })

    const newProps = createProps({
      id: post.external_ref,
      slug: 'new-slug',
      title: 'new-title',
      description: 'new-desc',
      created_at: post.created_at,
      published: false,
      publish_at: post.publish_at,
      tags: [...post.tags, 'new-tag-added'],
    })

    const newContent = createContent({
      id: post.external_ref,
      content,
      created_at: post.created_at,
      updated_at: newProps.updated_at,
    })

    await Promise.all([
      posts.set(post),
      props.set(newProps),
      contents.set(newContent),
    ])

    await run(post.external_ref)

    const found = await posts.get(post.id)
    expect(found).toBeUndefined()
  })

  it('should be doing nothing (none) when properties and post are missing', async () => {
    await run('non-existant-post')

    const all = await posts.query()
    expect(all.length).toBe(0)
  })

  it('should be doing nothing (none) when published=false and post does not exist', async () => {
    const content = {} as ExtendedRecordMap
    const external_ref = 'external-ref-id'

    const newProps = createProps({
      id: external_ref,
      slug: 'new-slug',
      title: 'new-title',
      description: 'new-desc',
      created_at: new Date(),
      published: false,
    })

    const newContent = createContent({
      id: external_ref,
      content,
      created_at: newProps.created_at,
      updated_at: newProps.updated_at,
    })

    await Promise.all([props.set(newProps), contents.set(newContent)])

    await run(external_ref)

    const all = await posts.query()

    expect(all.length).toBe(0)
  })

  it('should be none when content is missing and post does not exist, and remove when post exists', async () => {
    const content = {} as ExtendedRecordMap
    const external_ref = 'external_ref-id'

    const newProps = createProps({
      id: external_ref,
      slug: 'new-slug',
      title: 'new-title',
      description: 'new-desc',
      created_at: new Date(),
      published: true,
      publish_at: new Date(),
      tags: ['new-tag-added'],
    })

    await props.set(newProps)

    await run(external_ref)

    const all = await posts.query()

    expect(all.length).toBe(0)

    const post = Post.create({
      id: 'post-id-1',
      slug: 'slug',
      title: 'title',
      description: 'desc',
      tags: ['tag-1'],
      estimated_readtime: 60,
      external_ref,
      published: true,
      content,
      publish_at: new Date(Date.now() - 60 * 1000),
    })

    await posts.set(post)

    await run(external_ref)

    const updatedAll = await posts.query()

    expect(updatedAll.length).toBe(0)
  })

  it('should be copying publish_at, created_at, updated_at from props to post', async () => {
    const custom = {
      publish_at: new Date('2024-02-01T10:00:00Z'),
      created_at: new Date('2024-01-05T10:00:00Z'),
      updated_at: new Date('2024-01-07T10:00:00Z'),
    }

    const content = {} as ExtendedRecordMap
    const post = Post.create({
      id: 'post-id-1',
      slug: 'slug',
      title: 'title',
      description: 'desc',
      tags: ['tag-1'],
      estimated_readtime: 60,
      external_ref: 'external-id-1',
      published: true,
      content,
      publish_at: new Date(Date.now() - 60 * 1000),
    })

    const newProps = createProps({
      id: post.external_ref,
      slug: 'new-slug',
      title: 'new-title',
      description: 'new-desc',
      published: true,
      tags: [...post.tags, 'new-tag-added'],
      ...custom,
    })

    const newContent = createContent({
      id: post.external_ref,
      content,
      ...custom,
    })

    await Promise.all([
      posts.set(post),
      props.set(newProps),
      contents.set(newContent),
    ])

    await run(post.external_ref)

    const [updatedPost] = await posts.query(
      Query.where('external_ref', '==', post.external_ref),
    )

    expect(updatedPost).toEqual(
      expect.objectContaining({
        ...custom,
        updated_at: expect.any(Date),
      }),
    )
  })
})
