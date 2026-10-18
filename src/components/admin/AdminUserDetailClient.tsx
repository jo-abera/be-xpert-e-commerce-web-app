'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangleIcon, Trash2Icon, UserXIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';
import { Avatar } from '@/components/ui/user-avatar';
import { Badge } from '@/components/ui/app-badge';
import { StateMessage } from '@/components/ui/StateMessage';
import { PageLoader } from '@/components/ui/PageLoader';
import { Button, buttonVariants } from '@/components/ui/Button';
import { DeleteUserDialog } from '@/components/admin/DeleteUserDialog';
import { useProfile } from '@/hooks/useAuth';
import { useDeleteUser, useUser } from '@/hooks/useUsers';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage, isNotFoundError } from '@/lib/api/client';
import { formatDate } from '@/utils/format';

export function AdminUserDetail({ userId: id }: { userId: string }) {
  const userId = Number(id);
  const router = useRouter();
  const { data: user, isLoading, isError, error, refetch } = useUser(userId);
  const { data: profile } = useProfile();
  const deleteUser = useDeleteUser();
  const [deleteOpen, setDeleteOpen] = useState(false);
  useDocumentTitle(user ? `Admin · ${user.name}` : 'Admin · User');

  const isSelf = profile?.id === user?.id;

  const handleDelete = () => {
    if (!user) return;
    deleteUser.mutate(user.id, {
      onSuccess: () => {
        toast.success('User deleted');
        setDeleteOpen(false);
        router.push('/admin/users');
      },
    });
  };

  if (!Number.isInteger(userId) || userId <= 0 || isError && isNotFoundError(error)) {
    return <StateMessage icon={UserXIcon} title="User not found" action={<Link href="/admin/users" className={buttonVariants('primary')}>Back to users</Link>} />;
  }
  if (isLoading) return <PageLoader label="Loading user…" />;
  if (isError || !user) {
    return <StateMessage tone="error" icon={AlertTriangleIcon} title="We couldn't load this user" description={getErrorMessage(error)} action={<Button variant="outline" onClick={() => refetch()}>Try again</Button>} />;
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={user.name}
        back={{ to: '/admin/users', label: 'All users' }}
        actions={
          isSelf ? undefined : (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                deleteUser.reset();
                setDeleteOpen(true);
              }}
            >
              <Trash2Icon className="h-4 w-4" aria-hidden="true" />
              Delete user
            </Button>
          )
        }
      />
      <div className="flex items-center gap-5">
        <Avatar src={user.avatar} name={user.name} className="h-20 w-20 text-xl" />
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{user.name}</p>
          <p className="truncate text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <dl className="mt-8 divide-y divide-border border-y border-border text-sm">
        {[
        ['User ID', `#${user.id}`],
        ['Role', <Badge key="role" tone={user.role === 'admin' ? 'warning' : 'outline'}>{user.role}</Badge>],
        ['Joined', formatDate(user.creationAt)],
        ['Last updated', formatDate(user.updatedAt)]].
        map(([label, value]) =>
        <div key={String(label)} className="flex justify-between gap-4 py-3">
            <dt className="text-muted-foreground">{label}</dt>
            <dd>{value}</dd>
          </div>
        )}
      </dl>
      {isSelf ? (
        <p className="mt-6 text-xs text-muted-foreground">
          You cannot delete the account you are logged in with.
        </p>
      ) : (
        <p className="mt-6 text-xs text-muted-foreground">
          Passwords are never shown. You can delete this user if the API allows it
          (typically only accounts you created).
        </p>
      )}

      <DeleteUserDialog
        user={user}
        open={deleteOpen}
        isPending={deleteUser.isPending}
        errorMessage={deleteUser.isError ? getErrorMessage(deleteUser.error) : undefined}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>);

}
