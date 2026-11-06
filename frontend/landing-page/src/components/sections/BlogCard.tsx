// import Link from "next/link";
// import { Card, CardContent } from "@/components/ui/card";
// import { formatDate } from "@/lib/format";
// import type { Blog } from "@/types";

// /** A blog preview. The title link covers the whole card. */
// export function BlogCard({ blog }: { blog: Blog }) {
//   return (
//     <Card className="group hover:border-gold-dark relative h-full gap-0 overflow-hidden rounded-none py-0 shadow-none transition-colors">
//       <div className="bg-sand relative aspect-[16/10] overflow-hidden">
//         {blog.imageUrl && (
//           // Plain <img>: the backend supplies a ready-made srcSet for Cloudinary.
//           // eslint-disable-next-line @next/next/no-img-element
//           <img
//             src={blog.imageUrl}
//             srcSet={blog.srcSet ?? undefined}
//             sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
//             alt=""
//             loading="lazy"
//             decoding="async"
//             className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
//           />
//         )}
//       </div>
//       <CardContent className="flex flex-1 flex-col gap-3 p-6">
//         {formatDate(blog.createdAt) && (
//           <time dateTime={blog.createdAt} className="text-xs">
//             {formatDate(blog.createdAt)}
//           </time>
//         )}
//         <h3 className="text-[22px] leading-[1.2] font-semibold tracking-[-0.02em]">
//           <Link
//             href={`/blog/${blog.slug}`}
//             className="after:absolute after:inset-0 after:content-['']"
//           >
//             {blog.name}
//           </Link>
//         </h3>
//         <p className="line-clamp-3 text-sm">{blog.shortDescription}</p>
//       </CardContent>
//     </Card>
//   );
// }

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { Blog } from "@/types";

/** A blog preview. The title link covers the whole card. */
export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Card className="group hover:border-gold-dark relative h-full gap-0 overflow-hidden rounded-none py-0 shadow-none transition-colors">
      <div className="bg-sand relative aspect-[16/10] overflow-hidden">
        {blog.imageUrl && (
          // Plain <img>: the backend supplies a ready-made srcSet for Cloudinary.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.imageUrl}
            srcSet={blog.srcSet ?? undefined}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-6">
        {formatDate(blog.createdAt) && (
          <time dateTime={blog.createdAt} className="text-xs">
            {formatDate(blog.createdAt)}
          </time>
        )}
        <h3 className="text-[22px] leading-[1.2] font-semibold tracking-[-0.02em]">
          <Link
            href={`/blog/${blog.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {blog.name}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm">{blog.shortDescription}</p>
      </CardContent>
    </Card>
  );
}
