"use client";

import { useEffect } from "react";

import { AppShell } from "@omni/components/app-shell";
import { TooltipProvider } from "@omni/components/ui/tooltip";
import { PerformanceProvider } from "@omni/lib/ui/performance";
import "@omni/styles.css";

export default function OmniRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <PerformanceProvider>
      <TooltipProvider delayDuration={0}>
        <AppShell>{children}</AppShell>
      </TooltipProvider>
    </PerformanceProvider>
  );
}
