import { BlogGrid } from "@/components/sections/BlogGrid";
import { ButtonLink } from "@/components/ui/button-link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { BlogPost } from "@/types";

/** "From the blog" teaser for the home page. */
export function LatestPosts({ posts }: { posts: BlogPost[] }) {
  return (
    <Section aria-labelledby="latest-heading">
      <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          id="latest-heading"
          eyebrow="From the blog"
          title="News and ideas from"
          accent="our community."
          stacked={false}
        />
        <ButtonLink href="/blog" variant="link" arrow>
          View all posts
        </ButtonLink>
      </div>
      <BlogGrid posts={posts} />
    </Section>
  );
}
