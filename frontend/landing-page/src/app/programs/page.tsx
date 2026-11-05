import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { ProgramGrid } from "@/components/sections/ProgramGrid";
import { programFaqs } from "@/data/faqs";
import { approachItems, programs } from "@/data/programs";
import { createMetadata } from "@/lib/metadata";
import { faqSchema, pageJsonLd } from "@/lib/schema";

const description =
  "Programs for every stage of growth at Brightwood Academy: Early Years (5–7), Primary (8–11), Middle (12–14) and Senior School (15–18).";

export const metadata: Metadata = createMetadata({
  title: "Programs for Ages 5–18",
  description,
  path: "/programs",
});

export default function ProgramsPage() {
  return (
    <>
      <JsonLd
        data={[
          ...pageJsonLd({
            name: "Programs",
            description,
            path: "/programs",
            type: "CollectionPage",
          }),
          faqSchema(programFaqs),
        ]}
      />
      <PageHero
        label="Learning journey"
        title="A program for every"
        accent="stage of growth."
        text="From first discoveries to final-year ambitions, every Brightwood program balances challenge, support, and joy."
      />
      <ProgramGrid programs={programs} />
      <ApproachSection items={approachItems} />
      <FaqSection faqs={programFaqs} />
    </>
  );
}
