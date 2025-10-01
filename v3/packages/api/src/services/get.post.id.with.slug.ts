import { Client } from '@notionhq/client'

export async function getPostIdWithSlug({ slug }): Promise<string | undefined> {
  const notion = new Client({ auth: process.env.NOTION_AUTH_TOKEN })
  const dataSourceId = process.env.NOTION_COLLECTION_ID!

  const q = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: 'slug',
      rich_text: { equals: slug },
    },
  })

  if (!q || !q.results) return

  const [page] = q.results

  return page?.id
}
