import { ButtonLink } from "@/components/ui/button-link";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import type { Program, ProgramTone } from "@/types";

const tones: Record<ProgramTone, string> = {
  yellow: "bg-[#f0ba42] text-ink",
  blue: "bg-[#174a62] text-white",
  green: "bg-sage text-white",
  coral: "bg-coral text-white",
};

export function ProgramGrid({ programs }: { programs: Program[] }) {
  return (
    <Section containerClassName="grid gap-5 md:grid-cols-2">
      {programs.map((program, index) => (
        <article
          key={program.slug}
          className={cn(
            "relative flex min-h-[380px] flex-col items-start overflow-hidden p-7 sm:p-10 lg:min-h-[420px] lg:p-12",
            "after:pointer-events-none after:absolute after:-top-10 after:-right-[45px] after:size-[180px] after:rounded-full after:border-[40px] after:border-white/20 after:content-['']",
            tones[program.tone]
          )}
        >
          <span
            aria-hidden="true"
            className="absolute top-[25px] right-[30px] font-serif text-[42px] opacity-45"
          >
            0{index + 1}
          </span>
          <small className="mb-auto text-[10px] font-bold tracking-[2px]">
            {program.age}
          </small>
          <h2 className="mb-5 text-[clamp(2.25rem,4vw,3rem)] leading-[1.02]">
            {program.title}
          </h2>
          <p className="mb-[30px] max-w-[470px] text-inherit opacity-85">
            {program.text}
          </p>
          <ButtonLink href="/contact" variant="link-current">
            Ask about this program
            <span className="sr-only"> — {program.title}</span>
          </ButtonLink>
        </article>
      ))}
    </Section>
  );
}
