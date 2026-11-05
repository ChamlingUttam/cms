import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-3 rounded-md text-[13px] font-bold whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:brightness-110",
        secondary:
          "bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:brightness-105",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "border-b border-current text-[#143c4e] hover:opacity-70",
        "link-light":
          "border-b border-transparent text-white hover:border-current",
        "link-current": "border-b border-current text-inherit hover:opacity-70",
      },
      size: {
        default: "px-[22px] py-[15px]",
        sm: "px-[18px] py-[13px]",
        icon: "size-10",
      },
    },
    compoundVariants: [
      {
        variant: ["link", "link-light", "link-current"],
        className: "gap-2.5 rounded-none p-0 pb-[5px]",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      type={asChild ? type : type ?? "button"}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
