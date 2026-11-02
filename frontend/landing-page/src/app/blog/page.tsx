import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogGrid } from "@/components/sections/BlogGrid";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { posts } from "@/data/blog";
import { createMetadata } from "@/lib/metadata";
import { pageJsonLd } from "@/lib/schema";

const description =
  "News, ideas and advice from Brightwood Academy: learning at home and school, life on campus and tips for families exploring admissions.";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description,
  path: "/blog",
});

export default function BlogPage() {
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
        <BlogGrid posts={posts} />
      </Section>
    </>
  );
}
