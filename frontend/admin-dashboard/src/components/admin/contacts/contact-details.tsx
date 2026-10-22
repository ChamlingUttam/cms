import { AtSign, MapPin, Phone } from 'lucide-react';
import type { ContactInfo } from '@/types/content';

export function ContactDetails({ contact }: { contact: ContactInfo }) {
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
