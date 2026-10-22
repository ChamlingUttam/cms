import { Pencil, ShieldCheck, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminProfileCard({
  username,
  editing,
  onEdit,
  children,
}: {
  username: string;
  editing: boolean;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-semibold">Administrator profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your sign-in username or password.
          </p>
        </div>
        {!editing && (
          <Button onClick={onEdit} size="sm" variant="outline">
            <Pencil aria-hidden="true" />
            Edit profile
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
          {username.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium">{username}</p>
          <p className="text-sm text-muted-foreground">Administrator account</p>
        </div>
      </div>

      {children}

      {!editing && (
        <div className="flex items-center gap-3 border-t pt-5 text-sm text-muted-foreground">
          <UserRound aria-hidden="true" className="size-4 shrink-0" />
          <span className="min-w-0 truncate">Username: {username}</span>
          <span aria-hidden="true">·</span>
          <ShieldCheck aria-hidden="true" className="size-4 shrink-0" />
          <span>Password protected</span>
        </div>
      )}
    </section>
  );
}
