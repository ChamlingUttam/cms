import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { createMetadata } from "@/lib/metadata";
import { CampusPhoto } from "@/components/sections/CampusPhoto";
import { images } from "@/data/images";
import { pageJsonLd } from "@/lib/schema";
import { FacilityGrid } from "@/components/sections/FacilityGrid";
import { facilities } from "@/data/facilities";
import { CtaBand } from "@/components/sections/CtaBand";

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
      <CampusPhoto
        image={images.classroom}
        badge={{
          value: "8-acre",
          label: "green campus in the heart of Brightwood",
        }}
      />
      <FacilityGrid facilities={facilities} />
      <CtaBand
        compact
        title={
          <>
            See it for <em>yourself.</em>
          </>
        }
        text="Campus tours are available are Tuesday through Friday."
        cta={{ label: "Plan your visit", href: "/contact" }}
      />
    </>
  );
}
