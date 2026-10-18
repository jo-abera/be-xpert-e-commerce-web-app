import React from 'react';
import Link from 'next/link';
import { ShieldAlertIcon } from 'lucide-react';
import { Button, buttonVariants } from '../ui/Button';
import { Badge } from '../ui/app-badge';
import { useAdminStore } from "@/store/admin-store";
import type { User } from '@/types/user';

export function AdminAccessGate({ profile }: {profile: User;}) {
  const enableDevAccess = useAdminStore((s) => s.enableDevAccess);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-lg">
        <ShieldAlertIcon className="h-9 w-9 text-warning" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Admin access isn't verified</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          You're signed in as <span className="font-medium text-foreground">{profile.email}</span> with the role{' '}
          <Badge tone="outline">{profile.role}</Badge>. EscuelaJS is a shared public API: it returns a role on profiles,
          but it does not provide trustworthy, server-enforced administrator permissions.
        </p>
        <div className="mt-6 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
          <p className="font-medium">Development-only access</p>
          <p className="mt-1 text-foreground/80">
            For demonstration, you can open the dashboard with a client-side flag. This is not secure authorization and
            must be replaced by backend role checks in production.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={enableDevAccess}>Continue in development mode</Button>
          <Link href="/" className={buttonVariants('ghost')}>Back to store</Link>
        </div>
      </div>
    </main>);

}