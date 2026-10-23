import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { GalleryPagination } from '@/types/gallery';
import { formatDate, type DateFilter } from './gallery-utils';

interface GalleryToolbarProps {
  customFrom: string;
  customTo: string;
  filter: DateFilter;
  onClear: () => void;
  onCustomFromChange: (value: string) => void;
  onCustomToChange: (value: string) => void;
  onFilterChange: (filter: DateFilter) => void;
  pagination?: GalleryPagination;
}

export function GalleryToolbar({
  customFrom,
  customTo,
  filter,
  onClear,
  onCustomFromChange,
  onCustomToChange,
  onFilterChange,
  pagination,
}: GalleryToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="grid gap-1.5 text-sm font-medium">
          Date filter
          <select
            className="h-8 min-w-44 rounded-lg border border-input bg-background px-2.5 text-sm"
            onChange={(event) =>
              onFilterChange(event.target.value as DateFilter)
            }
            value={filter}
          >
            <option value="all">All dates</option>
            <option value="today">Today</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="custom">Custom date range</option>
          </select>
        </label>
        {filter === 'custom' && (
          <>
            <label className="grid gap-1.5 text-sm font-medium">
              Start date
              <Input
                max={customTo || undefined}
                onChange={(event) => onCustomFromChange(event.target.value)}
                type="date"
                value={customFrom}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              End date
              <Input
                min={customFrom || undefined}
                onChange={(event) => onCustomToChange(event.target.value)}
                type="date"
                value={customTo}
              />
            </label>
            {customFrom && customTo && (
              <p className="pb-1 text-sm text-muted-foreground">
                {formatDate(customFrom)} – {formatDate(customTo)}
              </p>
            )}
          </>
        )}
        {filter !== 'all' && (
          <Button onClick={onClear} variant="ghost">
            Clear date filter
          </Button>
        )}
      </div>
      {pagination && (
        <p className="text-sm text-muted-foreground">
          {pagination.totalItems}{' '}
          {pagination.totalItems === 1 ? 'image' : 'images'}
        </p>
      )}
    </div>
  );
}
