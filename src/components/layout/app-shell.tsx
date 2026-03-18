"use client";

import { type ReactNode } from "react";
import { BottomNav } from "./bottom-nav";
import { InstallPrompt } from "./install-prompt";
import { RewardToast } from "./reward-toast";
import { TrackerProvider } from "@/hooks/tracker-context";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TrackerProvider>
      <div className="mx-auto min-h-dvh max-w-lg bg-background">
        <main className="pb-20">{children}</main>
        <BottomNav />
        <InstallPrompt />
        <RewardToast />
      </div>
    </TrackerProvider>
  );
}
