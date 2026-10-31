import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { IconName } from "@/types";

interface IconBoxProps {
  name: IconName;
  className?: string;
}

export function IconBox({ name, className }: IconBoxProps) {
  return (
    <div
      className={cn(
        "bg-gold-soft grid size-12 place-items-center rounded-full text-[#153c4d]",
        className
      )}
    >
      <Icon name={name} />
    </div>
  );
}
