"use client";

import { cn } from "@/lib/utils";

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto max-w-lg min-h-dvh bg-background px-5 pt-8", className)}>
      <div className="space-y-5 animate-pulse">
        {/* Hero area */}
        <div className="space-y-2">
          <div className="h-6 w-48 rounded-lg bg-muted" />
          <div className="h-3 w-32 rounded bg-muted/60" />
        </div>

        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-muted/50" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-20 rounded bg-muted/60" />
            <div className="h-4 w-full rounded bg-muted/40" />
          </div>
        </div>

        {/* Cards */}
        <div className="h-16 rounded-2xl bg-muted/30" />
        <div className="h-12 rounded-2xl bg-muted/20" />

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-muted/25" />
          ))}
        </div>
      </div>
    </div>
  );
}
