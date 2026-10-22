import { Plus } from 'lucide-react';
import type { FaqInput } from '@/types/content';
import { FaqFields } from './faq-fields';

export function FaqCreatePanel({
  pending,
  onCreate,
}: {
  pending: boolean;
  onCreate: (input: FaqInput) => Promise<boolean>;
}) {
  return (
    <section className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Plus aria-hidden="true" className="size-4" />
        </span>
        <div>
          <h2 className="font-semibold">Create an FAQ</h2>
          <p className="text-sm text-muted-foreground">
            Add a question and its answer.
          </p>
        </div>
      </div>
      <FaqFields
        key="create-faq"
        onSubmit={onCreate}
        pending={pending}
        submitLabel="Create FAQ"
      />
    </section>
  );
}
