"use client";

import { Badge as ShadcnBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type LegacyTone = "primary" | "default" | "outline" | "warning";

const toneToVariant: Record<
  LegacyTone,
  "default" | "secondary" | "outline" | "destructive"
> = {
  primary: "default",
  default: "secondary",
  outline: "outline",
  warning: "destructive",
};

interface AppBadgeProps extends React.ComponentProps<typeof ShadcnBadge> {
  tone?: LegacyTone;
}

/** Badge with legacy `tone` prop, wrapping shadcn/ui `Badge`. */
export function AppBadge({ tone = "default", className, ...props }: AppBadgeProps) {
  return (
    <ShadcnBadge
      variant={toneToVariant[tone]}
      className={cn(className)}
      {...props}
    />
  );
}

export { AppBadge as Badge };
