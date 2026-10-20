'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminToken, subscribeToAuthChanges } from '@/service/auth-service';

export default function Validation() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    function syncAuthentication() {
      setIsAuthenticated(Boolean(getAdminToken()));
    }

    const unsubscribe = subscribeToAuthChanges(syncAuthentication);
    syncAuthentication();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isAuthenticated !== null) {
      router.replace(isAuthenticated ? '/dashboard' : '/login');
    }
  }, [isAuthenticated, router]);

  return (
    <main
      aria-label="Checking authentication"
      className="flex min-h-screen items-center justify-center text-sm text-muted-foreground"
      role="status"
    >
      Checking your session…
    </main>
  );
}
