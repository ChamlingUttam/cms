import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import type { Faq } from "@/types";

interface FaqSectionProps {
  faqs: Faq[];
  eyebrow?: string;
  title?: string;
  accent?: string;
}

/** Accordion of frequently asked questions (shadcn Accordion). */
export function FaqSection({
  faqs,
  eyebrow = "Good to know",
  title = "Answers to common",
  accent = "questions.",
}: FaqSectionProps) {
  return (
    <Section
      aria-labelledby="faq-heading"
      containerClassName="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-[9vw]"
    >
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id="faq-heading" className="text-[clamp(2rem,4vw,3.4rem)]">
          {title} <em className="block">{accent}</em>
        </h2>
      </div>

      <Accordion type="single" collapsible className="border-line border-t">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={faq.question}
            value={`faq-${index}`}
            className="border-line"
          >
            <AccordionTrigger className="py-5 text-base font-semibold hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="max-w-[560px] text-sm leading-[1.8]">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
