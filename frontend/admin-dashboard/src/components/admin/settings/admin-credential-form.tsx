'use client';

import { useState, type FormEvent } from 'react';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AdminCredentialUpdate } from '@/types/auth';

export type CredentialEditMode = 'username' | 'password';

export function AdminCredentialForm({
  currentUsername,
  mode,
  pending,
  onCancel,
  onSubmit,
}: {
  currentUsername: string;
  mode: CredentialEditMode;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (credentials: AdminCredentialUpdate) => Promise<void>;
}) {
  const [username, setUsername] = useState(currentUsername);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const current = currentPassword;

    if (!current) {
      toast.error('Enter your current password to confirm this change.');
      return;
    }

    if (mode === 'username') {
      const nextUsername = username.trim();
      if (!nextUsername || nextUsername.length > 64) {
        toast.error('Username must be between 1 and 64 characters.');
        return;
      }
      if (nextUsername === currentUsername) {
        toast.error('Enter a different username before saving.');
        return;
      }
      await onSubmit({ currentPassword: current, newUsername: nextUsername });
      return;
    }

    if (newPassword.length < 12) {
      toast.error('Your new password must be at least 12 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('The new passwords do not match.');
      return;
    }

    await onSubmit({ currentPassword: current, newPassword });
  }

  return (
    <form className="space-y-5 border-t pt-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:max-w-xl sm:grid-cols-2">
        {mode === 'username' ? (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="settings-username">
              New username
            </label>
            <Input
              autoComplete="username"
              id="settings-username"
              maxLength={64}
              onChange={(event) => setUsername(event.target.value)}
              required
              value={username}
            />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="settings-new-password">
                New password
              </label>
              <Input
                autoComplete="new-password"
                id="settings-new-password"
                minLength={12}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                type="password"
                value={newPassword}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor="settings-confirm-password"
              >
                Confirm new password
              </label>
              <Input
                autoComplete="new-password"
                id="settings-confirm-password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                type="password"
                value={confirmPassword}
              />
            </div>
          </>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="settings-current-password">
            Current password
          </label>
          <Input
            autoComplete="current-password"
            id="settings-current-password"
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
            type="password"
            value={currentPassword}
          />
        </div>
      </div>
      {mode === 'password' && (
        <p className="text-xs text-muted-foreground">
          New passwords must contain at least 12 characters.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button disabled={pending} type="submit">
          <Save aria-hidden="true" />
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
        <Button disabled={pending} onClick={onCancel} type="button" variant="outline">
          <X aria-hidden="true" />
          Back
        </Button>
      </div>
    </form>
  );
}
