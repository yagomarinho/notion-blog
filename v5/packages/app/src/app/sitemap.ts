import { getPostList } from '@/services/get.post.list'
import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPostList()

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    ...posts.map(post => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastModified: post.updated_at,
    })),
  ]
}
