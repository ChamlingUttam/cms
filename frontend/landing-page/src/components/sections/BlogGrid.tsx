// import { BlogCard } from "@/components/sections/BlogCard";
// import type { Blog } from "@/types";

// export function BlogGrid({ blogs }: { blogs: Blog[] }) {
//   return (
//     <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//       {blogs.map((blog) => (
//         <li key={blog.id}>
//           <BlogCard blog={blog} />
//         </li>
//       ))}
//     </ul>
//   );
// }

import { BlogCard } from "@/components/sections/BlogCard";
import type { Blog } from "@/types";

export function BlogGrid({ blogs }: { blogs: Blog[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <li key={blog.id}>
          <BlogCard blog={blog} />
        </li>
      ))}
    </ul>
  );
}
