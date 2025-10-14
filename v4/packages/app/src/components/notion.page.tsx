'use client'

import NextImage from 'next/image'

import { NotionRenderer } from 'react-notion-x'
import { Code } from 'react-notion-x/build/third-party/code'
import { Post } from '@/services/get.post.data'

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

const NotionPage = ({ title, description, rawPage }: Post) => (
  <div className="w-full flex flex-col items-center px-8 md:px-16">
    <div className="w-full max-w-screen-md pb-12">
      <header className="py-24">
        <h1 className="font-inter font-bold text-4xl mb-4">{title}</h1>
        <p className="font-roboto text-base">{description}</p>
      </header>
      <NotionRenderer
        className="!text-[#A2A2A2]"
        components={{ Code, Image }}
        recordMap={rawPage}
      />
    </div>
  </div>
)

export default NotionPage
