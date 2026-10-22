import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ContactInfo } from '@/types/content';
import { ContactDetails } from './contact-details';

export function ContactRecord({
  contact,
  pending,
  onEdit,
  onDelete,
}: {
  contact: ContactInfo;
  pending: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h3 className="font-semibold">Website contact details</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Public contact information
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button disabled={pending} onClick={onEdit} size="sm" variant="outline">
            <Pencil aria-hidden="true" />
            Edit
          </Button>
          <Button disabled={pending} onClick={onDelete} size="sm" variant="destructive">
            <Trash2 aria-hidden="true" />
            Delete
          </Button>
        </div>
      </div>
      <ContactDetails contact={contact} />
    </article>
  );
}
