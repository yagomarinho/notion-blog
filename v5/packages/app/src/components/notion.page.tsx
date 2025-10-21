'use client'

import NextImage from 'next/image'

import { NotionRenderer } from 'react-notion-x'
import { Code } from 'react-notion-x/build/third-party/code'
import { Post } from '@/services/get.post.data'
import { Cover } from './card'
import { TagGroup } from './tag'
import { Time } from './time'

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

const PostHeader = ({ title, description, tags, updated_at }: Cover) => (
  <header className="flex flex-col gap-6 py-8 border-b border-[#A2A2A2]/25 px-4 md:px-8">
    <TagGroup tags={tags} />
    <h1 className="font-inter font-bold text-4xl mb-4">{title}</h1>
    <p className="font-roboto text-base md:text-lg text-[#A2A2A2]">
      {description}
    </p>
    <span className="font-roboto font-light text-xs md:text-sm text-[#A2A2A2]">
      Última atualização realizada em: <Time value={updated_at} />
    </span>
    <div className="flex flex-row gap-3 items-center justify-start">
      <div className="flex flex-row gap-1 items-center justify-start">
        <div className="relative w-8 h-8 rounded-full overflow-hidden">
          <NextImage
            fill
            alt="Imagem do autor do blog Yago Marinho"
            src="https://scontent-gru1-2.cdninstagram.com/v/t51.2885-19/453084866_1525912401342730_5457675582169305743_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-gru1-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2QFqn7-47Wlrkt37vM67A_veBPheUgxxMU-mZtzP8CUMsY0WI1x3W90nDEzC9E6ZtZ-WwOspDq-cgiX8a5J4MF2i&_nc_ohc=vs3bko0NoQYQ7kNvwGBP9bz&_nc_gid=h_suDKjcnvgiZ_UmBH7dhw&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_AfeJbeQx25f20JE6asCotZwGFhLZUSJ9TzyEIbV-LedA2A&oe=68FC527C&_nc_sid=7d3ac5"
          />
        </div>
        <span className="font-roboto font-light text-xs md:text-sm text-[#A2A2A2]">
          Por <strong>Yago Marinho</strong>
        </span>
      </div>
      {/* <div className="w-[1px] h-[13px] bg-[#FFF]/15" />
      <span className="font-roboto text-xs md:text-sm text-[#A2A2A2]">
        6 minutos de leitura
      </span> */}
    </div>
  </header>
)

const NotionPage = ({ content, ...cover }: Post) => (
  <div className="w-full flex flex-col items-center">
    <div className="w-full max-w-screen-md pb-12 [&>*:first-child]:mb-6">
      <PostHeader {...cover} />
      <NotionRenderer components={{ Code, Image }} recordMap={content} />
    </div>
  </div>
)

export default NotionPage
