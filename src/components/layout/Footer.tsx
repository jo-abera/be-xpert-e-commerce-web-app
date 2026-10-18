import React from 'react';
import Link from 'next/link';

const columns = [
{
  title: 'Shop',
  links: [
  { to: '/products', label: 'All products' },
  { to: '/categories', label: 'Categories' },
  { to: '/cart', label: 'Cart' }]

},
{
  title: 'Account',
  links: [
  { to: '/login', label: 'Sign in' },
  { to: '/register', label: 'Create account' },
  { to: '/profile', label: 'Profile' },
  { to: '/admin', label: 'Admin dashboard' }]

}];


export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr] lg:px-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5 font-heading text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm">N</span>
            Nexus Market
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/65">
            A modern storefront built on the public EscuelaJS API. Browse a live catalog, save your cart, and try a
            simulated checkout.
          </p>
        </div>
        {columns.map((col) =>
        <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-semibold">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) =>
            <li key={link.to}>
                  <Link href={link.to} className="text-sm text-white/65 transition-colors duration-150 hover:text-white">
                    {link.label}
                  </Link>
                </li>
            )}
            </ul>
          </nav>
        )}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-white/55 sm:px-6 lg:px-8">
          <p>© 2026 Nexus Market · BE-XPERT capstone project</p>
        </div>
      </div>
    </footer>);

}