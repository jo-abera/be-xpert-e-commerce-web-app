import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export function AdminTableSkeleton({ rows = 8, label }: {rows?: number;label: string;}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm" role="status" aria-label={label}>
      <div className="h-11 border-b border-border bg-muted/40" />
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) =>
        <div key={i} className="flex items-center gap-4 px-5 py-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="ml-auto h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        )}
      </div>
    </div>);

}