import { MessageSquareQuote } from 'lucide-react';
import { SectionPage } from '@/components/admin/_components/section-page';

export default function AdminTestimonialsPage() {
  return (
    <SectionPage
      description="Manage the testimonials displayed on your website."
      icon={MessageSquareQuote}
      title="Testimonials"
    />
  );
}
