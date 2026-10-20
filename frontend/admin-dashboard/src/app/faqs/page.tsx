import { BookOpenText } from 'lucide-react';
import { SectionPage } from '@/components/admin/_components/section-page';

export default function AdminFaqsPage() {
  return (
    <SectionPage
      description="Manage the frequently asked questions shown on your website."
      icon={BookOpenText}
      title="FAQs"
    />
  );
}
