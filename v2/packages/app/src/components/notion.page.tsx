'use client'

import NextImage from 'next/image'

import { NotionRenderer } from 'react-notion-x'
import { Code } from 'react-notion-x/build/third-party/code'
import { ExtendedRecordMap } from 'notion-types'

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
