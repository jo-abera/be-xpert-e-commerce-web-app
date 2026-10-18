'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppNavLink } from '@/components/navigation/AppNavLink';
import { MenuIcon, ShoppingCartIcon, UserIcon, XIcon } from 'lucide-react';
import { Button, buttonVariants } from '../ui/Button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { AccountMenu } from './AccountMenu';
import { HeaderSearch } from './HeaderSearch';
import { storeNavigation } from '../../data/navigation';
import { selectItemCount, useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { cn } from '@/lib/utils';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const count = useCartStore(selectItemCount);
  const token = useAuthStore((s) => s.accessToken);
  const pathname = usePathname();

  useEffect(() => setMenuOpen(false), [pathname]);

  const navItems = storeNavigation.filter((item) => !('requiresAuth' in item && item.requiresAuth) || Boolean(token));

  const mainNavClass = ({ isActive }: {isActive: boolean;}) =>
  cn(
    'relative rounded py-1 text-[15px] font-medium transition-colors duration-150',
    focusRing,
    isActive ?
    'text-primary after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:rounded-full after:bg-primary' :
    'text-muted-foreground hover:text-foreground'
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-6 lg:px-8">
        <Link href="/" className={cn('flex shrink-0 items-center gap-2.5 rounded font-heading text-lg font-bold tracking-tight', focusRing)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            N
          </span>
          Nexus Market
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-6 md:flex lg:ml-6">
          {navItems.map((item) =>
          <AppNavLink key={item.to} href={item.to} end={item.to === '/'} className={mainNavClass}>
              {item.label}
            </AppNavLink>
          )}
        </nav>

        <HeaderSearch className="ml-auto hidden w-full max-w-xs lg:block xl:max-w-sm" />

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Link
            href="/cart"
            aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
            className={buttonVariants('ghost', 'icon', 'relative')}>
            
            <ShoppingCartIcon className="!h-5 !w-5" aria-hidden="true" />
            <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold tabular-nums text-primary-foreground">
              {count > 99 ? '99+' : count}
            </span>
          </Link>
          {token ?
          <AccountMenu /> :

          <Link href="/login" className={buttonVariants('outline', 'md', 'ml-1 hidden sm:inline-flex')}>
              <UserIcon aria-hidden="true" />
              Sign in
            </Link>
          }
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}>
            
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </Button>
        </div>
      </div>

      {menuOpen &&
      <div id="mobile-nav" className="border-t border-border px-4 pb-5 pt-4 md:hidden">
          <HeaderSearch id="mobile-search" />
          <nav aria-label="Mobile" className="mt-4 grid gap-1">
            {[...navItems, { to: token ? '/profile' : '/login', label: token ? 'Your account' : 'Sign in' }].map((item) =>
          <AppNavLink
            key={item.to}
            href={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
            cn('rounded-lg px-3 py-2.5 text-sm', focusRing, isActive ? 'bg-primary/10 font-medium text-primary' : 'text-foreground hover:bg-muted')
            }>
            
                {item.label}
              </AppNavLink>
          )}
          </nav>
        </div>
      }
    </header>);

}