import { Card, Cover } from './card'

export interface BlogPostsProps {
  posts: Cover[]
}

export const BlogPosts = ({ posts }: BlogPostsProps) => (
  <div className="w-full max-w-[720px]">
    <header>
      <span className="font-roboto font-medium text-sm md:text-base">
        Artigos Recentes
      </span>
    </header>
    <div>
      {posts.map(post => (
        <Card key={post.slug} {...post} />
      ))}
    </div>
  </div>
)
