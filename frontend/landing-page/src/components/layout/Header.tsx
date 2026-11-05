"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Icon } from "@/components/ui/Icon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems } from "@/data/navigation";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu if the viewport grows to the desktop layout.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="border-line bg-cream/95 sticky top-0 z-40 h-[70px] border-b backdrop-blur-md lg:h-[82px]">
      <div className="mx-auto flex h-full max-w-[1300px] items-center justify-between px-[18px] sm:px-7">
        <Logo />

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex lg:items-center lg:gap-[31px]"
        >
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative text-sm font-semibold after:absolute after:-bottom-[11px] after:left-0 after:h-0.5 after:bg-[#e9ad2f] after:transition-all after:content-['']",
                  active
                    ? "text-ink after:w-full"
                    : "text-[#4b6069] after:w-0 hover:after:w-full"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <ButtonLink href="/contact" size="sm" arrow>
            Enquire now
          </ButtonLink>
        </nav>

        {/* Mobile / tablet navigation (shadcn Sheet) */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
            >
              <Icon name="menu" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] max-w-sm gap-0 p-0">
            <SheetHeader className="border-line border-b p-5">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Main site navigation
              </SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile navigation" className="flex flex-col p-5">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "border-line border-b py-4 text-lg font-semibold",
                        active ? "text-ink" : "text-[#4b6069]"
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                );
              })}
              <SheetClose asChild>
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "mt-6 self-start"
                  )}
                >
                  Enquire now
                  <Icon name="arrow" size={18} />
                </Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
