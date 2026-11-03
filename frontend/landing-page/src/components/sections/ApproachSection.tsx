import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ApproachSection({ items }: { items: string[] }) {
  return (
    <Section
      className="bg-navy-deep text-white"
      containerClassName="grid gap-12 lg:grid-cols-2 lg:gap-[100px]"
    >
      <SectionHeading
        eyebrow="Our approach"
        title="More than a"
        accent="curriculum."
        light
      />
      <ul className="self-start border-t border-[#4a6876]">
        {items.map((item, index) => (
          <li
            key={item}
            className="flex items-center gap-7 border-b border-[#4a6876] py-6"
          >
            <span aria-hidden="true" className="text-gold text-[10px]">
              0{index + 1}
            </span>
            <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-white">
              {item}
            </h3>
          </li>
        ))}
      </ul>
    </Section>
  );
}
