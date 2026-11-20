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
