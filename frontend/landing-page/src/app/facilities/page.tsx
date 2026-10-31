import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { title } from "process";
import { createMetadata } from "@/lib/metadata";

import { pageJsonLd } from "@/lib/schema";

const description =
  "Explore Brightwood’s 8-acre campus: discovery labs, a learning commons, a creative arts studio, and sports and wellbeing facilities.";

export const metadata: Metadata = createMetadata({
  title: "Campus & Facilities",
  description,
  path: "/facilities",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={pageJsonLd({
          name: "Campus & Facilities",
          description,
          path: "/facilities",
          type: "CollectionPage",
        })}
      />
      <PageHero
        label="Our campus"
        title="Spaces that invite"
        accent="wonder."
        text="Every corner of Brightwood is designed to help students explore, create, collaborate, and feel at home."
      />
    </>
  );
}
