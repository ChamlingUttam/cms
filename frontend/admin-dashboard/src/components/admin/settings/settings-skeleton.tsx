import { Skeleton } from '@/components/ui/skeleton';

export function SettingsSkeleton() {
  return (
    <div
      aria-label="Loading settings"
      className="mx-auto w-full max-w-6xl space-y-8"
      role="status"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <section className="space-y-6 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
        <Skeleton className="h-6 w-40" />
        <div className="flex items-center gap-4">
          <Skeleton className="size-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-9 w-28" />
      </section>
    </div>
  );
}
