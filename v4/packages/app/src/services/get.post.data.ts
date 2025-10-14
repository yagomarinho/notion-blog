import config from '@/config'
import 'server-only'
import { ExtendedRecordMap } from 'notion-types'

interface Request {
  slug: string
}

export interface Post {
  id: string
  title: string
  description: string
  slug: string
  published: boolean
  created_at: Date
  updated_at: Date
  rawPage: ExtendedRecordMap
}

export async function getPostData({ slug }: Request): Promise<Post> {
  const result = await fetch(`${config.api.baseUrl}/post/${slug}`, {
    cache: 'force-cache',
  })

  if (!result.ok) throw new Error('Invalid post slug')

  const post = await result.json()

  return {
    ...post,
    created_at: new Date(post.created_at),
    updated_at: new Date(post.updated_at),
  }
}
