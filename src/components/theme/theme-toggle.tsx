"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";

const order = ["light", "dark", "system"] as const;
type ThemeOption = (typeof order)[number];

const icons = { light: SunIcon, dark: MoonIcon, system: MonitorIcon };
const labels = { light: "Light", dark: "Dark", system: "System" };

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Theme" disabled>
        <SunIcon aria-hidden="true" />
      </Button>
    );
  }

  const current = (theme ?? "system") as ThemeOption;
  const next = order[(order.indexOf(current) + 1) % order.length];
  const Icon = icons[current];

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${labels[current]}. Switch to ${labels[next]}.`}
      title={`Theme: ${labels[current]}`}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}
