import { ElementType } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IconBaseProps } from 'react-icons'

import { BlogPosts } from '@/components/blog.posts'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { getPostList } from '@/services/get.post.list'
import { FiGithub, FiLinkedin } from 'react-icons/fi'

interface IconLinkProps {
  icon: ElementType<IconBaseProps>
  href: string
}

const IconLink = ({ icon: Icon, href }: IconLinkProps) => (
  <div>
    <Link
      className="flex justify-center items-center p-3 rounded-s hover:bg-[#121212]"
      prefetch={false}
      href={href}
      target="_blank"
    >
      <Icon size={24} fill="#fff" strokeWidth={0} />
    </Link>
  </div>
)

const Home = async () => {
  const posts = await getPostList()

  return (
    <div>
      <Header />
      <main className="flex flex-col justify-start items-center gap-24 w-full mt-8 p-4 ">
        <div className="flex flex-col justify-start items-center gap-8 w-full max-w-screen-md">
          <div className="flex flex-col justify-center items-center gap-8 w-full">
            <div>
              <span className="font-inter font-medium text-xl italic">
                Olá, eu sou <b>Yago Marinho</b>
              </span>
            </div>
            <div className="flex flex-col justify-center items-center gap-2 w-full">
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                <Image
                  fill
                  alt="Imagem do autor do blog Yago Marinho"
                  src="https://scontent-gru1-2.cdninstagram.com/v/t51.2885-19/453084866_1525912401342730_5457675582169305743_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-gru1-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2QFqn7-47Wlrkt37vM67A_veBPheUgxxMU-mZtzP8CUMsY0WI1x3W90nDEzC9E6ZtZ-WwOspDq-cgiX8a5J4MF2i&_nc_ohc=vs3bko0NoQYQ7kNvwGBP9bz&_nc_gid=h_suDKjcnvgiZ_UmBH7dhw&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_AfeJbeQx25f20JE6asCotZwGFhLZUSJ9TzyEIbV-LedA2A&oe=68FC527C&_nc_sid=7d3ac5"
                />
              </div>
              <div className="flex flex-row justify-center items-center gap-2">
                <IconLink
                  icon={FiLinkedin}
                  href="https://www.linkedin.com/in/yago-marinho/"
                />
                <IconLink
                  icon={FiGithub}
                  href="https://github.com/yagomarinho"
                />
              </div>
            </div>
          </div>
          <p className="font-roboto text-[#A2A2A2] text-center w-full max-w-screen-sm">
            Especializado em desenvolvimento web moderno com React, NextJS,
            TypeScript e NodeJS, crio soluções escaláveis e centradas no
            usuário. Certificado em desenvolvimento web e formado em UX/UI
            Design, atuo em todas as etapas do processo — da concepção à entrega
            — transformando necessidades de negócio em aplicações digitais
            eficientes.
          </p>
        </div>
        <BlogPosts
          posts={posts.map(p => ({
            ...p,
          }))}
        />
      </main>
      <Footer />
    </div>
  )
}

export default Home
