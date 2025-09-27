'use client'

import dynamic from 'next/dynamic'
import NextImage from 'next/image'
import { ExtendedRecordMap } from 'notion-types'

const NotionRenderer = dynamic(
  () => import('react-notion-x').then(m => m.NotionRenderer),
  { ssr: false },
)

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(m => m.Code),
)

const Image = ({ src, alt, width, height, ...rest }: any) => (
  <div className="relative w-full h-auto">
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="rouded-md"
      {...rest}
    />
  </div>
)

type Props = {
  recordMap: ExtendedRecordMap
  properties: Record<string, any>
}

const NotionPage = ({ properties, recordMap }: Props) => (
  <div className="w-full flex flex-col items-center px-8 md:px-16">
    <div className="w-full max-w-screen-md pb-12">
      <header className="py-24">
        <h1 className="font-inter font-bold text-4xl mb-4">
          {properties.title[0][0]}
        </h1>
        <p className="font-roboto text-base">
          {properties.description?.[0]?.[0]}
        </p>
      </header>
      <NotionRenderer
        className="!text-[#A2A2A2]"
        components={{ Code, Image }}
        recordMap={recordMap}
      />
    </div>
  </div>
)

export default NotionPage
