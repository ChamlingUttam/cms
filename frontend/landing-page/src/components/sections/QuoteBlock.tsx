import { Section } from "@/components/ui/Section";

interface QuoteBlockProps {
  quote: string;
  author: string;
}

export function QuoteBlock({ quote, author }: QuoteBlockProps) {
  return (
    <Section>
      <figure className="mx-auto max-w-[1000px] text-center">
        <blockquote className="font-serif text-[clamp(1.75rem,4vw,3.5rem)] leading-[1.3] font-medium text-[#163d4e] italic">
          <p className="text-inherit">“{quote}”</p>
        </blockquote>
        <figcaption className="mt-[30px] text-[13px] font-bold text-[#ce9420]">
          — {author}
        </figcaption>
      </figure>
    </Section>
  );
}
