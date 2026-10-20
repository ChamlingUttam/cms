import { Settings } from 'lucide-react';
import { SectionPage } from '@/components/admin/_components/section-page';

export default function AdminSettingsPage() {
  return (
    <SectionPage
      description="Manage your administrator account and workspace preferences."
      icon={Settings}
      title="Settings"
    />
  );
}
