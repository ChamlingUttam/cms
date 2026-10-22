import type { ContactInfo } from '@/types/content';
import { ContactRecord } from './contact-record';

export function ContactList({
  contact,
  onEdit,
  onDelete,
  pending,
}: {
  contact: ContactInfo | null;
  onEdit: () => void;
  onDelete: () => void;
  pending: boolean;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Saved contact information</h2>
        <p className="text-sm text-muted-foreground">
          {contact ? 'One site-wide contact record' : 'No contact record saved yet'}
        </p>
      </div>
      {contact ? (
        <ContactRecord
          contact={contact}
          onDelete={onDelete}
          onEdit={onEdit}
          pending={pending}
        />
      ) : (
        <div className="rounded-xl border border-dashed bg-card px-6 py-12 text-center">
          <h3 className="font-medium">No contact information yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the form above to add the contact details for your website.
          </p>
        </div>
      )}
    </section>
  );
}
