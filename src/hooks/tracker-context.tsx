"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useTrackerStore } from "./use-tracker-store";

type TrackerContextType = ReturnType<typeof useTrackerStore>;

const TrackerContext = createContext<TrackerContextType | null>(null);

export function TrackerProvider({ children }: { children: ReactNode }) {
  const store = useTrackerStore();
  return (
    <TrackerContext.Provider value={store}>{children}</TrackerContext.Provider>
  );
}

export function useTracker() {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error("useTracker must be used within TrackerProvider");
  return ctx;
}
