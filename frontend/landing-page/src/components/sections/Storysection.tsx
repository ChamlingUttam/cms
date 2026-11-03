import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface StorySectionProps {
  image: { src: string; alt: string };
  eyebrow: string;
  title: string;
  accent: string;
  paragraphs: string[];
}

export function StorySection({
  image,
  eyebrow,
  title,
  accent,
  paragraphs,
}: StorySectionProps) {
  return (
    <Section containerClassName="grid items-center gap-14 lg:grid-cols-2 lg:gap-[9vw]">
      <div className="relative h-[420px] md:h-[580px]">
        <div
          aria-hidden="true"
          className="bg-gold absolute -bottom-[18px] -left-[18px] h-4/5 w-[70%]"
        />
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
      <div>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          accent={accent}
          stacked={false}
        />
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-[25px] max-w-[520px]">
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  );
}
