'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOutIcon, UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar } from '../ui/user-avatar';
import { useLogout, useProfile } from '@/hooks/useAuth';
import { selectItemCount, useCartStore } from "@/store/cart-store";
import { cn } from '@/lib/utils';

const itemClass =
'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-muted focus-visible:bg-muted focus-visible:outline-none';

export function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: profile } = useProfile();
  const count = useCartStore(selectItemCount);
  const logout = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const handleLogout = () => {
    close();
    logout();
    toast.success('You have been logged out');
    router.push('/');
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-10 w-10 items-center justify-center rounded-full transition-shadow duration-150 hover:ring-2 hover:ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        
        {profile ?
        <Avatar src={profile.avatar} name={profile.name} className="h-9 w-9 border border-border" /> :

        <UserIcon className="h-5 w-5" aria-hidden="true" />
        }
      </button>

      <AnimatePresence>
        {open &&
        <motion.div
          role="menu"
          aria-label="Account"
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -4 }}
          transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformOrigin: 'top right' }}
          className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg">
          
            {profile &&
          <div className="border-b border-border px-4 py-3">
                <p className="truncate font-medium text-foreground">{profile.name}</p>
                <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
              </div>
          }
            <div className="py-1">
              <Link role="menuitem" href="/profile" onClick={close} className={itemClass}>
                Profile
              </Link>
              <Link role="menuitem" href="/admin" onClick={close} className={cn(itemClass, 'font-medium text-primary')}>
                Admin Dashboard
              </Link>
              <Link role="menuitem" href="/cart" onClick={close} className={itemClass}>
                Cart ({count})
              </Link>
            </div>
            <div className="border-t border-border py-1">
              <button role="menuitem" type="button" onClick={handleLogout} className={cn(itemClass, 'text-destructive')}>
                <LogOutIcon className="h-4 w-4" aria-hidden="true" />
                Log Out
              </button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}