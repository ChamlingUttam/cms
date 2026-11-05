import { IconBox } from "@/components/ui/IconBox";
import { Section } from "@/components/ui/Section";
import type { Pillar } from "@/types";

export function PillarGrid({ pillars }: { pillars: Pillar[] }) {
  return (
    <Section spacing="flush-top">
      <ul className="border-line grid border bg-white md:grid-cols-3">
        {pillars.map((pillar, index) => (
          <li
            key={pillar.title}
            className="border-line relative min-h-[260px] border-b p-8 last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0 lg:min-h-[300px] lg:p-[42px]"
          >
            <span
              aria-hidden="true"
              className="absolute top-[17px] right-[22px] text-[11px] tracking-[1px] text-[#b8c0c2]"
            >
              0{index + 1}
            </span>
            <IconBox name={pillar.icon} className="mb-9" />
            <h3 className="mb-[15px] text-[23px] font-semibold tracking-[-0.02em]">
              {pillar.title}
            </h3>
            <p className="text-sm">{pillar.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
