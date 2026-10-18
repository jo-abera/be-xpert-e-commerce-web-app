import type { Metadata } from "next";

import { AppShellGate } from "@/components/layout/AppShellGate";
import { AppProviders } from "@/components/providers/app-providers";

import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "Nexus Market",
    template: "%s · Nexus Market",
  },
  description: "Modern e-commerce storefront for Nexus Academy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="min-h-full" suppressHydrationWarning>
        <AppProviders>
          <AppShellGate>{children}</AppShellGate>
        </AppProviders>
      </body>
    </html>
  );
}
