import React from 'react';

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-[1fr_1.1fr]">
      <aside className="hidden flex-col justify-between bg-navy p-10 text-white lg:flex">
        <div className="flex items-center gap-2.5 font-heading text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm">N</span>
          Nexus Market
        </div>
        <div>
          <p className="font-heading text-3xl font-bold leading-tight">Your cart is saved while you sign in.</p>
          <p className="mt-4 text-sm leading-relaxed text-white/65">
            Sign in to review your cart, add delivery details, and complete a simulated checkout.
          </p>
        </div>
        <p className="text-xs text-white/50">Authentication is provided by the public EscuelaJS API.</p>
      </aside>
      <div className="p-6 sm:p-10 lg:p-12">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-8">{children}</div>
        <p className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">{footer}</p>
      </div>
    </div>);

}