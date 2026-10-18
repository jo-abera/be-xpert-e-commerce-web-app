"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";

type AppNavLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  end?: boolean;
  className?: string | ((props: { isActive: boolean }) => string);
  children?: ReactNode;
};

function isActivePath(pathname: string, href: string, end?: boolean) {
  if (end || href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNavLink({
  href,
  end,
  className,
  children,
  ...props
}: AppNavLinkProps) {
  const pathname = usePathname();
  const hrefString = typeof href === "string" ? href : (href.pathname ?? "");
  const isActive = isActivePath(pathname, hrefString, end);
  const resolvedClassName =
    typeof className === "function" ? className({ isActive }) : className;

  return (
    <Link href={href} className={resolvedClassName} {...props}>
      {children}
    </Link>
  );
}
