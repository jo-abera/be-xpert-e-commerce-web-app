"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/Avatar";
import { initials } from "@/utils/format";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  name: string;
  className?: string;
}

/** Profile avatar built on shadcn/ui `Avatar`. */
export function UserAvatar({ src, name, className }: UserAvatarProps) {
  return (
    <Avatar className={cn(className)}>
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback>{initials(name)}</AvatarFallback>
    </Avatar>
  );
}

export { UserAvatar as Avatar };
