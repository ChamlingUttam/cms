import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Faq, FaqInput } from '@/types/content';
import { FaqFields } from './faq-fields';

export function FaqItem({
  faq,
  editing,
  pending,
  pendingDelete,
  onEdit,
  onCancel,
  onUpdate,
  onDelete,
}: {
  faq: Faq;
  editing: boolean;
  pending: boolean;
  pendingDelete: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onUpdate: (faq: Faq, input: FaqInput) => Promise<boolean>;
  onDelete: (faq: Faq) => void;
}) {
  return (
    <article className="space-y-4 rounded-xl border bg-card p-5 shadow-sm" key={faq.id}>
      {editing ? (
        <>
          <h3 className="font-medium">Edit FAQ</h3>
          <FaqFields
            initialValue={{ question: faq.question, answer: faq.answer }}
            onCancel={onCancel}
            onSubmit={(input) => onUpdate(faq, input)}
            pending={pending}
            submitLabel="Save changes"
          />
        </>
      ) : (
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="space-y-2">
            <h3 className="font-semibold">{faq.question}</h3>
            <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {faq.answer}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              aria-label={`Edit FAQ: ${faq.question}`}
              disabled={pendingDelete}
              onClick={onEdit}
              size="sm"
              variant="outline"
            >
              <Pencil aria-hidden="true" />
              Edit
            </Button>
            <Button
              aria-label={`Delete FAQ: ${faq.question}`}
              disabled={pendingDelete}
              onClick={() => onDelete(faq)}
              size="sm"
              variant="destructive"
            >
              <Trash2 aria-hidden="true" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}
