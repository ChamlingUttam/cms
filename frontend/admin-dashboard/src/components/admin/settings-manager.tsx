'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ManagementLoadError } from '@/components/admin/_components/management-load-error';
import { ManagementPageHeader } from '@/components/admin/_components/management-page-header';
import { AdminCredentialForm, type CredentialEditMode } from '@/components/admin/settings/admin-credential-form';
import { AdminCredentialOptions } from '@/components/admin/settings/admin-credential-options';
import { AdminProfileCard } from '@/components/admin/settings/admin-profile-card';
import { SettingsSkeleton } from '@/components/admin/settings/settings-skeleton';
import { useCurrentAdmin, useUpdateAdminCredentials } from '@/hooks/use-admin-auth';
import { getApiErrorMessage } from '@/lib/api-error';
import type { AdminCredentialUpdate } from '@/types/auth';

export function SettingsManager() {
  const adminQuery = useCurrentAdmin(true);
  const updateMutation = useUpdateAdminCredentials();
  const [editMode, setEditMode] = useState<CredentialEditMode | 'choose' | null>(
    null,
  );

  if (adminQuery.isPending) {
    return <SettingsSkeleton />;
  }

  if (adminQuery.isError || !adminQuery.data) {
    return (
      <ManagementLoadError
        error={adminQuery.error}
        onRetry={() => void adminQuery.refetch()}
        title="Could not load account settings"
      />
    );
  }

  async function handleSubmit(credentials: AdminCredentialUpdate) {
    try {
      await updateMutation.mutateAsync(credentials);
      toast.success('Account credentials updated.');
      setEditMode(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not update account credentials.'));
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <ManagementPageHeader
        description="Manage your administrator account and workspace preferences."
        title="Settings"
      />
      <AdminProfileCard
        editing={editMode !== null}
        onEdit={() => setEditMode('choose')}
        username={adminQuery.data.username}
      >
        {editMode === 'choose' && (
          <AdminCredentialOptions
            onCancel={() => setEditMode(null)}
            onChoosePassword={() => setEditMode('password')}
            onChooseUsername={() => setEditMode('username')}
          />
        )}
        {(editMode === 'username' || editMode === 'password') && (
          <AdminCredentialForm
            currentUsername={adminQuery.data.username}
            mode={editMode}
            onCancel={() => setEditMode('choose')}
            onSubmit={handleSubmit}
            pending={updateMutation.isPending}
          />
        )}
      </AdminProfileCard>
    </div>
  );
}
