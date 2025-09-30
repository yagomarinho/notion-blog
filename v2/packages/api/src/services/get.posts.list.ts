import { Client } from '@notionhq/client'

export interface Cover {
  slug: string
  title: string
  description: string
  created_at: Date
  updated_at: Date
}

export async function getPostsList(): Promise<Cover[]> {
  const notion = new Client({
    auth: process.env.NOTION_AUTH_TOKEN,
  })

  let filter: any = {
    property: 'published',
    checkbox: {
      equals: true,
    },
  }

  if (process.env.NODE_ENV !== 'production') filter = undefined

  const pages = await notion.dataSources.query({
    data_source_id: process.env.NOTION_COLLECTION_ID!,
    filter,
    sorts: [{ property: 'updated_at', direction: 'descending' }],
    page_size: 10,
  })

  return pages.results
    .filter(p => p.object === 'page' && !(p as any).in_trash)
    .map((p: any) => ({
      slug: p.properties.slug?.rich_text?.[0]?.plain_text ?? '',
      title: p.properties.title?.title?.[0]?.plain_text ?? '',
      description: p.properties.description?.rich_text?.[0]?.plain_text ?? '',
      created_at: new Date(p.created_time),
      updated_at: new Date(p.last_edited_time),
    }))
}
