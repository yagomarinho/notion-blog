import 'server-only'

import config from '@/config'

import { Cover } from '@/components/card'
import { bearer } from '@/utils/bearer'

export async function getPostList(): Promise<Cover[]> {
  const headers = new Headers()
  headers.set('Authorization', bearer(process.env.API_ACCESS_TOKEN!))

  const result = await fetch(`${config.api.baseUrl}/posts`, {
    cache: 'force-cache',
    headers,
  })

  let posts: any[] = []

  if (result.ok) posts = await result.json()

  return posts.map(post => ({
    ...post,
    publish_at: new Date(post.publish_at),
    created_at: new Date(post.created_at),
    updated_at: new Date(post.updated_at),
  }))
}
