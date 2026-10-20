import { FolderOpen } from 'lucide-react';
import { SectionPage } from '@/components/admin/_components/section-page';

export default function AdminGalleryPage() {
  return (
    <SectionPage
      description="Organize the images in your website gallery."
      icon={FolderOpen}
      title="Gallery"
    />
  );
}
