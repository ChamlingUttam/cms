import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Pagination } from "@/types";

interface PagerProps {
  pagination: Pagination;
  /** Page URL without the query, e.g. "/blog" or "/gallery". */
  basePath?: string;
  ariaLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
}

/**
 * Previous / next links with "Page X of Y". Hidden when there is only one page.
 * Used by the blog (newer / older posts) and the gallery.
 */
export function BlogPager({
  pagination,
  basePath = "/blog",
  ariaLabel = "Blog pages",
  previousLabel = "← Newer",
  nextLabel = "Older →",
}: PagerProps) {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  const href = (target: number) =>
    target <= 1 ? basePath : `${basePath}?page=${target}`;

  return (
    <nav
      aria-label={ariaLabel}
      className="mt-12 flex items-center justify-between gap-4 md:mt-16"
    >
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          rel="prev"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5")}
        >
          {previousLabel}
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      <p className="text-sm">
        Page {page} of {totalPages}
      </p>
      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          rel="next"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5")}
        >
          {nextLabel}
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
