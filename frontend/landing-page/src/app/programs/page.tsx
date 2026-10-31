import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { title } from "process";
import { createMetadata } from "@/lib/metadata";

import { pageJsonLd } from "@/lib/schema";

const description =
  "Programs for every stage of growth at Brightwood Academy: Early Years (5–7), Primary (8–11), Middle (12–14) and Senior School (15–18).";

export const metadata: Metadata = createMetadata({
  title: "Programs for Ages 5–18",
  description,
  path: "/programs",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={pageJsonLd({
          name: "Programs",
          description,
          path: "/programs",
          type: "CollectionPage",
        })}
      />
      <PageHero
        label="Learning journey"
        title="A program for every"
        accent="stage of growth."
        text="From first discoveries to final-year ambitions, every Brightwood program balances challenge, support, and joy."
      />
    </>
  );
}
