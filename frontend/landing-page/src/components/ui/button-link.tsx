import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "children"> &
  Pick<ComponentProps<typeof Button>, "variant" | "size"> & {
    /** Appends an arrow icon after the label. */
    arrow?: boolean;
    children: ReactNode;
  };

/** A shadcn Button rendered as a Next.js <Link>. */
export function ButtonLink({
  variant,
  size,
  arrow = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link {...props}>
        {children}
        {arrow && <Icon name="arrow" size={18} />}
      </Link>
    </Button>
  );
}
