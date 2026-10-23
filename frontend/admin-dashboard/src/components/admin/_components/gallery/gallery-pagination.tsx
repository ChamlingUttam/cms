import { Button } from '@/components/ui/button';
import type { GalleryPagination } from '@/types/gallery';

interface GalleryPaginationProps {
  pagination: GalleryPagination;
  page: number;
  isFetching: boolean;
  onPageChange: (page: number) => void;
}

export function GalleryPagination({
  pagination,
  page,
  isFetching,
  onPageChange,
}: GalleryPaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Gallery pagination"
      className="flex items-center justify-between gap-4"
    >
      <p className="text-sm text-muted-foreground">
        Page {pagination.page} of {pagination.totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          disabled={page <= 1 || isFetching}
          onClick={() => onPageChange(page - 1)}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          disabled={page >= pagination.totalPages || isFetching}
          onClick={() => onPageChange(page + 1)}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
