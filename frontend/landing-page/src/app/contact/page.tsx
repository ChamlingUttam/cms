import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { createMetadata } from "@/lib/metadata";
import { ContactInfo } from "@/components/sections/ContactInfo";
import { ContactForm } from "@/components/forms/ContactForm";
import { pageJsonLd } from "@/lib/schema";
import { Section } from "@/components/ui/Section";

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
      <Section containerClassName="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-[9vw]">
        <ContactInfo />
        <ContactForm />
      </Section>

      <div className="my-10 overflow-hidden rounded-lg">
        {/* <iframe
          title={`Map showing the location of ${SITE_NAME}`}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3201.9705055209192!2d85.32187089999998!3d27.679936499999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb195d4dd789f1%3A0xe311e17cd8057755!2sSpine%20Care%20and%20Sports%20Rehab%20Physiotherapy%20clinic!5e1!3m2!1sen!2snp!4v1789288093962!5m2!1sen!2snp"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-80 w-full sm:h-[450px]"
        /> */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108326.23955368384!2d87.27611005!3d26.7950512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef41798ff9d44d%3A0xc7ee029038b68f39!2sBudhasubba%20Temple!5e1!3m2!1sen!2snp!4v1793423860570!5m2!1sen!2snp"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="px-4"
        ></iframe>
      </div>
    </>
  );
}
