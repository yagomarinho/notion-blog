import config from '@/config'
import 'server-only'

interface Request {
  slug: string
}

interface Result {
  recordMap: any
  properties: Record<string, any>
}

export async function getPostData({ slug }: Request): Promise<Result> {
  const result = await fetch(`${config.api.baseUrl}/post/${slug}`, {
    cache: 'force-cache',
  })

  if (!result.ok) throw new Error('Invalid post slug')

  const { recordMap, properties } = await result.json()

  return { recordMap, properties }
}
