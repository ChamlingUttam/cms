import { KeyRound, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminCredentialOptions({
  onChooseUsername,
  onChoosePassword,
  onCancel,
}: {
  onChooseUsername: () => void;
  onChoosePassword: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4 border-t pt-5">
      <div>
        <h3 className="font-medium">Choose what to update</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your username or password separately.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onChooseUsername} type="button" variant="outline">
          <UserRound aria-hidden="true" />
          Update username
        </Button>
        <Button onClick={onChoosePassword} type="button" variant="outline">
          <KeyRound aria-hidden="true" />
          Update password
        </Button>
        <Button onClick={onCancel} type="button" variant="ghost">
          Cancel
        </Button>
      </div>
    </div>
  );
}
