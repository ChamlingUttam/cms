import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactDetails } from "@/components/sections/ContactDetails";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/ui/Section";
import { getContactInfo } from "@/lib/api";
import { createMetadata } from "@/lib/metadata";
import { pageJsonLd } from "@/lib/schema";

const description =
  "Contact Brightwood Academy admissions to book a campus tour, ask about our programs or start an application.";

export const metadata: Metadata = createMetadata({
  title: "Contact & Admissions",
  description,
  path: "/contact",
});

export default async function ContactPage() {
  const contact = await getContactInfo();

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
      <Section containerClassName="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-[9vw]">
        <ContactDetails contact={contact} />
        <ContactForm />
      </Section>
    </>
  );
}
