// F.O.R.M. Repository — the single persistence interface.
//
// Strategy: Local-first with optional Supabase sync.
// 1. localStorage is always the fast read/write layer.
// 2. If Supabase is configured, writes are mirrored asynchronously.
// 3. On hydration, local loads first; remote reconciles if newer.
//
// The store talks ONLY to this module — never to Supabase directly.

import { KEYS, getItem, setItem, getStringItem, setStringItem } from "./storage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import * as queries from "@/lib/supabase/queries";
import {
  dbToDailyRecord, dailyRecordToDb, dbToPreferences, preferencesToDb,
  dbToBehaviorMemory, behaviorMemoryToDb, dbToMood,
  type DailyRecordDomain, type BehaviorMemoryDomain,
} from "@/lib/supabase/mappers";
import type { AppSettings, SectionId } from "@/types";
import type { MoodEntry, MoodLevel, FavoriteData } from "@/lib/personalization";
import type { RhythmData } from "@/lib/behavior";

// ─── Instance ID ─────────────────────────────────────────────
// Generated once on first use, persisted in localStorage.
// Acts as the soft ownership key for this no-auth app.

const INSTANCE_KEY = "form-instance-id";

function generateId(): string {
  return crypto.randomUUID();
}

export function getInstanceId(): string {
  let id = getStringItem(INSTANCE_KEY);
  if (!id) {
    id = generateId();
    setStringItem(INSTANCE_KEY, id);
  }
  return id;
}

// ─── Sync Status ─────────────────────────────────────────────

export type SyncStatus = "synced" | "syncing" | "local-only" | "error";

let _lastSynced: Date | null = null;
let _syncStatus: SyncStatus = isSupabaseConfigured ? "syncing" : "local-only";
const _listeners: Set<() => void> = new Set();

export function getSyncStatus(): SyncStatus { return _syncStatus; }
export function getLastSynced(): Date | null { return _lastSynced; }

function setSyncStatus(status: SyncStatus) {
  _syncStatus = status;
  if (status === "synced") _lastSynced = new Date();
  _listeners.forEach((fn) => fn());
}

export function onSyncChange(fn: () => void): () => void {
  _listeners.add(fn);
  return () => { _listeners.delete(fn); };
}

// ─── Hydration ───────────────────────────────────────────────
// Ensures the Supabase instance row exists on first sync.

let _instanceReady = false;

async function ensureInstance(): Promise<void> {
  if (_instanceReady || !isSupabaseConfigured) return;
  try {
    await queries.getOrCreateInstance(getInstanceId());
    _instanceReady = true;
  } catch {
    // Non-fatal — app continues in local-only mode
  }
}

// ─── Daily Record ────────────────────────────────────────────

export function loadDailyRecordLocal(date: string): DailyRecordDomain | null {
  return getItem<DailyRecordDomain | null>(KEYS.tracker(date), null);
}

export function saveDailyRecordLocal(record: DailyRecordDomain): void {
  setItem(KEYS.tracker(record.date), record);
  // Update history index
  const idx = getItem<string[]>(KEYS.historyIndex, []);
  if (!idx.includes(record.date)) {
    idx.push(record.date);
    idx.sort((a, b) => b.localeCompare(a));
    setItem(KEYS.historyIndex, idx.slice(0, 90));
  }
}

export async function syncDailyRecord(record: DailyRecordDomain): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    setSyncStatus("syncing");
    await ensureInstance();
    await queries.upsertDailyRecord(dailyRecordToDb(getInstanceId(), record));
    setSyncStatus("synced");
  } catch {
    setSyncStatus("error");
  }
}

export async function hydrateDailyRecord(date: string, localFallback: DailyRecordDomain): Promise<DailyRecordDomain> {
  if (!isSupabaseConfigured) return localFallback;
  try {
    await ensureInstance();
    const remote = await queries.fetchDailyRecord(getInstanceId(), date);
    if (!remote) {
      // First time — push local to remote
      await queries.upsertDailyRecord(dailyRecordToDb(getInstanceId(), localFallback));
      setSyncStatus("synced");
      return localFallback;
    }
    const remoteDomain = dbToDailyRecord(remote);
    // Prefer whichever is newer
    const localUpdated = localFallback.updatedAt ?? "";
    if (remoteDomain.updatedAt > localUpdated) {
      saveDailyRecordLocal(remoteDomain);
      setSyncStatus("synced");
      return remoteDomain;
    }
    // Local is newer — push to remote
    await queries.upsertDailyRecord(dailyRecordToDb(getInstanceId(), localFallback));
    setSyncStatus("synced");
    return localFallback;
  } catch {
    setSyncStatus("error");
    return localFallback;
  }
}

// ─── Mood ────────────────────────────────────────────────────

export function loadMoodLocal(date: string): MoodEntry | null {
  return getItem<MoodEntry | null>(KEYS.mood(date), null);
}

export function saveMoodLocal(date: string, entry: MoodEntry): void {
  setItem(KEYS.mood(date), entry);
}

export async function syncMood(date: string, level: MoodLevel): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await ensureInstance();
    await queries.upsertMood(getInstanceId(), date, level);
  } catch {}
}

// ─── Preferences ─────────────────────────────────────────────

export function loadPreferencesLocal(): AppSettings | null {
  return getItem<AppSettings | null>(KEYS.settings, null);
}

export function savePreferencesLocal(settings: AppSettings): void {
  setItem(KEYS.settings, settings);
}

export async function syncPreferences(settings: AppSettings): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await ensureInstance();
    await queries.upsertPreferences(preferencesToDb(getInstanceId(), settings));
  } catch {}
}

export async function hydratePreferences(localFallback: AppSettings): Promise<AppSettings> {
  if (!isSupabaseConfigured) return localFallback;
  try {
    await ensureInstance();
    const remote = await queries.fetchPreferences(getInstanceId());
    if (!remote) {
      await queries.upsertPreferences(preferencesToDb(getInstanceId(), localFallback));
      return localFallback;
    }
    const remoteSettings = dbToPreferences(remote);
    savePreferencesLocal(remoteSettings);
    return remoteSettings;
  } catch {
    return localFallback;
  }
}

// ─── Behavior Memory ─────────────────────────────────────────

export function loadBehaviorLocal(): BehaviorMemoryDomain {
  const lastSection = getStringItem(KEYS.lastSection) as SectionId | null;
  const favoriteCounts = getItem<FavoriteData>(KEYS.favorites, { counts: {} });
  const rhythmData = getItem<RhythmData>(KEYS.rhythm, {
    taskCompletionCounts: {}, taskSkipCounts: {}, lastOpenPhase: null, totalDaysTracked: 0,
  });
  return { lastSection, favoriteCounts, rhythmData };
}

export function saveBehaviorLocal(memory: BehaviorMemoryDomain): void {
  if (memory.lastSection) setStringItem(KEYS.lastSection, memory.lastSection);
  setItem(KEYS.favorites, memory.favoriteCounts);
  setItem(KEYS.rhythm, memory.rhythmData);
}

export async function syncBehavior(memory: BehaviorMemoryDomain): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await ensureInstance();
    await queries.upsertBehaviorMemory(behaviorMemoryToDb(getInstanceId(), memory));
  } catch {}
}

// ─── History ─────────────────────────────────────────────────

export function loadHistoryIndex(): string[] {
  return getItem<string[]>(KEYS.historyIndex, []);
}
