// Direct Supabase query functions. Only called by the repository layer.
// UI components never import from this file.

import { supabase, isSupabaseConfigured } from "./client";
import type { DbDailyRecord, DbAppPreferences, DbBehaviorMemory, DbMoodCheckin, DbAppInstance } from "./types";

async function db() {
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

// ─── Instance ────────────────────────────────────────────────
// Uses upsert to avoid race conditions between tabs/reloads.

export async function getOrCreateInstance(instanceId: string): Promise<DbAppInstance | null> {
  if (!isSupabaseConfigured) return null;
  const client = await db();

  const { data } = await client
    .from("app_instances")
    .upsert({ id: instanceId }, { onConflict: "id" })
    .select()
    .maybeSingle();

  return (data as DbAppInstance) ?? null;
}

// ─── Daily Records ───────────────────────────────────────────

export async function fetchDailyRecord(instanceId: string, date: string): Promise<DbDailyRecord | null> {
  if (!isSupabaseConfigured) return null;
  const client = await db();
  const { data } = await client
    .from("daily_records")
    .select("*")
    .eq("instance_id", instanceId)
    .eq("date", date)
    .maybeSingle();
  return (data as DbDailyRecord) ?? null;
}

export async function upsertDailyRecord(record: Omit<DbDailyRecord, "id" | "created_at" | "updated_at">): Promise<void> {
  if (!isSupabaseConfigured) return;
  const client = await db();
  await client
    .from("daily_records")
    .upsert(record, { onConflict: "instance_id,date" });
}

export async function fetchRecentRecords(instanceId: string, limit = 90): Promise<DbDailyRecord[]> {
  if (!isSupabaseConfigured) return [];
  const client = await db();
  const { data } = await client
    .from("daily_records")
    .select("*")
    .eq("instance_id", instanceId)
    .order("date", { ascending: false })
    .limit(limit);
  return (data as DbDailyRecord[]) ?? [];
}

// ─── Mood ────────────────────────────────────────────────────

export async function fetchMood(instanceId: string, date: string): Promise<DbMoodCheckin | null> {
  if (!isSupabaseConfigured) return null;
  const client = await db();
  const { data } = await client
    .from("mood_checkins")
    .select("*")
    .eq("instance_id", instanceId)
    .eq("date", date)
    .maybeSingle();
  return (data as DbMoodCheckin) ?? null;
}

export async function upsertMood(instanceId: string, date: string, level: number): Promise<void> {
  if (!isSupabaseConfigured) return;
  const client = await db();
  await client
    .from("mood_checkins")
    .upsert({ instance_id: instanceId, date, level }, { onConflict: "instance_id,date" });
}

// ─── Preferences ─────────────────────────────────────────────

export async function fetchPreferences(instanceId: string): Promise<DbAppPreferences | null> {
  if (!isSupabaseConfigured) return null;
  const client = await db();
  const { data } = await client
    .from("app_preferences")
    .select("*")
    .eq("instance_id", instanceId)
    .maybeSingle();
  return (data as DbAppPreferences) ?? null;
}

export async function upsertPreferences(prefs: Omit<DbAppPreferences, "id" | "updated_at">): Promise<void> {
  if (!isSupabaseConfigured) return;
  const client = await db();
  await client
    .from("app_preferences")
    .upsert(prefs, { onConflict: "instance_id" });
}

// ─── Behavior Memory ─────────────────────────────────────────

export async function fetchBehaviorMemory(instanceId: string): Promise<DbBehaviorMemory | null> {
  if (!isSupabaseConfigured) return null;
  const client = await db();
  const { data } = await client
    .from("behavior_memory")
    .select("*")
    .eq("instance_id", instanceId)
    .maybeSingle();
  return (data as DbBehaviorMemory) ?? null;
}

export async function upsertBehaviorMemory(memory: Omit<DbBehaviorMemory, "id" | "updated_at">): Promise<void> {
  if (!isSupabaseConfigured) return;
  const client = await db();
  await client
    .from("behavior_memory")
    .upsert(memory, { onConflict: "instance_id" });
}
