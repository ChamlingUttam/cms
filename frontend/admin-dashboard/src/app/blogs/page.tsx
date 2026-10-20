import { FileText } from 'lucide-react';
import { SectionPage } from '@/components/admin/_components/section-page';

export default function AdminBlogsPage() {
  return (
    <SectionPage
      description="Create and organize the articles published on your website."
      icon={FileText}
      title="Blog posts"
    />
  );
}
