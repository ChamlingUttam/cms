'use client';

import { useState } from 'react';
import { MessageSquareQuote, Pencil, Plus, Quote, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  ManagementLoadError,
} from '@/components/admin/_components/management-load-error';
import { ManagementPageHeader } from '@/components/admin/_components/management-page-header';
import { ManagementSkeleton } from '@/components/admin/_components/management-skeleton';
import {
  useCreateTestimonial,
  useDeleteTestimonial,
  useTestimonials,
  useUpdateTestimonial,
} from '@/hooks/use-content';
import { getApiErrorMessage } from '@/lib/api-error';
import type { Testimonial, TestimonialInput } from '@/types/content';
import { TestimonialFields } from './testimonial-fields';

export function TestimonialManager() {
  const testimonialsQuery = useTestimonials();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (testimonialsQuery.isPending) {
    return <ManagementSkeleton />;
  }

  if (testimonialsQuery.isError) {
    return (
      <ManagementLoadError
        error={testimonialsQuery.error}
        onRetry={() => void testimonialsQuery.refetch()}
        title="Could not load testimonials"
      />
    );
  }

  async function handleCreate(input: TestimonialInput) {
    try {
      await createMutation.mutateAsync(input);
      toast.success('Testimonial created.');
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not create the testimonial.'));
      return false;
    }
  }

  async function handleUpdate(
    testimonial: Testimonial,
    input: TestimonialInput,
  ) {
    try {
      await updateMutation.mutateAsync({ id: testimonial.id, input });
      setEditingId(null);
      toast.success('Testimonial updated.');
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not update the testimonial.'));
      return false;
    }
  }

  async function handleDelete(testimonial: Testimonial) {
    if (
      !window.confirm(
        `Delete this testimonial?\n\n${testimonial.name}`,
      )
    ) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(testimonial.id);
      toast.success('Testimonial deleted.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not delete the testimonial.'));
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <ManagementPageHeader
        description="Add and manage the stories and experiences shared on your website."
        title="Testimonials"
      />

      <section className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Plus aria-hidden="true" className="size-4" />
          </span>
          <div>
            <h2 className="font-semibold">Add a testimonial</h2>
            <p className="text-sm text-muted-foreground">
              Include the person’s name and their words. A portrait is optional.
            </p>
          </div>
        </div>
        <TestimonialFields
          onSubmit={handleCreate}
          pending={createMutation.isPending}
          submitLabel="Create testimonial"
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">All testimonials</h2>
            <p className="text-sm text-muted-foreground">
              {testimonialsQuery.data.length}{' '}
              {testimonialsQuery.data.length === 1
                ? 'testimonial'
                : 'testimonials'}
            </p>
          </div>
          <MessageSquareQuote
            aria-hidden="true"
            className="size-5 text-muted-foreground"
          />
        </div>

        {testimonialsQuery.data.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card px-6 py-12 text-center">
            <h3 className="font-medium">No testimonials yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your published testimonials will appear here after you add one.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {testimonialsQuery.data.map((testimonial) => {
              const editing = editingId === testimonial.id;
              return (
                <article
                  className="space-y-4 rounded-xl border bg-card p-5 shadow-sm"
                  key={testimonial.id}
                >
                  {editing ? (
                    <>
                      <h3 className="font-semibold">Edit testimonial</h3>
                      <TestimonialFields
                        currentImageUrl={testimonial.imageUrl}
                        initialValue={{
                          name: testimonial.name,
                          description: testimonial.description,
                          profession: testimonial.profession ?? '',
                        }}
                        onCancel={() => setEditingId(null)}
                        onSubmit={(input) => handleUpdate(testimonial, input)}
                        pending={updateMutation.isPending}
                        submitLabel="Save changes"
                      />
                    </>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <Quote
                          aria-hidden="true"
                          className="size-5 shrink-0 text-muted-foreground"
                        />
                        <div className="flex gap-2">
                          <Button
                            aria-label={`Edit testimonial by ${testimonial.name}`}
                            disabled={deleteMutation.isPending}
                            onClick={() => setEditingId(testimonial.id)}
                            size="sm"
                            variant="outline"
                          >
                            <Pencil aria-hidden="true" />
                            Edit
                          </Button>
                          <Button
                            aria-label={`Delete testimonial by ${testimonial.name}`}
                            disabled={deleteMutation.isPending}
                            onClick={() => void handleDelete(testimonial)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 aria-hidden="true" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      <blockquote className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                        “{testimonial.description}”
                      </blockquote>
                      <div className="flex items-center gap-3 border-t pt-4">
                        {testimonial.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            alt=""
                            className="size-11 rounded-full border object-cover"
                            src={testimonial.imageUrl}
                            srcSet={testimonial.srcSet ?? undefined}
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="flex size-11 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground"
                          >
                            {testimonial.name.slice(0, 1).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {testimonial.name}
                          </p>
                          {testimonial.profession && (
                            <p className="truncate text-sm text-muted-foreground">
                              {testimonial.profession}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
