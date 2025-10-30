import 'server-only'

import config from '@/config'

import { ExtendedRecordMap } from 'notion-types'
import { bearer } from '@/utils/bearer'
import { Cover } from '@/components/card'

interface Request {
  slug: string
}

export interface Post extends Cover {
  content: ExtendedRecordMap
}

export async function getPostData({ slug }: Request): Promise<Post> {
  const headers = new Headers()
  headers.set('Authorization', bearer(process.env.API_ACCESS_TOKEN!))

  const result = await fetch(`${config.api.baseUrl}/post/${slug}`, {
    cache: 'force-cache',
    headers,
  })

  if (!result.ok) throw new Error('Invalid post slug')

  const post = await result.json()

  return {
    ...post,
    publish_at: post.publish_at ? new Date(post.publish_at) : undefined,
    created_at: new Date(post.created_at),
    updated_at: new Date(post.updated_at),
  }
}
