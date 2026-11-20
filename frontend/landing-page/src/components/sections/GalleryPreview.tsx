import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { GalleryImage } from "@/types";

/** Photo strip for the home page, linking to the full gallery. Hidden when there are no photos. */
export function GalleryPreview({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;

  return (
    <Section aria-labelledby="gallery-heading" className="bg-sand">
      <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          id="gallery-heading"
          eyebrow="Life at Brightwood"
          title="Moments from"
          accent="our campus."
          stacked={false}
        />
        <ButtonLink href="/gallery" variant="link" arrow>
          View the gallery
        </ButtonLink>
      </div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {images.map((image, index) => (
          <li key={image.id} className={index > 3 ? "hidden md:block" : undefined}>
            <Link
              href="/gallery"
              aria-label="Open the photo gallery"
              className="bg-line group relative block aspect-[4/3] overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.imageUrl}
                srcSet={image.srcSet ?? undefined}
                sizes="(min-width: 768px) 33vw, 50vw"
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
              />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
