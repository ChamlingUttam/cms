import { Skeleton } from '@/components/ui/skeleton';

export function ManagementSkeleton() {
  return (
    <div
      aria-label="Loading content"
      className="mx-auto w-full max-w-6xl space-y-8"
      role="status"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <section className="space-y-4 rounded-xl border bg-card p-5">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-9 w-32" />
      </section>
      <section className="space-y-4 rounded-xl border bg-card p-5">
        <Skeleton className="h-5 w-32" />
        {[0, 1, 2].map((item) => (
          <div className="space-y-2 border-t pt-4" key={item}>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </section>
    </div>
  );
}
