import { createContent } from '../../../../__tests__/fakes/create.content'
import { createProps } from '../../../../__tests__/fakes/create.props'
import { isLeft, isRight } from '../../../../shared/core/either'
import { Repository } from '../../../../shared/core/repository'
import { InMemoryRepository } from '../../../../shared/repositories/in.memory.repository'
import { Post } from '../../entities/post'
import { convertExtractToPost } from '../../helpers/convert.extract.to.post'
import { ExtractedPostContent } from '../../repositories/extracted.post.content.repository'
import { ExtractedPostProps } from '../../repositories/extracted.post.props.repository'
import { ETLReconciler } from '../etl.reconciler'

const content = {} as any

jest.mock('notion-client', () => {
  const getPage = jest.fn()
  const MockNotionAPI = jest.fn().mockImplementation(() => ({
    getPage,
  }))

  ;(MockNotionAPI as any).__getPage = getPage
  return { NotionAPI: MockNotionAPI }
})

describe('ETLReconciler', () => {
  let posts: Repository<Post>
  let props: Repository<ExtractedPostProps>
  let contents: Repository<ExtractedPostContent>

  beforeEach(() => {
    posts = InMemoryRepository()
    props = InMemoryRepository()
    contents = InMemoryRepository()
  })

  it('it should create a batch with all non-none intents using converted posts', async () => {
    props.batch(
      [
        createProps({
          id: 'external_ref-1',
          slug: 'slug-1',
          title: 'title-1',
          description: 'desc-1',
          published: true,
          tags: [],
          publish_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        }),
        createProps({
          id: 'external_ref-2',
          slug: 'slug-2',
          title: 'title-2',
          description: 'desc-2',
          published: true,
          tags: [],
          publish_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        }),
      ].map(props => ({ type: 'upsert', data: props })),
    )

    contents.batch(
      [
        createContent({
          id: 'external_ref-1',
          content,
          created_at: new Date(),
          updated_at: new Date(),
        }),
        createContent({
          id: 'external_ref-2',
          content,
          created_at: new Date(),
          updated_at: new Date(),
        }),
      ].map(props => ({ type: 'upsert', data: props })),
    )

    const result = await ETLReconciler()({ posts, props, contents })

    expect(isRight(result)).toBeTruthy()

    const all = await posts.query()

    expect(all.length).toBe(2)

    expect(all).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ external_ref: 'external_ref-1' }),
        expect.objectContaining({ external_ref: 'external_ref-2' }),
      ]),
    )
  })

  it('it should ignore intents with kind "none"', async () => {
    props.batch(
      [
        createProps({
          id: 'external_ref-1',
          slug: 'slug-1',
          title: 'title-1',
          description: 'desc-1',
          published: true,
          tags: [],
          publish_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        }),
        createProps({
          id: 'external_ref-2',
          slug: 'slug-2',
          title: 'title-2',
          description: 'desc-2',
          published: true,
          tags: [],
          publish_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        }),
      ].map(props => ({ type: 'upsert', data: props })),
    )

    contents.batch(
      [
        createContent({
          id: 'external_ref-1',
          content,
          created_at: new Date(),
          updated_at: new Date(),
        }),
        createContent({
          id: 'external_ref-3',
          content,
          created_at: new Date(),
          updated_at: new Date(),
        }),
      ].map(props => ({ type: 'upsert', data: props })),
    )

    const result = await ETLReconciler()({ posts, props, contents })

    expect(isRight(result)).toBeTruthy()

    const all = await posts.query()

    expect(all.length).toBe(1)

    expect(all).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ external_ref: 'external_ref-1' }),
      ]),
    )
  })

  it('it should performe remove when have no properties, content, or not published post', async () => {
    posts.batch(
      [
        Post.create({
          id: 'post-id-2',
          slug: 'slug-2',
          title: 'title-2',
          description: 'desc-2',
          tags: [],
          content,
          estimated_readtime: 0,
          external_ref: 'external_ref-2',
          published: true,
          created_at: new Date(),
          publish_at: new Date(),
          updated_at: new Date(),
        }),
        Post.create({
          id: 'post-id-3',
          slug: 'slug-3',
          title: 'title-3',
          description: 'desc-3',
          tags: [],
          content,
          estimated_readtime: 0,
          external_ref: 'external_ref-3',
          published: true,
          created_at: new Date(),
          publish_at: new Date(),
          updated_at: new Date(),
        }),
        Post.create({
          id: 'post-id-4',
          slug: 'slug-4',
          title: 'title-4',
          description: 'desc-4',
          tags: [],
          content,
          estimated_readtime: 0,
          external_ref: 'external_ref-4',
          published: true,
          created_at: new Date(),
          publish_at: new Date(),
          updated_at: new Date(),
        }),
      ].map(item => ({ type: 'upsert', data: item })),
    )

    props.batch(
      [
        createProps({
          id: 'external_ref-1',
          slug: 'slug-1',
          title: 'title-1',
          description: 'desc-1',
          published: true,
          tags: [],
          publish_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        }),
        createProps({
          id: 'external_ref-2',
          slug: 'slug-2',
          title: 'title-2',
          description: 'desc-2',
          published: true,
          tags: [],
          publish_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        }),
        createProps({
          id: 'external_ref-4',
          slug: 'slug-4',
          title: 'title-4',
          description: 'desc-4',
          published: false,
          tags: [],
          publish_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        }),
      ].map(props => ({ type: 'upsert', data: props })),
    )

    contents.batch(
      [
        createContent({
          id: 'external_ref-1',
          content,
          created_at: new Date(),
          updated_at: new Date(),
        }),
        createContent({
          id: 'external_ref-3',
          content,
          created_at: new Date(),
          updated_at: new Date(),
        }),
        createContent({
          id: 'external_ref-4',
          content,
          created_at: new Date(),
          updated_at: new Date(),
        }),
      ].map(props => ({ type: 'upsert', data: props })),
    )

    const result = await ETLReconciler()({ posts, props, contents })

    expect(isRight(result)).toBeTruthy()

    const all = await posts.query()

    expect(all.length).toBe(1)

    expect(all).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ external_ref: 'external_ref-1' }),
      ]),
    )
  })

  it('it should return Left when posts.batch fails', async () => {
    props.batch(
      [
        createProps({
          id: 'external_ref-1',
          slug: 'slug-1',
          title: 'title-1',
          description: 'desc-1',
          published: true,
          tags: [],
          publish_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        }),
        createProps({
          id: 'external_ref-2',
          slug: 'slug-2',
          title: 'title-2',
          description: 'desc-2',
          published: true,
          tags: [],
          publish_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        }),
      ].map(props => ({ type: 'upsert', data: props })),
    )

    contents.batch(
      [
        createContent({
          id: 'external_ref-1',
          content,
          created_at: new Date(),
          updated_at: new Date(),
        }),
        createContent({
          id: 'external_ref-2',
          content,
          created_at: new Date(),
          updated_at: new Date(),
        }),
      ].map(props => ({ type: 'upsert', data: props })),
    )

    const result = await ETLReconciler()({
      posts: {
        ...posts,
        batch: () => ({ status: 'failed', time: new Date() }),
      },
      props,
      contents,
    })

    expect(isLeft(result)).toBeTruthy()
  })

  it('it should be robust when there are no refs and perform an empty batch', async () => {
    const pp = await props.set(
      createProps({
        id: 'external_ref-1',
        slug: 'slug-1',
        title: 'title-1',
        description: 'desc-1',
        published: true,
        tags: [],
        publish_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      }),
    )

    const ct = await contents.set(
      createContent({
        id: pp.id,
        content,
        created_at: pp.created_at,
        updated_at: pp.updated_at,
      }),
    )

    await posts.set(convertExtractToPost({ properties: pp, content: ct }))

    const result = await ETLReconciler()({ contents, posts, props })

    expect(isLeft(result)).toBeTruthy()
    expect(result.value).toEqual({ message: 'The reconciler is not necessary' })
  })
})
