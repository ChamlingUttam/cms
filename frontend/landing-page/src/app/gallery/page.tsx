import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogPager } from "@/components/sections/BlogPager";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { getGallery } from "@/lib/api";
import { createMetadata } from "@/lib/metadata";
import { pageJsonLd } from "@/lib/schema";

const description =
  "Photos from Brightwood Academy: classrooms, labs, sports days, performances and everyday life on campus.";

export const metadata: Metadata = createMetadata({
  title: "Gallery",
  description,
  path: "/gallery",
});

interface GalleryPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default function GalleryPage({ searchParams }: GalleryPageProps) {
  return (
    <>
      <JsonLd
        data={pageJsonLd({
          name: "Gallery",
          description,
          path: "/gallery",
          type: "CollectionPage",
        })}
      />
      <PageHero
        label="Life on campus"
        title="Moments that make"
        accent="Brightwood."
        text="Classrooms, labs, stages and playing fields: a look at a day in the life of our school."
      />
      <Section>
        {/* Reading ?page= is per-request, so it lives inside Suspense. */}
        <Suspense fallback={<GallerySkeleton />}>
          <GalleryList searchParams={searchParams} />
        </Suspense>
      </Section>
    </>
  );
}

async function GalleryList({ searchParams }: GalleryPageProps) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1);

  const { images, pagination } = await getGallery(page);

  if (images.length === 0) {
    if (page > 1) notFound();
    return (
      <p className="text-center">No photos yet. Please check back soon.</p>
    );
  }

  return (
    <>
      <GalleryGrid images={images} />
      <BlogPager
        pagination={pagination}
        basePath="/gallery"
        ariaLabel="Gallery pages"
        previousLabel="← Previous"
        nextLabel="Next →"
      />
    </>
  );
}

function GallerySkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="bg-sand aspect-[4/3] animate-pulse" />
      ))}
    </div>
  );
}
