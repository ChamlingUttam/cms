import { BlogCard } from "@/components/sections/BlogCard";
import type { BlogPost } from "@/types";

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <BlogCard post={post} />
        </li>
      ))}
    </ul>
  );
}
