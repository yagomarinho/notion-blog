import 'server-only'

import config from '@/config'
import { Cover } from '@/components/card'

export async function getPostsList() {
  const result = await fetch(`${config.api.baseUrl}/posts`, {
    cache: 'force-cache',
  })

  let posts: Cover[] = []

  if (result.ok) posts = await result.json()

  return posts
}
