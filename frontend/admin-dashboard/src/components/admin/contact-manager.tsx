'use client';

import { useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { ManagementLoadError } from '@/components/admin/_components/management-load-error';
import { ManagementPageHeader } from '@/components/admin/_components/management-page-header';
import { ManagementSkeleton } from '@/components/admin/_components/management-skeleton';
import { ContactFormSection } from '@/components/admin/contacts/contact-form-section';
import { ContactList } from '@/components/admin/contacts/contact-list';
import {
  useContactInfo,
  useCreateContactInfo,
  useDeleteContactInfo,
  useUpdateContactInfo,
} from '@/hooks/use-content';
import { getApiErrorMessage } from '@/lib/api-error';
import type { ContactInput } from '@/types/content';

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
      <ManagementLoadError
        error={contactQuery.error}
        onRetry={() => void contactQuery.refetch()}
        title="Could not load contact information"
      />
    );
  }

  const contact = isMissingContact ? null : contactQuery.data ?? null;

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
      <ManagementPageHeader
        description="Manage the public address, email, and phone number displayed on your website."
        title="Contact information"
      />
      {(contact === null || editing) && (
        <ContactFormSection
          contact={contact}
          onCancel={() => setEditing(false)}
          onSubmit={contact ? handleUpdate : handleCreate}
          pending={createMutation.isPending || updateMutation.isPending}
        />
      )}
      <ContactList
        contact={contact ?? null}
        onDelete={() => void handleDelete()}
        onEdit={() => setEditing(true)}
        pending={deleteMutation.isPending}
      />
    </div>
  );
}
