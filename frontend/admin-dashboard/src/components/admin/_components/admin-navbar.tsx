'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';

export function AdminNavbar({
  title,
  username,
}: {
  title: string;
  username: string;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <SidebarTrigger aria-label="Toggle navigation sidebar" />
      <div aria-hidden="true" className="h-5 w-px bg-border" />
      <h1 className="text-sm font-medium">{title}</h1>
      <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
        <span className="hidden sm:inline">Signed in as</span>
        <span className="max-w-36 truncate font-medium text-foreground">
          {username}
        </span>
      </div>
    </header>
  );
}
