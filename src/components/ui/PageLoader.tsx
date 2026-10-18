import React from 'react';
import { Loader2Icon } from 'lucide-react';

export function PageLoader({ label = 'Loading…' }: {label?: string;}) {
  return (
    <div role="status" className="flex min-h-[40vh] items-center justify-center gap-2 text-sm text-muted-foreground">
      <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />
      {label}
    </div>);

}