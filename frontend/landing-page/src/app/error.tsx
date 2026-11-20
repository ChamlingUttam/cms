"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section containerClassName="flex min-h-[55vh] flex-col items-start justify-center">
      <Eyebrow>Something went wrong</Eyebrow>
      <h1 className="text-[clamp(2.75rem,8vw,6rem)]">
        That didn’t <em className="block text-[#ce9420]">work as planned.</em>
      </h1>
      <p className="mt-6 mb-8 max-w-md">
        An unexpected error occurred. Please try again, or come back in a moment.
      </p>
      <Button onClick={reset}>
        Try again
        <Icon name="arrow" size={18} />
      </Button>
    </Section>
  );
}
