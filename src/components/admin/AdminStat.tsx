import React from 'react';
import Link from 'next/link';
import { Skeleton } from '../ui/Skeleton';

interface AdminStatProps {
  label: string;
  value?: number;
  isLoading: boolean;
  isError: boolean;
  href: string;
}

export function AdminStat({ label, value, isLoading, isError, href }: AdminStatProps) {
  return (
    <div className="py-4 sm:px-6 sm:py-0 sm:first:pl-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1">
        {isLoading ?
        <Skeleton className="h-9 w-16" /> :
        isError || value === undefined ?
        <span className="text-sm text-muted-foreground">Unavailable</span> :

        <Link href={href} className="text-3xl font-semibold tabular-nums tracking-tight hover:underline">
            {value.toLocaleString()}
          </Link>
        }
      </dd>
    </div>);

}