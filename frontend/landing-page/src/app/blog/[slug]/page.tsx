import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogGrid } from "@/components/sections/BlogGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/Container";
import { getPost, getRelatedPosts, posts } from "@/data/blog";
import { formatDate } from "@/lib/format";
import { createMetadata } from "@/lib/metadata";
import { postJsonLd } from "@/lib/schema";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug);

  return (
    <>
      <JsonLd data={postJsonLd(post)} />

      <article className="py-12 md:py-20">
        <Container>
          <div className="mx-auto max-w-[760px]">
            <Link
              href="/blog"
              className="hover:text-ink text-[13px] font-semibold text-[#6b7b82]"
            >
              ← All posts
            </Link>

            <header className="mt-8">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <Badge variant="secondary" className="rounded-none">
                  {post.category}
                </Badge>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readTime} min read</span>
              </div>
              <h1 className="mt-5 text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.08]">
                {post.title}
              </h1>
              <p className="mt-4 text-sm">By {post.author}</p>
            </header>
          </div>

          <div className="relative mx-auto mt-10 aspect-[16/9] max-w-[960px] overflow-hidden">
            <Image
              src={post.image.src}
              alt={post.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="mx-auto mt-10 max-w-[760px]">
            {post.body.map((block, index) =>
              block.type === "heading" ? (
                <h2
                  key={index}
                  className="mt-10 text-2xl font-semibold md:text-[1.75rem]"
                >
                  {block.text}
                </h2>
              ) : (
                <p key={index} className="mt-5 text-base leading-[1.85]">
                  {block.text}
                </p>
              ),
            )}
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="bg-sand py-16 md:py-20">
          <Container>
            <h2 id="related-heading" className="mb-8 text-3xl">
              Keep reading
            </h2>
            <BlogGrid posts={related} />
          </Container>
        </section>
      )}

      <CtaBand
        compact
        title={
          <>
            Come and see <em>Brightwood.</em>
          </>
        }
        text="Meet our teachers, tour the campus and see learning in action."
        cta={{ label: "Book a school tour", href: "/contact" }}
      />
    </>
  );
}
