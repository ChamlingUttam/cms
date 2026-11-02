import { Section } from "@/components/ui/Section";
import type { Stat } from "@/types";

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <Section containerClassName="py-0">
      <ul className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className="border-line px-3 text-center odd:border-r lg:border-r lg:last:border-r-0"
          >
            <strong className="block font-serif text-[2.5rem] leading-none font-medium text-[#113b4d] italic md:text-[51px]">
              {stat.value}
            </strong>
            <span className="mt-3 block text-xs text-[#75838a]">
              {stat.label}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
