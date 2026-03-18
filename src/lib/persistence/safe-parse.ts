// Safe parsing helpers for resilient persistence.
// Handles malformed JSON, missing keys, and type mismatches
// without crashing the app.

export function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return safeParse(raw, fallback);
  } catch {
    return fallback;
  }
}

export function safeSet(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function safeRemove(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
}

// Validates that an object has expected shape. Returns fallback if not.
export function validateShape<T extends object>(
  data: unknown,
  requiredKeys: (keyof T)[],
  fallback: T
): T {
  if (!data || typeof data !== "object") return fallback;
  for (const key of requiredKeys) {
    if (!(key in (data as Record<string, unknown>))) return fallback;
  }
  return data as T;
}
