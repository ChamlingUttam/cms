import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { images } from "@/data/images";
import { createMetadata } from "@/lib/metadata";
import { webPageSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: { absolute: `${siteConfig.name} | Independent School for Ages 5–18` },
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: siteConfig.name,
          description: siteConfig.description,
          path: "/",
        })}
      />
      <Hero
        eyebrow="Welcome to Brightwood"
        titleLead="Where bright minds"
        titleAccent="grow boldly."
        text="We nurture curiosity, character, and confidence—preparing every learner to shape a future full of possibility."
        image={images.hero}
        primaryCta={{ label: "Explore our programs", href: "/programs" }}
        secondaryCta={{ label: "Discover our story", href: "/about" }}
        note={{ title: "Applications open", subtitle: "2025–26 academic year" }}
      />
      <Intro
        eyebrow="Why Brightwood"
        title="Education that reaches"
        accent="beyond the classroom."
        text="From first questions to bold ideas, our students learn to think deeply, care widely, and act with purpose. It’s an education built for life—not just the next test."
      />
    </>
  );
}
