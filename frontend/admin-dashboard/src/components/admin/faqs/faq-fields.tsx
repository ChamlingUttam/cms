'use client';

import { useState, type FormEvent } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { FaqInput } from '@/types/content';

export function FaqFields({
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
