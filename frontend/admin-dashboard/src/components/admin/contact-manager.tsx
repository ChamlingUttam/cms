'use client';

import { useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import {
  AtSign,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { ManagementSkeleton } from '@/components/admin/_components/management-skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useContactInfo,
  useCreateContactInfo,
  useDeleteContactInfo,
  useUpdateContactInfo,
} from '@/hooks/use-content';
import { getApiErrorMessage } from '@/lib/api-error';
import type { ContactInfo, ContactInput } from '@/types/content';

function ContactFields({
  initialValue,
  submitLabel,
  pending,
  onCancel,
  onSubmit,
}: {
  initialValue?: ContactInput;
  submitLabel: string;
  pending: boolean;
  onCancel?: () => void;
  onSubmit: (input: ContactInput) => Promise<boolean>;
}) {
  const [address, setAddress] = useState(initialValue?.address ?? '');
  const [email, setEmail] = useState(initialValue?.email ?? '');
  const [phoneNo, setPhoneNo] = useState(initialValue?.phoneNo ?? '');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = {
      address: address.trim(),
      email: email.trim(),
      phoneNo: phoneNo.trim(),
    };

    if (!input.address && !input.email && !input.phoneNo) {
      toast.error('Enter at least one contact detail.');
      return;
    }

    const saved = await onSubmit(input);
    if (saved && !initialValue) {
      setAddress('');
      setEmail('');
      setPhoneNo('');
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="contact-email">
            Email address
          </label>
          <Input
            autoComplete="email"
            id="contact-email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="hello@example.com"
            value={email}
          />
          <p className="text-xs text-muted-foreground">
            Multiple addresses can be separated with a comma.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="contact-phone">
            Phone number
          </label>
          <Input
            autoComplete="tel"
            id="contact-phone"
            onChange={(event) => setPhoneNo(event.target.value)}
            placeholder="+1 555 0100"
            value={phoneNo}
          />
          <p className="text-xs text-muted-foreground">
            Multiple numbers can be separated with a comma.
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="contact-address">
          Address
        </label>
        <textarea
          className="flex min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          id="contact-address"
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Street, city, and postal address"
          value={address}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button disabled={pending} type="submit">
          {initialValue ? (
            <Save aria-hidden="true" />
          ) : (
            <Plus aria-hidden="true" />
          )}
          {pending ? 'Saving…' : submitLabel}
        </Button>
        {onCancel && (
          <Button
            disabled={pending}
            onClick={onCancel}
            type="button"
            variant="outline"
          >
            <X aria-hidden="true" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function ContactDetails({ contact }: { contact: ContactInfo }) {
  const rows = [
    { label: 'Email', value: contact.email, icon: AtSign },
    { label: 'Phone', value: contact.phoneNo, icon: Phone },
    { label: 'Address', value: contact.address, icon: MapPin },
  ];

  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {rows.map(({ label, value, icon: Icon }) => (
        <div className="flex gap-3" key={label}>
          <Icon
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
          />
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-1 whitespace-pre-wrap break-words text-sm">
              {value || 'Not provided'}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export function ContactManager() {
  const contactQuery = useContactInfo();
  const createMutation = useCreateContactInfo();
  const updateMutation = useUpdateContactInfo();
  const deleteMutation = useDeleteContactInfo();
  const [editing, setEditing] = useState(false);
  const isMissingContact =
    isAxiosError(contactQuery.error) && contactQuery.error.response?.status === 404;

  if (contactQuery.isPending) {
    return <ManagementSkeleton />;
  }

  if (contactQuery.isError && !isMissingContact) {
    return (
      <section className="mx-auto w-full max-w-6xl space-y-4 rounded-xl border bg-card p-6">
        <h2 className="font-semibold">Could not load contact information</h2>
        <p className="text-sm text-muted-foreground">
          {getApiErrorMessage(contactQuery.error, 'Please try again.')}
        </p>
        <Button onClick={() => void contactQuery.refetch()} variant="outline">
          Try again
        </Button>
      </section>
    );
  }

  const contact = isMissingContact ? null : contactQuery.data;

  async function handleCreate(input: ContactInput) {
    try {
      await createMutation.mutateAsync(input);
      toast.success('Contact information created.');
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not create contact information.'));
      return false;
    }
  }

  async function handleUpdate(input: ContactInput) {
    try {
      await updateMutation.mutateAsync(input);
      setEditing(false);
      toast.success('Contact information updated.');
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not update contact information.'));
      return false;
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete the public contact information?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync();
      setEditing(false);
      toast.success('Contact information deleted.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not delete contact information.'));
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contact information</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the public address, email, and phone number displayed on your website.
        </p>
      </div>

      {(contact === null || editing) && (
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
            onCancel={contact ? () => setEditing(false) : undefined}
            onSubmit={contact ? handleUpdate : handleCreate}
            pending={createMutation.isPending || updateMutation.isPending}
            submitLabel={contact ? 'Save changes' : 'Create contact information'}
          />
        </section>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Saved contact information</h2>
          <p className="text-sm text-muted-foreground">
            {contact ? 'One site-wide contact record' : 'No contact record saved yet'}
          </p>
        </div>
        {contact ? (
          <article className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <h3 className="font-semibold">Website contact details</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Public contact information
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  disabled={deleteMutation.isPending}
                  onClick={() => setEditing(true)}
                  size="sm"
                  variant="outline"
                >
                  <Pencil aria-hidden="true" />
                  Edit
                </Button>
                <Button
                  disabled={deleteMutation.isPending}
                  onClick={() => void handleDelete()}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 aria-hidden="true" />
                  Delete
                </Button>
              </div>
            </div>
            <ContactDetails contact={contact} />
          </article>
        ) : (
          <div className="rounded-xl border border-dashed bg-card px-6 py-12 text-center">
            <h3 className="font-medium">No contact information yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Use the form above to add the contact details for your website.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
