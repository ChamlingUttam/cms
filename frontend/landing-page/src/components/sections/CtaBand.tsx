import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

interface CtaBandProps {
  eyebrow?: string;
  /** Heading content; wrap the highlighted word in <em>. */
  title: ReactNode;
  text: string;
  cta: { label: string; href: string };
  compact?: boolean;
}

export function CtaBand({
  eyebrow,
  title,
  text,
  cta,
  compact = false,
}: CtaBandProps) {
  return (
    <section
      className={cn(
        "bg-[#113b4d] text-center text-white",
        compact ? "py-[70px]" : "py-16 md:py-[95px]"
      )}
    >
      <Container>
        {eyebrow && <Eyebrow light>{eyebrow}</Eyebrow>}
        <h2
          className={cn(
            "[&_em]:text-gold mb-5 text-[clamp(2.25rem,5vw,4.7rem)] text-white",
            compact && "lg:text-[3.7rem]"
          )}
        >
          {title}
        </h2>
        <p className="mx-auto mb-7 max-w-xl text-[#b9c7cc]">{text}</p>
        <ButtonLink href={cta.href} variant="secondary" arrow>
          {cta.label}
        </ButtonLink>
      </Container>
    </section>
  );
}
