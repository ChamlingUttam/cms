'use client';

import { useState, type FormEvent } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ContactInput } from '@/types/content';

export function ContactFields({
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
          <Button disabled={pending} onClick={onCancel} type="button" variant="outline">
            <X aria-hidden="true" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
