import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: {to: string;label: string;};
}

export function PageHeader({ title, description, actions, back }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {back &&
      <Link
        href={back.to}
        className="mb-4 inline-flex items-center gap-1.5 rounded text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          {back.label}
        </Link>
      }
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>);

}