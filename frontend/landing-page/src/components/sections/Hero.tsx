import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface HeroProps {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  text: string;
  image: { src: string; alt: string };
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  note?: { title: string; subtitle: string };
}

export function Hero({
  eyebrow,
  titleLead,
  titleAccent,
  text,
  image,
  primaryCta,
  secondaryCta,
  note,
}: HeroProps) {
  return (
    <section className="bg-navy relative isolate h-[720px] overflow-hidden md:h-[min(760px,calc(100svh-82px))] md:min-h-[640px]">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[55%_center]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,34,49,.9),rgba(7,34,49,.48))] lg:bg-[linear-gradient(90deg,rgba(7,34,49,.94)_0%,rgba(7,34,49,.74)_40%,rgba(7,34,49,.12)_75%)]"
      />

      <Container className="flex h-full flex-col items-start justify-center py-20 md:py-[115px]">
        <Eyebrow light>{eyebrow}</Eyebrow>
        <h1 className="max-w-[850px] text-[clamp(3rem,13vw,5.5rem)] text-white lg:text-[clamp(4rem,7.3vw,7.3rem)]">
          {titleLead} <em className="block text-[#f3bd43]">{titleAccent}</em>
        </h1>
        <p className="mt-7 mb-9 max-w-[590px] text-base leading-[1.7] text-[#d6e0e3] md:text-lg">
          {text}
        </p>
        <div className="flex flex-col items-start gap-[22px] sm:flex-row sm:items-center sm:gap-[30px]">
          <ButtonLink href={primaryCta.href} variant="secondary" arrow>
            {primaryCta.label}
          </ButtonLink>
          <ButtonLink href={secondaryCta.href} variant="link-light" arrow>
            {secondaryCta.label}
          </ButtonLink>
        </div>
      </Container>

      {note && (
        <div className="border-gold absolute right-0 bottom-0 z-10 hidden border-l-4 bg-[#0d3447] py-[22px] pr-[55px] pl-7 text-white lg:block">
          <b className="block text-xs">{note.title}</b>
          <span className="mt-1 block text-xs text-[#9fb0b8]">
            {note.subtitle}
          </span>
        </div>
      )}
    </section>
  );
}
