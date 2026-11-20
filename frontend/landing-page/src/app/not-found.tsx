import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Section containerClassName="flex min-h-[55vh] flex-col items-start justify-center">
      <Eyebrow>Error 404</Eyebrow>
      <h1 className="text-[clamp(2.75rem,8vw,6rem)]">
        We can’t find <em className="block text-[#ce9420]">that page.</em>
      </h1>
      <p className="mt-6 mb-8 max-w-md">
        The page you’re looking for may have moved or no longer exists.
      </p>
      <ButtonLink href="/" arrow>
        Back to home
      </ButtonLink>
    </Section>
  );
}
