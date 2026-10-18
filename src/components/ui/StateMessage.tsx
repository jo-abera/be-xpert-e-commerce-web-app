import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
interface StateMessageProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: 'default' | 'error';
  className?: string;
}
export function StateMessage({
  icon: Icon,
  title,
  description,
  action,
  tone = 'default',
  className
}: StateMessageProps) {
  return <div role={tone === 'error' ? 'alert' : undefined} className={cn('flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-14 text-center', className)}>
      {Icon && <Icon className={cn('mb-4 h-8 w-8', tone === 'error' ? 'text-destructive' : 'text-muted-foreground')} aria-hidden="true" />}
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>;
}