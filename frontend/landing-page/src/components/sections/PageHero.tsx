import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface PageHeroProps {
  label: string;
  title: string;
  accent: string;
  text: string;
}

/** Page-level intro. Renders the page's single <h1>. */
export function PageHero({ label, title, accent, text }: PageHeroProps) {
  return (
    <section className="bg-sand relative overflow-hidden pt-[75px] pb-[60px] md:pt-[100px] md:pb-[85px]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[15%] right-[8%] hidden text-[180px] leading-none text-[#e9ad2f] opacity-35 md:block"
      >
        ✦
      </span>
      <Container className="relative">
        <Eyebrow>{label}</Eyebrow>
        <h1 className="max-w-[900px] text-[clamp(2.75rem,8vw,7rem)]">
          {title} <em className="block text-[#ce9420]">{accent}</em>
        </h1>
        <p className="mt-[30px] max-w-[610px] text-base md:text-lg">{text}</p>
      </Container>
    </section>
  );
}
