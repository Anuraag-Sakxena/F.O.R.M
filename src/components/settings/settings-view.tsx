"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock, Sparkles, SmilePlus, Trash2, Info,
  Brain, MessageCircleHeart, Compass, Heart, UtensilsCrossed, Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";
import { AnimatedPage } from "@/components/ui/animated-page";
import { PageHeader } from "@/components/ui/page-header";
import type { MicrocopyIntensity, PlannerStyle } from "@/types";

export function SettingsView() {
  const { settings, updateSettings, clearAllData, syncStatus, lastSynced } = useTracker();
  const [confirmClear, setConfirmClear] = useState(false);

  const microcopyOpts: { value: MicrocopyIntensity; label: string; preview: string }[] = [
    { value: "light", label: "Light", preview: "Short and minimal" },
    { value: "normal", label: "Normal", preview: "Warm and encouraging" },
    { value: "playful", label: "Playful", preview: "Bold and expressive" },
  ];

  const plannerOpts: { value: PlannerStyle; label: string }[] = [
    { value: "minimal", label: "Minimal" },
    { value: "balanced", label: "Balanced" },
    { value: "supportive", label: "Supportive" },
  ];

  const handleClear = () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    clearAllData(); setConfirmClear(false);
  };

  return (
    <AnimatedPage>
      <PageHeader title="Settings" emoji="⚙️" backHref="/" />

      <div className="px-5 pb-8 space-y-8">
        {/* App Behavior */}
        <Section label="App Behavior">
          <Row icon={<Clock size={18} className="text-primary" />} title="Daily reset time" desc="Day resets at this time">
            <span className="text-sm font-medium text-foreground">7:00 AM</span>
          </Row>
          <Row icon={<Sparkles size={18} className="text-accent-lavender" />} title="Animations" desc="Smooth transitions and motion">
            <Toggle on={settings.animationsEnabled} set={(v) => updateSettings({ animationsEnabled: v })} />
          </Row>
          <Row icon={<SmilePlus size={18} className="text-accent-peach" />} title="Show emojis" desc="Emojis in greetings and cards">
            <Toggle on={settings.showEmojis} set={(v) => updateSettings({ showEmojis: v })} />
          </Row>
        </Section>

        {/* Personalization */}
        <Section label="Personalization">
          <Row icon={<Brain size={18} className="text-accent-sky" />} title="Adaptive ordering" desc="Reorders sections based on your habits">
            <Toggle on={settings.adaptiveEnabled} set={(v) => updateSettings({ adaptiveEnabled: v })} />
          </Row>
          <Row icon={<MessageCircleHeart size={18} className="text-accent-pink" />} title="Daily check-in" desc="Quick mood check each morning">
            <Toggle on={settings.checkInEnabled} set={(v) => updateSettings({ checkInEnabled: v })} />
          </Row>
        </Section>

        {/* Planner */}
        <Section label="Planner">
          <Row icon={<Compass size={18} className="text-primary" />} title="Today's Plan" desc="Show daily plan guidance on Home">
            <Toggle on={settings.showPlan} set={(v) => updateSettings({ showPlan: v })} />
          </Row>
          <Row icon={<Heart size={18} className="text-accent-rose" />} title="Rescue plans" desc="Supportive guidance on tough days">
            <Toggle on={settings.showRescue} set={(v) => updateSettings({ showRescue: v })} />
          </Row>
          <Row icon={<UtensilsCrossed size={18} className="text-accent-peach" />} title="Meal suggestions" desc="Smart meal mode recommendations">
            <Toggle on={settings.mealSuggestions} set={(v) => updateSettings({ mealSuggestions: v })} />
          </Row>
          <Row icon={<Gauge size={18} className="text-accent-mint" />} title="Good-enough messaging" desc={`"Held together" day recognition`}>
            <Toggle on={settings.showMVDMessages} set={(v) => updateSettings({ showMVDMessages: v })} />
          </Row>

          <div className="rounded-2xl bg-card border border-border/60 shadow-xs p-4">
            <p className="text-sm font-medium text-foreground mb-1">Planner style</p>
            <p className="text-[11px] text-muted-foreground mb-3">How detailed should planning guidance be?</p>
            <div className="flex gap-2">
              {plannerOpts.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={cn(
                    "flex-1 rounded-xl py-2.5 text-xs font-medium transition-colors text-center",
                    settings.plannerStyle === o.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                  onClick={() => updateSettings({ plannerStyle: o.value })}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Motivation Style */}
        <Section label="Motivation Style">
          <div className="rounded-2xl bg-card border border-border/60 shadow-xs p-4">
            <div className="flex gap-2 mb-3">
              {microcopyOpts.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={cn(
                    "flex-1 rounded-xl py-2.5 text-center transition-colors",
                    settings.microcopyIntensity === o.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                  onClick={() => updateSettings({ microcopyIntensity: o.value })}
                >
                  <span className="text-xs font-medium">{o.label}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              {microcopyOpts.find((o) => o.value === settings.microcopyIntensity)?.preview}
            </p>
          </div>
        </Section>

        {/* Data */}
        <Section label="Data">
          <div className="rounded-2xl bg-card border border-border/60 shadow-xs p-4">
            <div className="flex items-start gap-3">
              <Trash2 size={18} className="text-danger mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Clear all data</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Removes history, streaks, and preferences</p>
              </div>
            </div>
            <motion.button
              type="button"
              className={cn("mt-3 w-full rounded-xl py-2.5 text-xs font-medium transition-colors", confirmClear ? "bg-danger text-white" : "bg-danger-soft text-danger")}
              whileTap={{ scale: 0.97 }}
              onClick={handleClear}
            >
              {confirmClear ? "Tap again to confirm" : "Clear data"}
            </motion.button>
          </div>
        </Section>

        {/* About + Sync */}
        <div className="rounded-2xl bg-card border border-border/60 shadow-xs p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-accent-sky mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-foreground tracking-tight">F.O.R.M.</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Focus. Optimize. Repeat. Master.</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "h-1.5 w-1.5 rounded-full",
                syncStatus === "synced" ? "bg-success" :
                syncStatus === "syncing" ? "bg-accent-amber" :
                syncStatus === "local-only" ? "bg-muted-foreground/40" : "bg-accent-rose/60"
              )} />
              <span className="text-[10px] text-muted-foreground">
                {syncStatus === "synced" ? "Synced" :
                 syncStatus === "syncing" ? "Syncing…" :
                 syncStatus === "local-only" ? "Local only" : "Sync issue"}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground/40">
              {lastSynced ? `Last: ${lastSynced.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "v5.0.0"}
            </span>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2.5 px-1">{label}</p>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card border border-border/60 shadow-xs p-4">
      <div className="shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ on, set }: { on: boolean; set: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={cn("relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors", on ? "bg-primary" : "bg-muted")}
      onClick={() => set(!on)}
    >
      <motion.span
        className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
        animate={{ x: on ? 22 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
