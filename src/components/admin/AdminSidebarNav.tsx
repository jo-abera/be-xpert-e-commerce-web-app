import React from 'react';
import Link from 'next/link';
import { AppNavLink } from '@/components/navigation/AppNavLink';
import { LogOutIcon, StoreIcon } from 'lucide-react';
import { adminNavigation } from '../../data/navigation';
import { cn } from '@/lib/utils';

interface AdminSidebarNavProps {
  onLogout: () => void;
}

const itemClass =
'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:h-4 [&_svg]:w-4';

export function AdminSidebarNav({ onLogout }: AdminSidebarNavProps) {
  return (
    <div className="flex h-full flex-col p-4">
      <Link href="/admin" className="mb-6 flex items-center gap-2 rounded px-2 font-heading font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">N</span>
        Nexus Admin
      </Link>
      <nav aria-label="Admin" className="flex flex-1 flex-col gap-1">
        {adminNavigation.map(({ to, label, icon: Icon, end }) =>
        <AppNavLink
          key={to}
          href={to}
          end={end}
          className={({ isActive }) =>
          cn(itemClass, isActive ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground')
          }>
          
            <Icon aria-hidden="true" />
            {label}
          </AppNavLink>
        )}
      </nav>
      <div className="flex flex-col gap-1 border-t border-border pt-4">
        <Link href="/" className={cn(itemClass, 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
          <StoreIcon aria-hidden="true" />
          Back to store
        </Link>
        <button type="button" onClick={onLogout} className={cn(itemClass, 'text-left text-muted-foreground hover:bg-muted hover:text-foreground')}>
          <LogOutIcon aria-hidden="true" />
          Log out
        </button>
      </div>
    </div>);

}