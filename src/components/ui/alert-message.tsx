"use client";

import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  XCircleIcon,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/Alert";
import { cn } from "@/lib/utils";

type Tone = "info" | "warning" | "error" | "success";

const toneStyles: Record<
  Tone,
  { className: string; Icon: typeof InfoIcon; variant?: "default" | "destructive" }
> = {
  info: { className: "border-border bg-muted/60", Icon: InfoIcon, variant: "default" },
  warning: {
    className: "border-warning/40 bg-warning/10 text-foreground",
    Icon: AlertTriangleIcon,
    variant: "default",
  },
  error: {
    className: "",
    Icon: XCircleIcon,
    variant: "destructive",
  },
  success: {
    className: "border-success/40 bg-success/10 text-foreground",
    Icon: CheckCircle2Icon,
    variant: "default",
  },
};

interface AlertMessageProps {
  tone?: Tone;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

/** App-level alerts built on shadcn/ui `Alert`. */
export function AlertMessage({
  tone = "info",
  title,
  children,
  className,
}: AlertMessageProps) {
  const { className: toneClass, Icon, variant } = toneStyles[tone];

  return (
    <Alert
      variant={variant}
      className={cn("flex gap-3 p-4", toneClass, className)}
      role={tone === "error" ? "alert" : "status"}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 space-y-1">
        {title ? <AlertTitle>{title}</AlertTitle> : null}
        {children ? (
          <AlertDescription className="text-foreground/80">
            {children}
          </AlertDescription>
        ) : null}
      </div>
    </Alert>
  );
}

/** @deprecated Import `AlertMessage`; kept for existing imports. */
export { AlertMessage as Alert };
