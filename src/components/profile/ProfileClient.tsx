'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangleIcon, LogOutIcon, MailIcon, ShieldIcon, ShoppingBagIcon, UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar } from '@/components/ui/user-avatar';
import { Badge } from '@/components/ui/app-badge';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { StateMessage } from '@/components/ui/StateMessage';
import { useLogout, useProfile } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/lib/api/client';

export function ProfileClient() {
  useDocumentTitle('Profile');
  const router = useRouter();
  const { data: profile, isLoading, isError, error, refetch } = useProfile();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    toast.success('You have been signed out');
    router.push('/');
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your Profile</h1>
        <p className="mt-1.5 text-muted-foreground">Manage your account information and preferences</p>
      </div>

      {isLoading ?
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm" role="status" aria-label="Loading profile">
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
          </div>
        </div> :
      isError || !profile ?
      <StateMessage
        tone="error"
        icon={AlertTriangleIcon}
        title="We couldn't load your profile"
        description={getErrorMessage(error)}
        action={<Button variant="outline" onClick={() => refetch()}>Try again</Button>}
        className="bg-card" /> :


      <section aria-label="Account details" className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-start gap-6 border-b border-border pb-8 sm:flex-row sm:items-center">
            <Avatar src={profile.avatar} name={profile.name} className="h-24 w-24 border-4 border-muted text-2xl" />
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-bold">{profile.name}</h2>
              <p className="mt-1 truncate text-muted-foreground">{profile.email}</p>
              <Badge className="mt-3 font-semibold uppercase tracking-wide text-foreground">{profile.role}</Badge>
            </div>
          </div>

          <dl className="divide-y divide-border py-2 text-[15px]">
            {[
          { icon: UserIcon, label: 'Full Name', value: profile.name },
          { icon: MailIcon, label: 'Email Address', value: profile.email },
          { icon: ShieldIcon, label: 'Account ID', value: String(profile.id) }].
          map(({ icon: Icon, label, value }) =>
          <div key={label} className="flex items-center justify-between gap-4 py-4">
                <dt className="flex items-center gap-3 text-muted-foreground">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="truncate font-medium text-foreground">{value}</dd>
              </div>
          )}
          </dl>

          <div className="mt-2 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/products" className={buttonVariants('outline', 'lg')}>
              <ShoppingBagIcon aria-hidden="true" />
              Continue Shopping
            </Link>
            <Button variant="destructive" size="lg" onClick={handleLogout}>
              <LogOutIcon aria-hidden="true" />
              Sign Out
            </Button>
          </div>
        </section>
      }
    </div>);

}