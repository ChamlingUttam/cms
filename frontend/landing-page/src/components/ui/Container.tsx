import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** Centers content at the site's max width with responsive side gutters. */
export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1244px] px-5 sm:px-7", className)}
    >
      {children}
    </div>
  );
}
