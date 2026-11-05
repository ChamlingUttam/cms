import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Value } from "@/types";

export function ValuesSection({ values }: { values: Value[] }) {
  return (
    <Section className="bg-navy-deep text-white">
      <SectionHeading
        eyebrow="What guides us"
        title="Our values,"
        accent="lived daily."
        light
        stacked={false}
        className="mb-12 md:mb-[60px]"
      />
      <ul className="border-navy-rule grid border-t sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value, index) => (
          <li
            key={value.title}
            className="border-navy-rule border-b py-8 sm:px-0 lg:min-h-[250px] lg:border-r lg:border-b-0 lg:pr-7 lg:pl-7 lg:first:pl-0 lg:last:border-r-0"
          >
            <span aria-hidden="true" className="text-gold text-[11px]">
              0{index + 1}
            </span>
            <h3 className="mt-10 mb-[15px] text-[21px] font-semibold tracking-[-0.02em] text-white lg:mt-[50px]">
              {value.title}
            </h3>
            <p className="text-sm text-[#aebec5]">{value.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
