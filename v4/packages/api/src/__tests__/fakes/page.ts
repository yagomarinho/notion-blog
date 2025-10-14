export interface PageProps {
  id: string
  object: string
  slug: string
  title: string
  description: string
  last_edited_time: string
  in_trash: boolean
  withProps: boolean
  created_time: string
}

export interface ExpectedPage {
  id: string
  object: string
  properties: Record<string, unknown>
  in_trash: boolean
  created_time: string
  last_edited_time: string
}

export const createPage = ({
  id = 'page-id',
  object = 'page',
  in_trash = false,
  slug = 'my-slug',
  title = 'My Title',
  description = 'My Description',
  created_time = new Date().toISOString(),
  last_edited_time = new Date().toISOString(),
  withProps = true,
}: Partial<PageProps> = {}): ExpectedPage => ({
  id,
  object,
  created_time,
  in_trash,
  last_edited_time,
  properties: withProps
    ? {
        slug: { rich_text: [{ plain_text: slug }] },
        title: { title: [{ plain_text: title }] },
        description: { rich_text: [{ plain_text: description }] },
      }
    : {},
})
