import Link from 'next/link'

import { FiArrowLeft } from 'react-icons/fi'

import NotionPage from '@/components/notion.page'
import config from '@/config'

const NotFound = () => (
  <div className="w-screen h-screen">
    <header className="w-full p-8 md:p-16 h-16 flex justify-start items-center">
      <Link href="/">
        <FiArrowLeft />
      </Link>
    </header>
    <div className="w-full h-full flex justify-center items-center">
      Page Not Found
    </div>
  </div>
)

const Post = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params

  try {
    const result = await fetch(`${config.api.baseUrl}/post/${slug}`)

    if (!result.ok) return <NotFound />

    const { recordMap, properties } = await result.json()

    return (
      <div className="w-full">
        <header className="flex items-center justify-start w-full px-8 md:px-16 h-[70px]">
          <Link href="/">
            <FiArrowLeft size={24} />
          </Link>
        </header>
        <main>
          <NotionPage properties={properties} recordMap={recordMap} />
        </main>
      </div>
    )
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return <NotFound />
  }
}

export default Post

export const revalidate = 60
