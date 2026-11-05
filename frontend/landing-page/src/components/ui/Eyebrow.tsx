import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: ReactNode;
  light?: boolean;
  className?: string;
}

export function Eyebrow({ children, light = false, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "mb-5 inline-block text-[11px] font-bold tracking-[2.7px] uppercase md:mb-[27px]",
        light ? "text-[#f1be4d]" : "text-gold-dark",
        className
      )}
    >
      {children}
    </span>
  );
}
