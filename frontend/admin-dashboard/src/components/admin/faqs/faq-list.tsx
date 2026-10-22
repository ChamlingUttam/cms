import { BookOpenText } from 'lucide-react';
import type { Faq, FaqInput } from '@/types/content';
import { FaqItem } from './faq-item';

export function FaqList({
  faqs,
  editingFaqId,
  pending,
  pendingDelete,
  onEdit,
  onCancel,
  onUpdate,
  onDelete,
}: {
  faqs: Faq[];
  editingFaqId: string | null;
  pending: boolean;
  pendingDelete: boolean;
  onEdit: (id: string) => void;
  onCancel: () => void;
  onUpdate: (faq: Faq, input: FaqInput) => Promise<boolean>;
  onDelete: (faq: Faq) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">All FAQs</h2>
          <p className="text-sm text-muted-foreground">
            {faqs.length} {faqs.length === 1 ? 'question' : 'questions'}
          </p>
        </div>
        <BookOpenText aria-hidden="true" className="size-5 text-muted-foreground" />
      </div>
      {faqs.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card px-6 py-12 text-center">
          <h3 className="font-medium">No FAQs yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the form above to create your first FAQ.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <FaqItem
              editing={editingFaqId === faq.id}
              faq={faq}
              key={faq.id}
              onCancel={onCancel}
              onDelete={onDelete}
              onEdit={() => onEdit(faq.id)}
              onUpdate={onUpdate}
              pending={pending}
              pendingDelete={pendingDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
