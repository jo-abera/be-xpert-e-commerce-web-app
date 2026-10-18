import React from "react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
interface IconActionProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  disabled?: boolean;
  disabledReason?: string;
}
const base = 'inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
export function IconAction({
  icon: Icon,
  label,
  href,
  disabled,
  disabledReason
}: IconActionProps) {
  if (disabled || !href) {
    const reason = disabledReason ?? label;
    return <span role="img" aria-label={`${label} unavailable: ${reason}`} title={reason} className={cn(base, 'cursor-not-allowed opacity-35')}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>;
  }
  return <Link href={href} aria-label={label} title={label} className={cn(base, 'hover:bg-muted hover:text-foreground')}>
      <Icon className="h-4 w-4" aria-hidden="true" />
    </Link>;
}