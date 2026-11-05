import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { createMetadata } from "@/lib/metadata";
import { StorySection } from "@/components/sections/Storysection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { QuoteBlock } from "@/components/sections/QuoteBlock";
import { images } from "@/data/images";
import { pageJsonLd } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import { values } from "@/data/about";
import { headQuote } from "@/data/about";

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
      <StorySection
        image={images.about}
        eyebrow={`Since ${siteConfig.foundingYear}`}
        title="A school built around"
        accent="belonging."
        paragraphs={[
          "Brightwood began with a simple belief: children thrive when rigorous learning and genuine care go hand in hand. Today, that belief lives in every classroom, conversation, and community tradition.",
          "We are proudly independent, intentionally inclusive, and always evolving—guided by what helps our students flourish.",
        ]}
      />
      <ValuesSection values={values} />
      <QuoteBlock quote={headQuote.text} author={headQuote.author} />
    </>
  );
}
