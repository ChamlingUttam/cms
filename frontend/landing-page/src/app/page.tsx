import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { LatestPosts } from "@/components/sections/LatestPosts";
import { PillarGrid } from "@/components/sections/PillarGrid";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { posts } from "@/data/blog";
// import { testimonials } from "@/data/testimonials";
import { getTestimonials } from "@/lib/api/testimonials";
import { learningHighlights, pillars, stats } from "@/data/home";
import { images } from "@/data/images";
import { createMetadata } from "@/lib/metadata";
import { webPageSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: { absolute: `${siteConfig.name} | Independent School for Ages 5–18` },
  description: siteConfig.description,
  path: "/",
});

export default async function HomePage() {
  const testimonials = await getTestimonials();

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
      <PillarGrid pillars={pillars} />
      <FeatureSplit
        image={images.student}
        badge={{ value: "18", label: "average class size" }}
        eyebrow="Learning at Brightwood"
        title="Small classes."
        accent="Big possibilities."
        text="Our teachers know each student—their strengths, their questions, and what makes them light up. That means learning feels personal, purposeful, and full of momentum."
        highlights={learningHighlights}
        cta={{ label: "See how we learn", href: "/programs" }}
      />
      <Stats stats={stats} />
      <Testimonials testimonials={testimonials} />
      <LatestPosts posts={posts.slice(0, 3)} />
      <CtaBand
        eyebrow="Come and see"
        title={
          <>
            Your child’s next chapter <em className="block">starts here.</em>
          </>
        }
        text="Step inside Brightwood, meet our teachers, and experience the energy of our community."
        cta={{ label: "Book a school tour", href: "/contact" }}
      />
    </>
  );
}
