import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { title } from "process";
import { createMetadata } from "@/lib/metadata";

import { pageJsonLd } from "@/lib/schema";

const description =
  " Learn the story, vlaues and people behind Brightwood Academy-an independent, incluesive school build around belonging since 2001.";

export const metadata: Metadata = createMetadata({
  title: "About Us",
  description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={pageJsonLd({
          name: "About Us",
          description,
          path: "/about",
          type: "AboutPage",
        })}
      />

      <PageHero
        label="Our story"
        title="Grounded in purpose."
        accent="Growing with heart"
        text="For over two decades ,Brightwood has helped young people discover whoo they are and what they can contribute."
      />
    </>
  );
}
