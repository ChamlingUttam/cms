import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** Italic serif accent shown after the title. */
  accent: string;
  light?: boolean;
  /** Puts the accent on its own line. */
  stacked?: boolean;
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  light = false,
  stacked = true,
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className={cn(
          "text-[clamp(2.25rem,5vw,4.7rem)]",
          light && "text-white"
        )}
      >
        {title}{" "}
        <em className={cn(stacked && "block", light && "text-gold")}>
          {accent}
        </em>
      </h2>
    </div>
  );
}
