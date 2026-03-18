// Centralized persistence layer.
// All localStorage access goes through here.
// In Step 8, these functions will be swapped to use Supabase.

export const KEYS = {
  tracker: (date: string) => `pixie-tracker-${date}`,
  settings: "pixie-settings",
  lastSection: "pixie-last-section",
  historyIndex: "pixie-history-index",
  rhythm: "pixie-rhythm",
  favorites: "pixie-favorites",
  mood: (date: string) => `pixie-mood-${date}`,
  installDismissed: "form-install-dismissed",
} as const;

export function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback;
}

export function setItem(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
}

export function getStringItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {}
  return null;
}

export function setStringItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export function getAllKeysMatching(prefix: string): string[] {
  if (typeof window === "undefined") return [];
  return Object.keys(localStorage).filter((k) => k.startsWith(prefix));
}
