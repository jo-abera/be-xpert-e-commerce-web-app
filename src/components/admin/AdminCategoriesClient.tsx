'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangleIcon, FolderOpenIcon, PlusIcon, TagIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Badge } from '@/components/ui/app-badge';
import { ProductImage } from '@/components/ui/ProductImage';
import { StateMessage } from '@/components/ui/StateMessage';
import { AdminTableShell } from '@/components/admin/AdminTableShell';
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton';
import { AdminSearchInput } from '@/components/admin/AdminSearchInput';
import { useCategories } from '@/hooks/useCategories';
import { useAdminStore } from "@/store/admin-store";
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/lib/api/client';
import { formatDate } from '@/utils/format';

const columns = [
{ label: 'Category' },
{ label: 'Slug' },
{ label: 'Created' },
{ label: 'View', className: 'text-right' }];


export function AdminCategories() {
  useDocumentTitle('Manage categories');
  const { data, isLoading, isError, error, refetch } = useCategories();
  const createdIds = useAdminStore((s) => s.createdCategoryIds);
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!data) return [];
    return q ? data.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)) : data;
  }, [data, search]);

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Browse storefront departments powered by EscuelaJS."
        actions={
        <Link href="/admin/categories/new" className={buttonVariants('primary', 'lg')}>
            <PlusIcon aria-hidden="true" />
            Add Category
          </Link>
        } />
      

      <AdminSearchInput
        id="admin-category-search"
        label="Search categories"
        placeholder="Search categories by name or slug…"
        value={search}
        onChange={setSearch}
        className="mb-6" />
      

      {isLoading ?
      <AdminTableSkeleton rows={6} label="Loading categories" /> :
      isError ?
      <StateMessage tone="error" icon={AlertTriangleIcon} title="We couldn't load categories" description={getErrorMessage(error)} action={<Button variant="outline" onClick={() => refetch()}>Try again</Button>} className="bg-card" /> :
      rows.length === 0 ?
      <StateMessage icon={FolderOpenIcon} title={search ? 'No matching categories' : 'No categories yet'} className="bg-card" /> :

      <AdminTableShell
        columns={columns}
        minWidth="min-w-[640px]"
        footer={<span>{rows.length} {rows.length === 1 ? 'category' : 'categories'}</span>}>
        
          {rows.map((c) => {
          const owned = createdIds.includes(c.id);
          return (
            <tr key={c.id} className="transition-colors duration-150 hover:bg-muted/30">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-4">
                    <ProductImage src={c.image} alt="" className="h-12 w-12 shrink-0 rounded-lg border border-border" />
                    <TagIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <Badge tone={owned ? 'primary' : 'default'} className="max-w-[14rem] text-sm text-foreground">
                      {c.name}
                    </Badge>
                    {owned && <span className="text-xs text-success">Yours</span>}
                  </div>
                </td>
                <td className="px-5 py-3.5 font-mono text-[13px] text-muted-foreground">{c.slug}</td>
                <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">{formatDate(c.creationAt)}</td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                  href={`/admin/categories/${c.id}/edit`}
                  className="rounded font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Open ${c.name}`}>
                  
                    Open
                  </Link>
                </td>
              </tr>);

        })}
        </AdminTableShell>
      }
    </div>);

}