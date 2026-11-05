import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface IntroProps {
  eyebrow: string;
  title: string;
  accent: string;
  text: string;
}

export function Intro({ eyebrow, title, accent, text }: IntroProps) {
  return (
    <Section
      spacing="intro"
      containerClassName="grid items-end gap-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-[100px]"
    >
      <SectionHeading eyebrow={eyebrow} title={title} accent={accent} />
      <p className="pb-2 text-base leading-[1.8] md:text-lg">{text}</p>
    </Section>
  );
}
