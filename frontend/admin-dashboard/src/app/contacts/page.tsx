import { Users } from 'lucide-react';
import { SectionPage } from '@/components/admin/_components/section-page';

export default function AdminContactsPage() {
  return (
    <SectionPage
      description="Review messages submitted through your website contact form."
      icon={Users}
      title="Contacts"
    />
  );
}
