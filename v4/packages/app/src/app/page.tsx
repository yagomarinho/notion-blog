import { BlogPosts } from '@/components/blog.posts'
import { Header } from '@/components/header'
import { getPostList } from '@/services/get.post.list'

const Home = async () => {
  const posts = await getPostList()

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
