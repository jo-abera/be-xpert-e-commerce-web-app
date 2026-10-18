'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangleIcon, UserXIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Avatar } from '@/components/ui/user-avatar';
import { Badge } from '@/components/ui/app-badge';
import { Button } from '@/components/ui/Button';
import { StateMessage } from '@/components/ui/StateMessage';
import { AdminTableShell } from '@/components/admin/AdminTableShell';
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton';
import { AdminSearchInput } from '@/components/admin/AdminSearchInput';
import { useUsers } from '@/hooks/useUsers';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/lib/api/client';
import { formatDate } from '@/utils/format';

const columns = [{ label: 'User' }, { label: 'Email' }, { label: 'Role' }, { label: 'Joined' }];

export function AdminUsers() {
  useDocumentTitle('Users');
  const { data, isLoading, isError, error, refetch } = useUsers();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!data) return [];
    if (!q) return data;
    return data.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [data, search]);

  return (
    <div>
      <PageHeader title="Users" description="Registered accounts from the EscuelaJS API." />

      <AdminSearchInput
        id="user-search"
        label="Search users"
        placeholder="Search by name or email…"
        value={search}
        onChange={setSearch}
        className="mb-6" />
      

      {isLoading ?
      <AdminTableSkeleton label="Loading users" /> :
      isError ?
      <StateMessage tone="error" icon={AlertTriangleIcon} title="User data is unavailable" description={getErrorMessage(error, 'The API did not permit access to users.')} action={<Button variant="outline" onClick={() => refetch()}>Try again</Button>} className="bg-card" /> :
      filtered.length === 0 ?
      <StateMessage icon={UserXIcon} title={search ? 'No matching users' : 'No users found'} className="bg-card" /> :

      <AdminTableShell
        columns={columns}
        footer={<span>{filtered.length} of {data?.length ?? 0} users</span>}>
        
          {filtered.map((u) =>
        <tr key={u.id} className="transition-colors duration-150 hover:bg-muted/30">
              <td className="px-5 py-3.5">
                <Link
              href={`/admin/users/${u.id}`}
              className="flex items-center gap-3.5 rounded font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              
                  <Avatar src={u.avatar} name={u.name} className="h-11 w-11 border border-border" />
                  <span className="truncate">{u.name}</span>
                </Link>
              </td>
              <td className="max-w-[18rem] truncate px-5 py-3.5 text-muted-foreground">{u.email}</td>
              <td className="px-5 py-3.5">
                <Badge tone={u.role === 'admin' ? 'primary' : 'default'} className="capitalize">{u.role}</Badge>
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">{formatDate(u.creationAt)}</td>
            </tr>
        )}
        </AdminTableShell>
      }
    </div>);

}