import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const spacings = {
  default: "py-16 md:py-24 lg:py-28",
  "flush-top": "pb-16 md:pb-24 lg:pb-28",
  intro: "pt-16 pb-10 md:pt-24 md:pb-12 lg:pt-28 lg:pb-[65px]",
} as const;

interface SectionProps {
  children: ReactNode;
  id?: string;
  spacing?: keyof typeof spacings;
  /** Classes for the full-width <section> (backgrounds, colours). */
  className?: string;
  /** Classes for the inner container (grids, alignment). */
  containerClassName?: string;
  "aria-labelledby"?: string;
}

export function Section({
  children,
  id,
  spacing = "default",
  className,
  containerClassName,
  "aria-labelledby": labelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(spacings[spacing], className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
