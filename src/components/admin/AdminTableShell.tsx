import React from 'react';
import { cn } from '@/lib/utils';

interface Column {
  label: string;
  className?: string;
}

interface AdminTableShellProps {
  columns: Column[];
  children: React.ReactNode;
  minWidth?: string;
  footer?: React.ReactNode;
}

export function AdminTableShell({ columns, children, minWidth = 'min-w-[720px]', footer }: AdminTableShellProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className={cn('w-full text-left text-sm', minWidth)}>
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {columns.map((col) =>
              <th
                key={col.label}
                scope="col"
                className={cn('px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground', col.className)}>
                
                  {col.label}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">{children}</tbody>
        </table>
      </div>
      {footer && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-sm text-muted-foreground">{footer}</div>}
    </div>);

}