"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getTrackerDate, getDayPhase, calculateStreak } from "@/lib/day";
import { getDefaultChecklist, getDefaultGroceries, getDefaultSkincare } from "@/lib/data";
import { nightRoutine } from "@/lib/data/night-routine";
import {
  calculateFlowScore, getFlowState, getMomentumLevel, detectRecovery,
  getRewardTier, getClosureMessage, getWeeklyReflection,
  recordTaskCompletion, type FlowState, type MomentumLevel, type RecoveryState, type RhythmData,
} from "@/lib/behavior";
import { getRewardCopy, getRecoveryCopy, getExpandedHero, getFocusCopy } from "@/lib/copy";
import { inferDayMode, type DayModeInfo } from "@/lib/day-modes";
import { getTopFavorites, recordSectionVisit, type FavoriteData, type MoodLevel, type MoodEntry } from "@/lib/personalization";
import {
  inferPlanVariant, buildDayPlan, shouldShowRescue, buildRescuePlan,
  evaluateMVD, getMealStrategy, getSupportConfig, trimPlanSteps, trimRescueActions,
  getHomeRecommendation, buildFallbackPath, getWorkoutFraming, getNightRoutineFraming,
  deriveInsights, buildRecommendationProfile, generateMemoryInsights,
  type DayPlan, type RescuePlan, type MealSuggestion, type MVDResult,
  type SupportStyleConfig, type HomeRecommendation, type FallbackPath, type PatternInsight,
  type MemoryInsight,
} from "@/lib/intelligence";
import { type RecommendationProfile, EMPTY_PROFILE } from "@/types/recommendation-profile";
import {
  loadDailyRecordLocal, saveDailyRecordLocal, syncDailyRecord, hydrateDailyRecord,
  loadMoodLocal, saveMoodLocal, syncMood,
  loadPreferencesLocal, savePreferencesLocal, syncPreferences, hydratePreferences,
  loadBehaviorLocal, saveBehaviorLocal, syncBehavior,
  loadHistoryIndex, getSyncStatus, getLastSynced, onSyncChange, type SyncStatus,
} from "@/lib/persistence/repository";
import { getItem, setItem } from "@/lib/persistence/storage";
import type {
  ChecklistItem, GroceryCategory, SkincareRoutine, NightRoutineItem,
  MealsDoneMap, AppSettings, DaySummary, DayPhase, SectionId,
  LazySelections, WaterIntake, Recipe,
} from "@/types";
import type { DailyRecordDomain } from "@/lib/supabase/mappers";

// ─── Defaults ─────────────────────────────────────────────────

const defaultSettings: AppSettings = {
  animationsEnabled: true, microcopyIntensity: "normal", showEmojis: true,
  adaptiveEnabled: true, checkInEnabled: true,
  showPlan: true, showRescue: true, showMVDMessages: true, mealSuggestions: true,
  plannerStyle: "balanced", adaptiveMemoryEnabled: true, currentTrainingWeek: 1,
};

const CUSTOM_RECIPES_KEY = "form-custom-recipes";

interface TrackerState {
  date: string;
  checklist: ChecklistItem[];
  mealsDone: MealsDoneMap;
  workoutDone: boolean;
  groceries: GroceryCategory[];
  skincare: SkincareRoutine[];
  nightRoutine: NightRoutineItem[];
  lazyMode: boolean;
  lazySelections: LazySelections;
  waterIntake: WaterIntake;
}

function createNR(): NightRoutineItem[] { return nightRoutine.map((e) => ({ id: e.id, done: false })); }

function freshState(date: string): TrackerState {
  return {
    date, checklist: getDefaultChecklist(), mealsDone: {}, workoutDone: false,
    groceries: getDefaultGroceries(), skincare: getDefaultSkincare(), nightRoutine: createNR(),
    lazyMode: false, lazySelections: {}, waterIntake: { amount: 0, target: 3000 },
  };
}

function stateToDomain(s: TrackerState): DailyRecordDomain {
  return {
    date: s.date, checklist: s.checklist, mealsDone: s.mealsDone, workoutDone: s.workoutDone,
    lazyMode: s.lazyMode, skincare: s.skincare, nightRoutine: s.nightRoutine, groceries: s.groceries,
    updatedAt: new Date().toISOString(),
  };
}

function domainToState(d: DailyRecordDomain): Partial<TrackerState> {
  return {
    date: d.date, checklist: d.checklist, mealsDone: d.mealsDone, workoutDone: d.workoutDone,
    lazyMode: d.lazyMode, skincare: d.skincare, nightRoutine: d.nightRoutine, groceries: d.groceries,
  };
}

function loadLocal(date: string): TrackerState {
  const saved = loadDailyRecordLocal(date);
  if (saved) return { ...freshState(date), ...domainToState(saved) };
  return freshState(date);
}

function dayKey(d: string): string { return new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "long" }); }
function countMeals(m: MealsDoneMap, d: string): number { const e = m[d]; return e ? (e.breakfast ? 1 : 0) + (e.lunch ? 1 : 0) + (e.dinner ? 1 : 0) : 0; }

function buildSum(s: TrackerState): DaySummary {
  const cd = s.checklist.filter((i) => i.completed).length; const ct = s.checklist.length;
  const dn = dayKey(s.date); const md = countMeals(s.mealsDone, dn);
  const am = s.skincare.find((r) => r.time === "morning"); const pm = s.skincare.find((r) => r.time === "night");
  const smd = am?.steps.filter((x) => x.done).length ?? 0; const smt = am?.steps.length ?? 0;
  const snd = pm?.steps.filter((x) => x.done).length ?? 0; const snt = pm?.steps.length ?? 0;
  const nrd = s.nightRoutine.filter((i) => i.done).length; const nrt = s.nightRoutine.length;
  const tot = ct + 1 + 3 + smt + snt + nrt;
  const done = cd + (s.workoutDone ? 1 : 0) + md + smd + snd + nrd;
  return {
    date: s.date, checklistDone: cd, checklistTotal: ct, workoutDone: s.workoutDone,
    mealsDone: md, mealsTotal: 3, skincareMorningDone: smd, skincareMorningTotal: smt,
    skincareNightDone: snd, skincareNightTotal: snt, nightRoutineDone: nrd, nightRoutineTotal: nrt,
    completionPercent: tot > 0 ? Math.round((done / tot) * 100) : 0,
    waterAmount: s.waterIntake.amount,
  };
}

function loadHist(): DaySummary[] {
  return loadHistoryIndex().map((d) => {
    const saved = loadDailyRecordLocal(d);
    if (!saved) return null;
    return buildSum({ ...freshState(d), ...domainToState(saved) });
  }).filter(Boolean) as DaySummary[];
}

// ═══════════════════════════════════════════════════════════════
// MAIN HOOK
// ═══════════════════════════════════════════════════════════════

export function useTrackerStore() {
  const [state, setState] = useState<TrackerState>(() => freshState(getTrackerDate()));
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [lastSection, setLastSec] = useState<SectionId | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [dayPhase, setDayPhase] = useState<DayPhase>(getDayPhase());
  const [rewardToast, setRewardToast] = useState<string | null>(null);
  const [rhythm, setRhythm] = useState<RhythmData>({ taskCompletionCounts: {}, taskSkipCounts: {}, lastOpenPhase: null, totalDaysTracked: 0 });
  const [favorites, setFavorites] = useState<FavoriteData>({ counts: {} });
  const [mood, setMoodState] = useState<MoodEntry | null>(null);
  const [syncStatus, setSyncStatusLocal] = useState<SyncStatus>(getSyncStatus());
  const [lastSynced, setLastSyncedLocal] = useState<Date | null>(getLastSynced());
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const prevFS = useRef<number>(0);

  // ── Hydration ────────────────────────────────────────────
  useEffect(() => {
    const date = getTrackerDate();
    const localState = loadLocal(date);
    setState(localState);
    const localPrefs = loadPreferencesLocal();
    if (localPrefs) setSettings({ ...defaultSettings, ...localPrefs });
    const behavior = loadBehaviorLocal();
    setLastSec(behavior.lastSection);
    setFavorites(behavior.favoriteCounts);
    setRhythm(behavior.rhythmData);
    setMoodState(loadMoodLocal(date));
    setCustomRecipes(getItem<Recipe[]>(CUSTOM_RECIPES_KEY, []));
    setDayPhase(getDayPhase());
    setHydrated(true);

    (async () => {
      try {
        const remoteRecord = await hydrateDailyRecord(date, stateToDomain(localState));
        setState((prev) => ({ ...prev, ...domainToState(remoteRecord) }));
        const remotePrefs = await hydratePreferences(localPrefs ?? defaultSettings);
        setSettings({ ...defaultSettings, ...remotePrefs });
      } catch {}
      setSyncStatusLocal(getSyncStatus());
      setLastSyncedLocal(getLastSynced());
    })();
  }, []);

  useEffect(() => { return onSyncChange(() => { setSyncStatusLocal(getSyncStatus()); setLastSyncedLocal(getLastSynced()); }); }, []);

  // ── Persist ──────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    const domain = stateToDomain(state);
    saveDailyRecordLocal(domain);
    syncDailyRecord(domain);
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveBehaviorLocal({ lastSection, favoriteCounts: favorites, rhythmData: rhythm });
    syncBehavior({ lastSection, favoriteCounts: favorites, rhythmData: rhythm });
  }, [lastSection, favorites, rhythm, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    setItem(CUSTOM_RECIPES_KEY, customRecipes);
  }, [customRecipes, hydrated]);

  useEffect(() => {
    const iv = setInterval(() => {
      const d = getTrackerDate();
      if (d !== state.date) { setState(loadLocal(d)); setMoodState(loadMoodLocal(d)); }
      setDayPhase(getDayPhase());
    }, 60_000);
    return () => clearInterval(iv);
  }, [state.date]);

  // ── Derived intelligence ─────────────────────────────────
  const summary = useMemo(() => buildSum(state), [state]);
  const todayDay = useMemo(() => dayKey(state.date), [state.date]);
  const hist = useMemo(() => hydrated ? loadHist() : [], [hydrated, state]); // eslint-disable-line react-hooks/exhaustive-deps
  const flowScore = useMemo(() => calculateFlowScore(summary), [summary]);
  const flowState: FlowState = useMemo(() => getFlowState(flowScore), [flowScore]);
  const streak = useMemo(() => calculateStreak(hist, 60), [hist]);
  const momentum: MomentumLevel = useMemo(() => getMomentumLevel(streak), [streak]);
  const recovery: RecoveryState = useMemo(() => detectRecovery(hist, streak), [hist, streak]);
  const weeklyRef = useMemo(() => getWeeklyReflection(hist), [hist]);
  const closure = useMemo(() => getClosureMessage(dayPhase, flowScore, settings.microcopyIntensity), [dayPhase, flowScore, settings.microcopyIntensity]);
  const mealsDone = useMemo(() => countMeals(state.mealsDone, todayDay), [state.mealsDone, todayDay]);
  const topFavs = useMemo(() => getTopFavorites(favorites), [favorites]);
  const isWeekend = useMemo(() => { const d = new Date().getDay(); return d === 0 || d === 6; }, []);
  const dayMode: DayModeInfo = useMemo(() => inferDayMode(dayPhase, flowScore, recovery, momentum, mood?.level ?? null), [dayPhase, flowScore, recovery, momentum, mood]);
  const heroMessage = useMemo(() => recovery.active ? getRecoveryCopy(recovery.reason, settings.microcopyIntensity) : getExpandedHero(dayPhase, flowScore, settings.microcopyIntensity, mood?.level === 1), [recovery, dayPhase, flowScore, settings.microcopyIntensity, mood]);
  const focusMessage = useMemo(() => { const p = state.checklist.find((i) => i.id === "protein"); return getFocusCopy(dayPhase, settings.microcopyIntensity, { recoveryActive: recovery.active, workoutDone: state.workoutDone, mealsLow: mealsDone < 2, proteinSkipped: p ? !p.completed : false, moodLow: mood?.level === 1 }); }, [dayPhase, settings.microcopyIntensity, recovery, state.workoutDone, mealsDone, state.checklist, mood]);
  const weeklyRhythm = useMemo(() => { const today = new Date(); const days: { date: string; dayShort: string; score: number | null; isToday: boolean }[] = []; for (let i = 6; i >= 0; i--) { const d = new Date(today); d.setDate(d.getDate() - i); const ds = d.toISOString().split("T")[0]; const found = hist.find((s) => s.date === ds); days.push({ date: ds, dayShort: d.toLocaleDateString("en-US", { weekday: "narrow" }), score: found ? calculateFlowScore(found) : null, isToday: ds === state.date }); } return days; }, [hist, state.date]);
  const supportConfig: SupportStyleConfig = useMemo(() => getSupportConfig(settings.plannerStyle), [settings.plannerStyle]);
  const planVariant = useMemo(() => inferPlanVariant(dayPhase, flowScore, recovery, momentum, mood?.level ?? null, isWeekend, dayMode.mode), [dayPhase, flowScore, recovery, momentum, mood, isWeekend, dayMode.mode]);
  const dayPlan: DayPlan = useMemo(() => trimPlanSteps(buildDayPlan(planVariant, settings.microcopyIntensity, { phase: dayPhase, workoutDone: state.workoutDone, mealsDone, lazyMode: state.lazyMode, isWeekend }), supportConfig), [planVariant, settings.microcopyIntensity, dayPhase, state.workoutDone, mealsDone, state.lazyMode, isWeekend, supportConfig]);
  const rescueLevel = useMemo(() => shouldShowRescue(dayPhase, flowScore, recovery, mood?.level ?? null), [dayPhase, flowScore, recovery, mood]);
  const rescuePlan: RescuePlan | null = useMemo(() => rescueLevel ? trimRescueActions(buildRescuePlan(rescueLevel, settings.microcopyIntensity, { workoutDone: state.workoutDone, mealsDone, isWeekend }), supportConfig) : null, [rescueLevel, settings.microcopyIntensity, state.workoutDone, mealsDone, isWeekend, supportConfig]);
  const mvd: MVDResult = useMemo(() => evaluateMVD(summary), [summary]);
  const mealStrategy: MealSuggestion | null = useMemo(() => settings.mealSuggestions ? getMealStrategy(dayPhase, settings.microcopyIntensity, { moodLevel: mood?.level ?? null, mealsDone, lazyMode: state.lazyMode, isWeekend, dayName: todayDay, flowScore, recoveryActive: recovery.active }) : null, [settings.mealSuggestions, dayPhase, settings.microcopyIntensity, mood, mealsDone, state.lazyMode, isWeekend, todayDay, flowScore, recovery]);
  const homeRec: HomeRecommendation = useMemo(() => getHomeRecommendation({ phase: dayPhase, flowScore, recovery, momentumLevel: momentum, moodLevel: mood?.level ?? null, workoutDone: state.workoutDone, mealsDone, planVariant, dayMode: dayMode.mode, isWeekend }), [dayPhase, flowScore, recovery, momentum, mood, state.workoutDone, mealsDone, planVariant, dayMode.mode, isWeekend]);
  const fallbackPath: FallbackPath | null = useMemo(() => homeRec.showFallbackPath ? buildFallbackPath(settings.microcopyIntensity, { workoutDone: state.workoutDone, mealsDone, phase: dayPhase, lazyMode: state.lazyMode }) : null, [homeRec.showFallbackPath, settings.microcopyIntensity, state.workoutDone, mealsDone, dayPhase, state.lazyMode]);
  const workoutFraming = useMemo(() => getWorkoutFraming(settings.microcopyIntensity, { phase: dayPhase, workoutDone: state.workoutDone, recoveryActive: recovery.active, moodLevel: mood?.level ?? null, dayMode: dayMode.mode, flowScore }), [settings.microcopyIntensity, dayPhase, state.workoutDone, recovery, mood, dayMode.mode, flowScore]);
  const nightRoutineFraming = useMemo(() => getNightRoutineFraming(settings.microcopyIntensity, { phase: dayPhase, flowScore, workoutDone: state.workoutDone, nightRoutineDone: summary.nightRoutineDone, nightRoutineTotal: summary.nightRoutineTotal }), [settings.microcopyIntensity, dayPhase, flowScore, state.workoutDone, summary.nightRoutineDone, summary.nightRoutineTotal]);
  const patternInsights: PatternInsight[] = useMemo(() => deriveInsights(hist), [hist]);
  const profile: RecommendationProfile = useMemo(() => settings.adaptiveMemoryEnabled ? buildRecommendationProfile(hist) : EMPTY_PROFILE, [hist, settings.adaptiveMemoryEnabled]);
  const memoryInsights: MemoryInsight[] = useMemo(() => settings.adaptiveMemoryEnabled ? generateMemoryInsights(profile, settings.microcopyIntensity) : [], [profile, settings.microcopyIntensity, settings.adaptiveMemoryEnabled]);

  // Rewards
  useEffect(() => { if (!hydrated) return; const tier = getRewardTier(prevFS.current, flowScore, 100); if (tier) setRewardToast(getRewardCopy(tier, settings.microcopyIntensity)); prevFS.current = flowScore; }, [flowScore, hydrated, settings.microcopyIntensity]);
  const dismissRewardToast = useCallback(() => setRewardToast(null), []);

  // ── Existing Actions ─────────────────────────────────────
  const toggleChecklist = useCallback((id: string) => {
    setState((p) => { const u = p.checklist.map((i) => i.id === id ? { ...i, completed: !i.completed } : i); if (u.find((i) => i.id === id)?.completed) setRhythm((r) => recordTaskCompletion(r, id)); return { ...p, checklist: u }; });
  }, []);
  const toggleMealDone = useCallback((dn: string, m: "breakfast" | "lunch" | "dinner") => {
    setState((p) => { const c = p.mealsDone[dn] ?? { breakfast: false, lunch: false, dinner: false }; const v = !c[m]; if (v) setRhythm((r) => recordTaskCompletion(r, `meal-${m}`)); return { ...p, mealsDone: { ...p.mealsDone, [dn]: { ...c, [m]: v } } }; });
  }, []);
  const toggleWorkoutDone = useCallback(() => {
    setState((p) => { if (!p.workoutDone) setRhythm((r) => recordTaskCompletion(r, "workout")); return { ...p, workoutDone: !p.workoutDone }; });
  }, []);
  const toggleLazyMode = useCallback(() => setState((p) => ({ ...p, lazyMode: !p.lazyMode })), []);
  const toggleGroceryItem = useCallback((cid: string, iid: string) => {
    setState((p) => ({ ...p, groceries: p.groceries.map((c) => c.id === cid ? { ...c, items: c.items.map((i) => i.id === iid ? { ...i, checked: !i.checked } : i) } : c) }));
  }, []);
  const toggleSkincareStep = useCallback((t: "morning" | "night", sid: string) => {
    setState((p) => ({ ...p, skincare: p.skincare.map((r) => r.time === t ? { ...r, steps: r.steps.map((s) => s.id === sid ? { ...s, done: !s.done } : s) } : r) }));
  }, []);
  const toggleNightRoutine = useCallback((id: string) => {
    setState((p) => { const u = p.nightRoutine.map((i) => i.id === id ? { ...i, done: !i.done } : i); if (u.find((i) => i.id === id)?.done) setRhythm((r) => recordTaskCompletion(r, `nr-${id}`)); return { ...p, nightRoutine: u }; });
  }, []);
  const setLastSection = useCallback((id: SectionId) => { setLastSec(id); setFavorites((p) => recordSectionVisit(p, id)); }, []);
  const setMood = useCallback((level: MoodLevel) => { const e: MoodEntry = { level, timestamp: Date.now() }; setMoodState(e); saveMoodLocal(state.date, e); syncMood(state.date, level); }, [state.date]);
  const updateSettings = useCallback((patch: Partial<AppSettings>) => { setSettings((p) => { const n = { ...p, ...patch }; savePreferencesLocal(n); syncPreferences(n); return n; }); }, []);
  const clearAllData = useCallback(() => { if (typeof window === "undefined") return; Object.keys(localStorage).filter((k) => k.startsWith("pixie-") || k.startsWith("form-")).forEach((k) => localStorage.removeItem(k)); setState(freshState(getTrackerDate())); setSettings(defaultSettings); setCustomRecipes([]); }, []);

  // ── Water Intake Actions ─────────────────────────────────
  const addWater = useCallback((ml: number) => {
    setState((p) => ({ ...p, waterIntake: { ...p.waterIntake, amount: Math.min(p.waterIntake.amount + ml, 5000) } }));
  }, []);
  const setWaterAmount = useCallback((ml: number) => {
    setState((p) => ({ ...p, waterIntake: { ...p.waterIntake, amount: Math.max(0, Math.min(ml, 5000)) } }));
  }, []);

  // ── Lazy Day Selection Actions ───────────────────────────
  const setLazySelection = useCallback((category: string, index: number | null) => {
    setState((p) => ({ ...p, lazySelections: { ...p.lazySelections, [category]: index } }));
  }, []);

  // ── Checklist CRUD ───────────────────────────────────────
  const addChecklistItem = useCallback((label: string, emoji: string) => {
    setState((p) => ({
      ...p,
      checklist: [...p.checklist, { id: `custom-${Date.now()}`, label, emoji, completed: false, isCustom: true }],
    }));
  }, []);
  const editChecklistItem = useCallback((id: string, label: string, emoji: string) => {
    setState((p) => ({ ...p, checklist: p.checklist.map((i) => i.id === id ? { ...i, label, emoji } : i) }));
  }, []);
  const deleteChecklistItem = useCallback((id: string) => {
    setState((p) => ({ ...p, checklist: p.checklist.filter((i) => i.id !== id) }));
  }, []);

  // ── Grocery CRUD ─────────────────────────────────────────
  const addGroceryItem = useCallback((categoryId: string, name: string) => {
    setState((p) => ({
      ...p,
      groceries: p.groceries.map((c) => c.id === categoryId
        ? { ...c, items: [...c.items, { id: `gi-${Date.now()}`, name, checked: false, isCustom: true }] }
        : c),
    }));
  }, []);
  const editGroceryItem = useCallback((categoryId: string, itemId: string, name: string) => {
    setState((p) => ({
      ...p,
      groceries: p.groceries.map((c) => c.id === categoryId
        ? { ...c, items: c.items.map((i) => i.id === itemId ? { ...i, name } : i) }
        : c),
    }));
  }, []);
  const deleteGroceryItem = useCallback((categoryId: string, itemId: string) => {
    setState((p) => ({
      ...p,
      groceries: p.groceries.map((c) => c.id === categoryId
        ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
        : c),
    }));
  }, []);

  // ── Skincare CRUD ────────────────────────────────────────
  const addSkincareStep = useCallback((time: "morning" | "night", product: string, emoji: string) => {
    setState((p) => ({
      ...p,
      skincare: p.skincare.map((r) => r.time === time
        ? { ...r, steps: [...r.steps, { id: `sk-${Date.now()}`, step: r.steps.length + 1, product, emoji, done: false, isCustom: true }] }
        : r),
    }));
  }, []);
  const editSkincareStep = useCallback((time: "morning" | "night", stepId: string, product: string, emoji: string) => {
    setState((p) => ({
      ...p,
      skincare: p.skincare.map((r) => r.time === time
        ? { ...r, steps: r.steps.map((s) => s.id === stepId ? { ...s, product, emoji } : s) }
        : r),
    }));
  }, []);
  const deleteSkincareStep = useCallback((time: "morning" | "night", stepId: string) => {
    setState((p) => ({
      ...p,
      skincare: p.skincare.map((r) => r.time === time
        ? { ...r, steps: r.steps.filter((s) => s.id !== stepId).map((s, i) => ({ ...s, step: i + 1 })) }
        : r),
    }));
  }, []);

  // ── Custom Recipes CRUD ──────────────────────────────────
  const addCustomRecipe = useCallback((recipe: Omit<Recipe, "id" | "isCustom">) => {
    setCustomRecipes((p) => [...p, { ...recipe, id: `recipe-${Date.now()}`, isCustom: true }]);
  }, []);
  const editCustomRecipe = useCallback((id: string, patch: Partial<Recipe>) => {
    setCustomRecipes((p) => p.map((r) => r.id === id ? { ...r, ...patch } : r));
  }, []);
  const deleteCustomRecipe = useCallback((id: string) => {
    setCustomRecipes((p) => p.filter((r) => r.id !== id));
  }, []);

  // Smart nudges
  const nextAction = useMemo((): { label: string; href: string; emoji: string } | null => {
    if (dayPhase === "night" && flowScore >= 50) return null;
    if (dayPhase === "morning") {
      if (!state.workoutDone) return { label: "Start your workout", href: "/workout", emoji: "💪" };
      const mp = state.skincare.find((r) => r.time === "morning")?.steps.find((s) => !s.done);
      if (mp) return { label: "Morning skincare", href: "/skincare", emoji: "☀️" };
    }
    const pc = state.checklist.find((i) => !i.completed);
    if (pc) return { label: pc.label, href: "/checklist", emoji: pc.emoji };
    if (!state.workoutDone && dayPhase !== "night") return { label: "Start your workout", href: "/workout", emoji: "💪" };
    if (mealsDone < 3) return { label: "Check today's meals", href: "/meals", emoji: "🍽️" };
    if (dayPhase === "evening" || dayPhase === "night") {
      if (state.nightRoutine.find((i) => !i.done)) return { label: "Night routine", href: "/skincare", emoji: "🌙" };
      if (state.skincare.find((r) => r.time === "night")?.steps.find((s) => !s.done)) return { label: "Night skincare", href: "/skincare", emoji: "✨" };
    }
    return null;
  }, [state, dayPhase, mealsDone, flowScore]);

  return {
    ...state, hydrated, dayPhase, settings, lastSection, summary, historySummaries: hist,
    todayDayName: todayDay, checklistDone: summary.checklistDone, checklistTotal: summary.checklistTotal,
    completionPercent: summary.completionPercent, todayMealsDone: mealsDone,
    flowScore, flowState, currentStreak: streak, momentumLevel: momentum, recovery,
    weeklyReflection: weeklyRef, closureMessage: closure, heroMessage, focusMessage,
    dayMode, weeklyRhythm, mood, topFavorites: topFavs,
    dayPlan, rescuePlan, mvd, mealStrategy, isWeekend,
    supportConfig, homeRec, fallbackPath, workoutFraming, nightRoutineFraming, patternInsights,
    profile, memoryInsights, customRecipes,
    syncStatus, lastSynced,
    rewardToast, dismissRewardToast,
    nextAction, toggleChecklist, toggleMealDone, toggleWorkoutDone, toggleLazyMode,
    toggleGroceryItem, toggleSkincareStep, toggleNightRoutine, setLastSection,
    setMood, updateSettings, clearAllData,
    // New actions
    addWater, setWaterAmount, setLazySelection,
    addChecklistItem, editChecklistItem, deleteChecklistItem,
    addGroceryItem, editGroceryItem, deleteGroceryItem,
    addSkincareStep, editSkincareStep, deleteSkincareStep,
    addCustomRecipe, editCustomRecipe, deleteCustomRecipe,
  };
}
