// import Link from "next/link";
// import { buttonVariants } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import type { BlogPagination } from "@/types";

// const href = (page: number) => (page <= 1 ? "/blog" : `/blog?page=${page}`);

// /** Previous / next links with "Page X of Y". Hidden when there is only one page. */
// export function BlogPager({ pagination }: { pagination: BlogPagination }) {
//   const { page, totalPages } = pagination;
//   if (totalPages <= 1) return null;

//   return (
//     <nav
//       aria-label="Blog pages"
//       className="mt-12 flex items-center justify-between gap-4 md:mt-16"
//     >
//       {page > 1 ? (
//         <Link
//           href={href(page - 1)}
//           rel="prev"
//           className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5")}
//         >
//           ← Newer
//         </Link>
//       ) : (
//         <span aria-hidden="true" />
//       )}
//       <p className="text-sm">
//         Page {page} of {totalPages}
//       </p>
//       {page < totalPages ? (
//         <Link
//           href={href(page + 1)}
//           rel="next"
//           className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5")}
//         >
//           Older →
//         </Link>
//       ) : (
//         <span aria-hidden="true" />
//       )}
//     </nav>
//   );
// }

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BlogPagination } from "@/types";

const href = (page: number) => (page <= 1 ? "/blog" : `/blog?page=${page}`);

/** Previous / next links with "Page X of Y". Hidden when there is only one page. */
export function BlogPager({ pagination }: { pagination: BlogPagination }) {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Blog pages"
      className="mt-12 flex items-center justify-between gap-4 md:mt-16"
    >
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          rel="prev"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5")}
        >
          ← Newer
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
          Older →
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
