import { ButtonLink } from "@/components/ui/button-link";
import { IconBox } from "@/components/ui/IconBox";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Facility } from "@/types";

export function FacilityGrid({ facilities }: { facilities: Facility[] }) {
  return (
    <Section>
      <SectionHeading
        eyebrow="Built for discovery"
        title="Room to find"
        accent="what moves you."
        className="mb-12 md:mb-[60px]"
      />
      <ul className="border-line grid border md:grid-cols-2">
        {facilities.map((facility) => (
          <li
            key={facility.title}
            className="border-line min-h-[260px] border-b bg-white p-7 last:border-b-0 md:min-h-[300px] md:p-[45px] md:odd:border-r md:[&:nth-last-child(2)]:border-b-0"
          >
            <IconBox name={facility.icon} className="mb-9" />
            <h3 className="mb-[15px] text-[23px] font-semibold tracking-[-0.02em]">
              {facility.title}
            </h3>
            <p className="mb-[25px] max-w-[480px]">{facility.text}</p>
            <ButtonLink href="/contact" variant="link">
              Visit this space
              <span className="sr-only"> — {facility.title}</span>
            </ButtonLink>
          </li>
        ))}
      </ul>
    </Section>
  );
}
