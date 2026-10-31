import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { title } from "process";
import { createMetadata } from "@/lib/metadata";

import { pageJsonLd } from "@/lib/schema";

const description =
  "Contact Brightwood Academy admissions to book a campus tour, ask about our programs or start an application";

export const metadata: Metadata = createMetadata({
  title: "Contact and Admissions",
  description,
  path: "/contact",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={pageJsonLd({
          name: "Contact & Admissions",
          description,
          path: "/contact",
          type: "ContactPage",
        })}
      />
      <PageHero
        label="Let’s connect"
        title="Come meet your"
        accent="future school."
        text="Have a question, want to tour the campus, or ready to apply? Our admissions team would love to hear from you."
      />
    </>
  );
}
