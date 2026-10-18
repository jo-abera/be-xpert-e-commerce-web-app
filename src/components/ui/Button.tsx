"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariantClasses = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-1.5 px-4",
        sm: "h-8 gap-1 px-3 text-sm",
        lg: "h-11 gap-1.5 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ShadcnVariant = NonNullable<
  VariantProps<typeof buttonVariantClasses>["variant"]
>;
type ShadcnSize = NonNullable<VariantProps<typeof buttonVariantClasses>["size"]>;

export type LegacyButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";
export type LegacyButtonSize = "sm" | "md" | "lg" | "icon";

const legacyVariantMap: Record<LegacyButtonVariant, ShadcnVariant> = {
  primary: "default",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
  destructive: "destructive",
};

const legacySizeMap: Record<LegacyButtonSize, ShadcnSize> = {
  sm: "sm",
  md: "default",
  lg: "lg",
  icon: "icon",
};

/** shadcn/ui `buttonVariants` — also supports legacy positional args used on `<Link>`. */
export function buttonVariants(
  variantOrProps?: LegacyButtonVariant | VariantProps<typeof buttonVariantClasses>,
  size?: LegacyButtonSize,
  className?: string,
) {
  if (
    typeof variantOrProps === "object" &&
    variantOrProps !== null &&
    !Array.isArray(variantOrProps)
  ) {
    return buttonVariantClasses(variantOrProps);
  }

  const variant = legacyVariantMap[(variantOrProps as LegacyButtonVariant) ?? "primary"];
  const resolvedSize = legacySizeMap[size ?? "md"];
  return buttonVariantClasses({ variant, size: resolvedSize, className });
}

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariantClasses> & {
    loading?: boolean;
    variant?: ShadcnVariant | LegacyButtonVariant;
    size?: ShadcnSize | LegacyButtonSize;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "default",
    size = "default",
    loading,
    disabled,
    children,
    ...props
  },
  ref,
) {
  const resolvedVariant =
    variant in legacyVariantMap
      ? legacyVariantMap[variant as LegacyButtonVariant]
      : (variant as ShadcnVariant);
  const resolvedSize =
    size in legacySizeMap
      ? legacySizeMap[size as LegacyButtonSize]
      : (size as ShadcnSize);

  return (
    <ButtonPrimitive
      ref={ref}
      data-slot="button"
      className={cn(
        buttonVariantClasses({
          variant: resolvedVariant,
          size: resolvedSize,
          className,
        }),
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2Icon className="animate-spin" aria-hidden="true" /> : null}
      {children}
    </ButtonPrimitive>
  );
});

export { Button, buttonVariantClasses };
