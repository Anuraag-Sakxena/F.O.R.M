-- F.O.R.M. Database Schema
-- Single-user, no-auth personal tracker.
-- instance_id acts as a soft ownership key (generated client-side).

-- ─── App Instance ────────────────────────────────────────────
-- Single row per app installation. No auth — just a stable ID.
create table if not exists app_instances (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Daily Records ───────────────────────────────────────────
-- One row per tracker day (7 AM boundary, not midnight).
-- JSONB columns for structured sub-data that changes as a unit.
create table if not exists daily_records (
  id uuid primary key default gen_random_uuid(),
  instance_id uuid not null references app_instances(id) on delete cascade,
  date date not null,
  checklist jsonb not null default '[]',
  meals_done jsonb not null default '{}',
  workout_done boolean not null default false,
  lazy_mode boolean not null default false,
  skincare jsonb not null default '[]',
  night_routine jsonb not null default '[]',
  groceries jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(instance_id, date)
);

-- ─── Mood Check-ins ──────────────────────────────────────────
create table if not exists mood_checkins (
  id uuid primary key default gen_random_uuid(),
  instance_id uuid not null references app_instances(id) on delete cascade,
  date date not null,
  level smallint not null check (level between 1 and 3),
  checked_in_at timestamptz not null default now(),
  unique(instance_id, date)
);

-- ─── App Preferences ─────────────────────────────────────────
-- Single row per instance. All settings as columns for type safety.
create table if not exists app_preferences (
  id uuid primary key default gen_random_uuid(),
  instance_id uuid not null references app_instances(id) on delete cascade unique,
  animations_enabled boolean not null default true,
  microcopy_intensity text not null default 'normal' check (microcopy_intensity in ('light', 'normal', 'playful')),
  show_emojis boolean not null default true,
  adaptive_enabled boolean not null default true,
  check_in_enabled boolean not null default true,
  show_plan boolean not null default true,
  show_rescue boolean not null default true,
  show_mvd_messages boolean not null default true,
  meal_suggestions boolean not null default true,
  planner_style text not null default 'balanced' check (planner_style in ('minimal', 'balanced', 'supportive')),
  updated_at timestamptz not null default now()
);

-- ─── Behavior Memory ─────────────────────────────────────────
-- Aggregated behavioral data. Single row per instance.
create table if not exists behavior_memory (
  id uuid primary key default gen_random_uuid(),
  instance_id uuid not null references app_instances(id) on delete cascade unique,
  last_section text,
  favorite_counts jsonb not null default '{}',
  rhythm_data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- ─── Indexes ─────────────────────────────────────────────────
create index if not exists idx_daily_records_instance_date on daily_records(instance_id, date desc);
create index if not exists idx_mood_checkins_instance_date on mood_checkins(instance_id, date desc);

-- ─── Updated-at Trigger ──────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tr_daily_records_updated before update on daily_records
  for each row execute function update_updated_at();

create trigger tr_app_preferences_updated before update on app_preferences
  for each row execute function update_updated_at();

create trigger tr_behavior_memory_updated before update on behavior_memory
  for each row execute function update_updated_at();

create trigger tr_app_instances_updated before update on app_instances
  for each row execute function update_updated_at();
