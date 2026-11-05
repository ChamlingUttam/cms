import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  light?: boolean;
  onClick?: () => void;
}

export function Logo({ light = false, onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${siteConfig.name} home`}
      className="flex items-center gap-[11px] text-left"
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-[37px] rotate-45 place-items-center rounded-[3px] sm:size-[43px]",
          light ? "bg-[#f2b93e] text-[#103a4d]" : "bg-[#103a4d] text-white"
        )}
      >
        <span className="-rotate-45 font-serif text-xs italic">BA</span>
      </span>
      <span>
        <strong
          className={cn(
            "block text-base leading-[1.1] font-semibold tracking-[-0.4px] sm:text-[19px]",
            light && "text-white"
          )}
        >
          Brightwood
        </strong>
        <small className="mt-[3px] block text-[9px] font-bold tracking-[3px] text-[#e6a921]">
          ACADEMY
        </small>
      </span>
    </Link>
  );
}
