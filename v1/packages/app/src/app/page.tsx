import { BlogPosts } from '@/components/blog.posts'
import { Cover } from '@/components/card'
import { Header } from '@/components/header'
import config from '@/config'

const Home = async () => {
  const result = await fetch(`${config.api.baseUrl}/posts`, {
    cache: 'no-cache',
  })

  let posts: Cover[] = []

  if (result.ok) posts = await result.json()

  return (
    <div>
      <Header />
      <main className="mt-8 p-4 flex justify-center w-full">
        <BlogPosts
          posts={posts.map(p => ({
            ...p,
            created_at: new Date(p.created_at),
            updated_at: new Date(p.updated_at),
          }))}
        />
      </main>
    </div>
  )
}

export default Home

export const dynamic = 'force-dynamic'
