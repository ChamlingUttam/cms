'use client';

import { usePathname, useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useEffect, useSyncExternalStore } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ManagementSkeleton } from '@/components/admin/_components/management-skeleton';
import { useCurrentAdmin } from '@/hooks/use-admin-auth';
import {
  clearAdminToken,
  getAdminToken,
  logoutAdmin,
  subscribeToAuthChanges,
} from '@/service/auth-service';
import { AdminNavbar } from './admin-navbar';
import { AdminSidebar } from './admin-sidebar';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/blogs': 'Blog posts',
  '/faqs': 'FAQs',
  '/gallery': 'Gallery',
  '/testimonials': 'Testimonials',
  '/contacts': 'Contacts',
  '/settings': 'Settings',
};

function hasAdminToken() {
  return Boolean(getAdminToken());
}

export function AdminShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';
  const isPublicPage = pathname === '/' || isLoginPage;
  const hasToken = useSyncExternalStore(
    subscribeToAuthChanges,
    hasAdminToken,
    () => false,
  );
  const adminQuery = useCurrentAdmin(hasToken && !isPublicPage);

  useEffect(() => {
    if (!isPublicPage && !getAdminToken()) {
      router.replace('/login');
    }
  }, [isPublicPage, router]);

  useEffect(() => {
    if (
      !isPublicPage &&
      isAxiosError(adminQuery.error) &&
      adminQuery.error.response?.status === 401
    ) {
      clearAdminToken();
      toast.error('Your session has expired. Please sign in again.');
      router.replace('/login');
    }
  }, [adminQuery.error, isPublicPage, router]);

  async function handleLogout() {
    try {
      await logoutAdmin();
      toast.success('You have been signed out.');
    } catch {
      toast.error(
        'You were signed out on this device, but the server could not invalidate the session.',
      );
    }
    router.replace('/login');
  }

  if (isPublicPage) {
    return children;
  }

  const username = adminQuery.data?.username ?? 'Administrator';
  const currentTitle = pageTitles[pathname] ?? 'Admin';
  const sessionExpired =
    isAxiosError(adminQuery.error) && adminQuery.error.response?.status === 401;
  const isReady =
    hasToken && !adminQuery.isPending && !adminQuery.isError && !!adminQuery.data;

  return (
    <SidebarProvider>
      <AdminSidebar
        onLogout={handleLogout}
        pathname={pathname}
        username={username}
      />

      <SidebarInset>
        <AdminNavbar title={currentTitle} username={username} />
        <main
          aria-busy={!isReady}
          className="relative flex-1 p-4 sm:p-6 lg:p-8"
        >
          <div aria-hidden={!isReady} className={isReady ? 'contents' : 'invisible'}>
            {children}
          </div>
          {!isReady && (
            <div
              className="absolute inset-0 z-10 min-h-full bg-background px-4 py-6"
            >
              {adminQuery.isError && !sessionExpired ? (
                <div className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
                  <p className="max-w-md text-sm text-muted-foreground">
                    We couldn&apos;t load your admin workspace. Check your connection and try again.
                  </p>
                  <Button
                    onClick={() => void adminQuery.refetch()}
                    variant="outline"
                  >
                    Try again
                  </Button>
                </div>
              ) : (
                <ManagementSkeleton />
              )}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
