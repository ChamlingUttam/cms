'use client';

import { useState, type FormEvent } from 'react';
import { BookOpenText, Pencil, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { ManagementSkeleton } from '@/components/admin/_components/management-skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getApiErrorMessage } from '@/lib/api-error';
import {
  useCreateFaq,
  useDeleteFaq,
  useFaqs,
  useUpdateFaq,
} from '@/hooks/use-content';
import type { Faq, FaqInput } from '@/types/content';

function FaqFields({
  initialValue,
  submitLabel,
  pending,
  onCancel,
  onSubmit,
}: {
  initialValue?: FaqInput;
  submitLabel: string;
  pending: boolean;
  onCancel?: () => void;
  onSubmit: (input: FaqInput) => Promise<boolean>;
}) {
  const [question, setQuestion] = useState(initialValue?.question ?? '');
  const [answer, setAnswer] = useState(initialValue?.answer ?? '');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saved = await onSubmit({
      question: question.trim(),
      answer: answer.trim(),
    });

    if (saved && !initialValue) {
      setQuestion('');
      setAnswer('');
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="faq-question">
          Question
        </label>
        <Input
          autoComplete="off"
          id="faq-question"
          maxLength={500}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="e.g. What are your opening hours?"
          required
          value={question}
        />
        <p className="text-right text-xs text-muted-foreground">
          {question.length}/500
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="faq-answer">
          Answer
        </label>
        <textarea
          className="flex min-h-28 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          id="faq-answer"
          maxLength={5000}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Write a clear answer"
          required
          value={answer}
        />
        <p className="text-right text-xs text-muted-foreground">
          {answer.length}/5000
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button disabled={pending} type="submit">
          <Plus aria-hidden="true" />
          {pending ? 'Saving…' : submitLabel}
        </Button>
        {onCancel && (
          <Button disabled={pending} onClick={onCancel} type="button" variant="outline">
            <X aria-hidden="true" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

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
      <section className="mx-auto w-full max-w-6xl space-y-4 rounded-xl border bg-card p-6">
        <h2 className="font-semibold">Could not load FAQs</h2>
        <p className="text-sm text-muted-foreground">
          {getApiErrorMessage(faqsQuery.error, 'Please try again.')}
        </p>
        <Button onClick={() => void faqsQuery.refetch()} variant="outline">
          Try again
        </Button>
      </section>
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

  async function handleUpdate(id: string, input: FaqInput) {
    try {
      await updateMutation.mutateAsync({ id, input });
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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">FAQs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create and maintain the questions and answers shown on your website.
        </p>
      </div>

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
          onSubmit={handleCreate}
          pending={createMutation.isPending}
          submitLabel="Create FAQ"
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">All FAQs</h2>
            <p className="text-sm text-muted-foreground">
              {faqsQuery.data.length}{' '}
              {faqsQuery.data.length === 1 ? 'question' : 'questions'}
            </p>
          </div>
          <BookOpenText aria-hidden="true" className="size-5 text-muted-foreground" />
        </div>

        {faqsQuery.data.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card px-6 py-12 text-center">
            <h3 className="font-medium">No FAQs yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Use the form above to create your first FAQ.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {faqsQuery.data.map((faq) => (
              <article
                className="space-y-4 rounded-xl border bg-card p-5 shadow-sm"
                key={faq.id}
              >
                {editingFaqId === faq.id ? (
                  <>
                    <h3 className="font-medium">Edit FAQ</h3>
                    <FaqFields
                      initialValue={{
                        question: faq.question,
                        answer: faq.answer,
                      }}
                      onCancel={() => setEditingFaqId(null)}
                      onSubmit={(input) => handleUpdate(faq.id, input)}
                      pending={updateMutation.isPending}
                      submitLabel="Save changes"
                    />
                  </>
                ) : (
                  <>
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
                          disabled={deleteMutation.isPending}
                          onClick={() => setEditingFaqId(faq.id)}
                          size="sm"
                          variant="outline"
                        >
                          <Pencil aria-hidden="true" />
                          Edit
                        </Button>
                        <Button
                          aria-label={`Delete FAQ: ${faq.question}`}
                          disabled={deleteMutation.isPending}
                          onClick={() => void handleDelete(faq)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 aria-hidden="true" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
