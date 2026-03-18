"use client";

import { type ReactNode } from "react";
import { BottomNav } from "./bottom-nav";
import { InstallPrompt } from "./install-prompt";
import { RewardToast } from "./reward-toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { TrackerProvider, useTracker } from "@/hooks/tracker-context";

function AppContent({ children }: { children: ReactNode }) {
  const { hydrated } = useTracker();

  if (!hydrated) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-background">
      <main className="pb-20">{children}</main>
      <BottomNav />
      <InstallPrompt />
      <RewardToast />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <TrackerProvider>
        <AppContent>{children}</AppContent>
      </TrackerProvider>
    </ErrorBoundary>
  );
}
