"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MenuIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/user-avatar";
import { useLogout, useProfile } from "@/hooks/useAuth";

const ease = [0.23, 1, 0.32, 1] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: profile } = useProfile();
  const logout = useLogout();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => setDrawerOpen(false), [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out");
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-border bg-card lg:block">
        <AdminSidebarNav onLogout={handleLogout} />
      </aside>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease }}
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Admin navigation"
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.24, ease }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3"
                aria-label="Close navigation"
                onClick={() => setDrawerOpen(false)}
              >
                <XIcon />
              </Button>
              <AdminSidebarNav onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 lg:hidden"
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {profile && (
              <div className="hidden items-center gap-2 sm:flex">
                <Avatar src={profile.avatar} name={profile.name} className="h-7 w-7" />
                <span className="max-w-[10rem] truncate text-sm">{profile.name}</span>
              </div>
            )}
          </div>
        </header>
        <main id="main" className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
