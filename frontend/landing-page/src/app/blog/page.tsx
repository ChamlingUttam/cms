// import type { Metadata } from "next";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { JsonLd } from "@/components/seo/JsonLd";
// import { BlogGrid } from "@/components/sections/BlogGrid";
// import { CtaBand } from "@/components/sections/CtaBand";
// import { Container } from "@/components/ui/Container";
// import { getAllBlogs, getBlog, getBlogs } from "@/lib/api";
// import { formatDate } from "@/lib/format";
// import { createMetadata } from "@/lib/metadata";
// import { postJsonLd } from "@/lib/schema";

// interface BlogPostPageProps {
//   params: Promise<{ slug: string }>;
// }

// export async function generateStaticParams() {
//   const blogs = await getAllBlogs();

//   // Cache Components requires at least one result. With no blogs yet, build a
//   // placeholder path that simply shows "Page not found".
//   if (blogs.length === 0) return [{ slug: "no-posts-yet" }];

//   return blogs.map((blog) => ({ slug: blog.slug }));
// }

// export async function generateMetadata({
//   params,
// }: BlogPostPageProps): Promise<Metadata> {
//   const { slug } = await params;
//   const blog = await getBlog(slug);
//   if (!blog) return {};

//   return createMetadata({
//     title: blog.name,
//     description: blog.shortDescription || blog.longDescription.slice(0, 160),
//     path: `/blog/${blog.slug}`,
//     type: "article",
//   });
// }

// export default async function BlogPostPage({ params }: BlogPostPageProps) {
//   const { slug } = await params;
//   const blog = await getBlog(slug);
//   if (!blog) notFound();

//   const { blogs } = await getBlogs(1, 3);
//   const related = blogs.filter((item) => item.slug !== blog.slug).slice(0, 2);

//   // The body is plain text: blank lines separate paragraphs, and React escapes it.
//   const paragraphs = blog.longDescription
//     .split(/\n{2,}/)
//     .map((paragraph) => paragraph.trim())
//     .filter(Boolean);

//   return (
//     <>
//       <JsonLd data={postJsonLd(blog)} />

//       <article className="py-12 md:py-20">
//         <Container>
//           <div className="mx-auto max-w-[760px]">
//             <Link
//               href="/blog"
//               className="hover:text-ink text-[13px] font-semibold text-[#6b7b82]"
//             >
//               ← All posts
//             </Link>

//             <header className="mt-8">
//               {formatDate(blog.createdAt) && (
//                 <time dateTime={blog.createdAt} className="block text-xs">
//                   {formatDate(blog.createdAt)}
//                 </time>
//               )}
//               <h1 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.08]">
//                 {blog.name}
//               </h1>
//               {blog.shortDescription && (
//                 <p className="mt-5 text-lg leading-[1.7]">
//                   {blog.shortDescription}
//                 </p>
//               )}
//             </header>
//           </div>

//           {blog.imageUrl && (
//             <div className="bg-sand relative mx-auto mt-10 aspect-[16/9] max-w-[960px] overflow-hidden">
//               {/* eslint-disable-next-line @next/next/no-img-element */}
//               <img
//                 src={blog.imageUrl}
//                 srcSet={blog.srcSet ?? undefined}
//                 sizes="(min-width: 1024px) 960px, 100vw"
//                 alt=""
//                 fetchPriority="high"
//                 decoding="async"
//                 className="absolute inset-0 size-full object-cover"
//               />
//             </div>
//           )}

//           <div className="mx-auto mt-10 max-w-[760px]">
//             {paragraphs.map((paragraph, index) => (
//               <p
//                 key={index}
//                 className="mt-5 text-base leading-[1.85] whitespace-pre-line"
//               >
//                 {paragraph}
//               </p>
//             ))}
//           </div>
//         </Container>
//       </article>

//       {related.length > 0 && (
//         <section
//           aria-labelledby="related-heading"
//           className="bg-sand py-16 md:py-20"
//         >
//           <Container>
//             <h2 id="related-heading" className="mb-8 text-3xl">
//               Keep reading
//             </h2>
//             <BlogGrid blogs={related} />
//           </Container>
//         </section>
//       )}

//       <CtaBand
//         compact
//         title={
//           <>
//             Come and see <em>Brightwood.</em>
//           </>
//         }
//         text="Meet our teachers, tour the campus and see learning in action."
//         cta={{ label: "Book a school tour", href: "/contact" }}
//       />
//     </>
//   );
// }

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogGrid } from "@/components/sections/BlogGrid";
import { BlogPager } from "@/components/sections/BlogPager";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { getBlogs } from "@/lib/api";
import { createMetadata } from "@/lib/metadata";
import { pageJsonLd } from "@/lib/schema";

const PAGE_SIZE = 9;

const description =
  "News, ideas and advice from Brightwood Academy: learning at home and school, life on campus and tips for families exploring admissions.";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description,
  path: "/blog",
});

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <>
      <JsonLd
        data={pageJsonLd({
          name: "Blog",
          description,
          path: "/blog",
          type: "CollectionPage",
        })}
      />
      <PageHero
        label="The Brightwood blog"
        title="Stories, ideas and"
        accent="school life."
        text="Advice for families, insight into how we teach, and news from around campus."
      />
      <Section>
        {/* Reading ?page= is per-request, so it lives inside Suspense. */}
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList searchParams={searchParams} />
        </Suspense>
      </Section>
    </>
  );
}

async function BlogList({ searchParams }: BlogPageProps) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1);

  const { blogs, pagination } = await getBlogs(page, PAGE_SIZE);

  if (blogs.length === 0) {
    if (page > 1) notFound();
    return <p className="text-center">No posts yet. Please check back soon.</p>;
  }

  return (
    <>
      <BlogGrid blogs={blogs} />
      <BlogPager pagination={pagination} />
    </>
  );
}

function BlogListSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="bg-sand h-80 animate-pulse" />
      ))}
    </div>
  );
}
