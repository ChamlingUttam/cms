'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LoaderCircle, LockKeyhole, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAdminLogin } from '@/hooks/use-admin-auth';
import { getAdminToken } from '@/service/auth-service';

function getLoginError(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to sign in. Please try again.';
}

export function LoginForm() {
  const router = useRouter();
  const login = useAdminLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (getAdminToken()) {
      router.replace('/dashboard');
    }
  }, [router]);

  useEffect(() => {
    function clearCredentials() {
      setUsername('');
      setPassword('');
      setShowPassword(false);
    }

    window.addEventListener('admin:auth-change', clearCredentials);
    return () => window.removeEventListener('admin:auth-change', clearCredentials);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await login.mutateAsync({ username: username.trim(), password });
      setUsername('');
      setPassword('');
      setShowPassword(false);
      toast.success('Signed in successfully.');
      router.replace('/dashboard');
    } catch (error) {
      toast.error(getLoginError(error));
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <section className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LockKeyhole aria-hidden="true" className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your administrator credentials to continue.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <UserRound
                aria-hidden="true"
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                autoComplete="username"
                className="h-10 w-full rounded-lg border bg-background pl-10 pr-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                id="username"
                maxLength={64}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your username"
                required
                value={username}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <LockKeyhole
                aria-hidden="true"
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                autoComplete="current-password"
                className="h-10 w-full rounded-lg border bg-background pl-10 pr-11 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setShowPassword((visible) => !visible)}
                type="button"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" className="size-4" />
                ) : (
                  <Eye aria-hidden="true" className="size-4" />
                )}
              </button>
            </div>
          </div>

          <Button className="h-10 w-full" disabled={login.isPending} type="submit">
            {login.isPending ? (
              <>
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </section>
    </main>
  );
}
