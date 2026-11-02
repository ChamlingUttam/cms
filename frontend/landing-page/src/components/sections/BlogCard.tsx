import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { BlogPost } from "@/types";

/** A blog post preview. The title link covers the whole card. */
export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Card className="group hover:border-gold-dark relative h-full gap-0 overflow-hidden rounded-none py-0 shadow-none transition-colors">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.image.src}
          alt={post.image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-3 text-xs">
          <Badge variant="secondary" className="rounded-none">
            {post.category}
          </Badge>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h3 className="text-[22px] leading-[1.2] font-semibold tracking-[-0.02em]">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {post.title}
          </Link>
        </h3>
        <p className="text-sm">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="px-6 pb-6 text-xs">{post.readTime} min read</CardFooter>
    </Card>
  );
}
