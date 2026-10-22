import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/lib/api-error';

export function ManagementLoadError({
  title,
  error,
  onRetry,
}: {
  title: string;
  error: unknown;
  onRetry: () => void;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-4 rounded-xl border bg-card p-6">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">
        {getApiErrorMessage(error, 'Please try again.')}
      </p>
      <Button onClick={onRetry} variant="outline">
        Try again
      </Button>
    </section>
  );
}
