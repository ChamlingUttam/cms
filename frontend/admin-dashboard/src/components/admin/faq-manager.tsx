'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  ManagementLoadError,
} from '@/components/admin/_components/management-load-error';
import { ManagementPageHeader } from '@/components/admin/_components/management-page-header';
import { ManagementSkeleton } from '@/components/admin/_components/management-skeleton';
import { FaqCreatePanel } from '@/components/admin/faqs/faq-create-panel';
import { FaqList } from '@/components/admin/faqs/faq-list';
import {
  useCreateFaq,
  useDeleteFaq,
  useFaqs,
  useUpdateFaq,
} from '@/hooks/use-content';
import { getApiErrorMessage } from '@/lib/api-error';
import type { Faq, FaqInput } from '@/types/content';

export function FaqManager() {
  const faqsQuery = useFaqs();
  const createMutation = useCreateFaq();
  const updateMutation = useUpdateFaq();
  const deleteMutation = useDeleteFaq();
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);

  if (faqsQuery.isPending) {
    return <ManagementSkeleton />;
  }

  if (faqsQuery.isError) {
    return (
      <ManagementLoadError
        error={faqsQuery.error}
        onRetry={() => void faqsQuery.refetch()}
        title="Could not load FAQs"
      />
    );
  }

  async function handleCreate(input: FaqInput) {
    try {
      await createMutation.mutateAsync(input);
      toast.success('FAQ created.');
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not create the FAQ.'));
      return false;
    }
  }

  async function handleUpdate(faq: Faq, input: FaqInput) {
    try {
      await updateMutation.mutateAsync({ id: faq.id, input });
      setEditingFaqId(null);
      toast.success('FAQ updated.');
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not update the FAQ.'));
      return false;
    }
  }

  async function handleDelete(faq: Faq) {
    if (!window.confirm(`Delete this FAQ?\n\n${faq.question}`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(faq.id);
      toast.success('FAQ deleted.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not delete the FAQ.'));
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <ManagementPageHeader
        description="Create and maintain the questions and answers shown on your website."
        title="FAQs"
      />
      <FaqCreatePanel
        onCreate={handleCreate}
        pending={createMutation.isPending}
      />
      <FaqList
        editingFaqId={editingFaqId}
        faqs={faqsQuery.data}
        onCancel={() => setEditingFaqId(null)}
        onDelete={(faq) => void handleDelete(faq)}
        onEdit={setEditingFaqId}
        onUpdate={handleUpdate}
        pending={updateMutation.isPending}
        pendingDelete={deleteMutation.isPending}
      />
    </div>
  );
}
