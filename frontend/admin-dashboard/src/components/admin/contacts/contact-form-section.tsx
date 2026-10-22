import type { ContactInfo, ContactInput } from '@/types/content';
import { ContactFields } from './contact-fields';

export function ContactFormSection({
  contact,
  pending,
  onCancel,
  onSubmit,
}: {
  contact: ContactInfo | null;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (input: ContactInput) => Promise<boolean>;
}) {
  return (
    <section className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="font-semibold">
          {contact ? 'Edit contact information' : 'Add contact information'}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter at least one detail. This is a single shared contact record.
        </p>
      </div>
      <ContactFields
        key={contact ? `edit-${contact.id}` : 'create-contact'}
        initialValue={
          contact
            ? {
                address: contact.address ?? '',
                email: contact.email ?? '',
                phoneNo: contact.phoneNo ?? '',
              }
            : undefined
        }
        onCancel={contact ? onCancel : undefined}
        onSubmit={onSubmit}
        pending={pending}
        submitLabel={contact ? 'Save changes' : 'Create contact information'}
      />
    </section>
  );
}
