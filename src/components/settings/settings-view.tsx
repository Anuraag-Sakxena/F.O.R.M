"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock, Sparkles, SmilePlus, Trash2, Info,
  Brain, MessageCircleHeart, Compass, Heart, UtensilsCrossed, Gauge, Lightbulb,
  Shield,
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

      <div className="px-5 pb-10 space-y-7">
        {/* ── App Behavior ─── */}
        <Sec label="App Behavior">
          <Row icon={<Clock size={17} className="text-primary" />} title="Daily reset time" desc="Your day starts fresh at this time">
            <span className="text-sm font-semibold text-foreground">7:00 AM</span>
          </Row>
          <Row icon={<Sparkles size={17} className="text-accent-lavender" />} title="Animations" desc="Smooth transitions and motion effects">
            <Toggle on={settings.animationsEnabled} set={(v) => updateSettings({ animationsEnabled: v })} />
          </Row>
          <Row icon={<SmilePlus size={17} className="text-accent-peach" />} title="Show emojis" desc="Emojis in greetings and cards">
            <Toggle on={settings.showEmojis} set={(v) => updateSettings({ showEmojis: v })} />
          </Row>
        </Sec>

        {/* ── Intelligence ─── */}
        <Sec label="Intelligence">
          <Row icon={<Brain size={17} className="text-accent-sky" />} title="Adaptive ordering" desc="Reorders sections based on your habits">
            <Toggle on={settings.adaptiveEnabled} set={(v) => updateSettings({ adaptiveEnabled: v })} />
          </Row>
          <Row icon={<MessageCircleHeart size={17} className="text-accent-pink" />} title="Daily check-in" desc="Quick energy check each morning">
            <Toggle on={settings.checkInEnabled} set={(v) => updateSettings({ checkInEnabled: v })} />
          </Row>
          <Row icon={<Lightbulb size={17} className="text-accent-amber" />} title="Adaptive memory" desc="Learns from your patterns over time">
            <Toggle on={settings.adaptiveMemoryEnabled} set={(v) => updateSettings({ adaptiveMemoryEnabled: v })} />
          </Row>
        </Sec>

        {/* ── Planner ─── */}
        <Sec label="Planner">
          <Row icon={<Compass size={17} className="text-primary" />} title="Today's Plan" desc="Daily structured guidance">
            <Toggle on={settings.showPlan} set={(v) => updateSettings({ showPlan: v })} />
          </Row>
          <Row icon={<Heart size={17} className="text-accent-rose" />} title="Rescue plans" desc="Supportive guidance on tough days">
            <Toggle on={settings.showRescue} set={(v) => updateSettings({ showRescue: v })} />
          </Row>
          <Row icon={<UtensilsCrossed size={17} className="text-accent-peach" />} title="Meal suggestions" desc="Smart Cook / Lazy Mode hints">
            <Toggle on={settings.mealSuggestions} set={(v) => updateSettings({ mealSuggestions: v })} />
          </Row>
          <Row icon={<Gauge size={17} className="text-accent-mint" />} title="Good-enough days" desc="Recognize when the basics are covered">
            <Toggle on={settings.showMVDMessages} set={(v) => updateSettings({ showMVDMessages: v })} />
          </Row>
        </Sec>

        {/* ── Style ─── */}
        <Sec label="Style">
          <StylePicker
            label="Planner depth"
            desc="How detailed should planning guidance be?"
            options={plannerOpts}
            value={settings.plannerStyle}
            onChange={(v) => updateSettings({ plannerStyle: v as PlannerStyle })}
          />
          <StylePicker
            label="Motivation tone"
            desc="How the app talks to you"
            options={microcopyOpts}
            value={settings.microcopyIntensity}
            onChange={(v) => updateSettings({ microcopyIntensity: v as MicrocopyIntensity })}
          />
        </Sec>

        {/* ── Data & Privacy ─── */}
        <Sec label="Data & Privacy">
          <div className="rounded-2xl bg-card border border-border/60 shadow-xs p-4">
            <div className="flex items-start gap-3 mb-3">
              <Shield size={17} className="text-accent-sky mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Your data is private</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  Saved on this device{syncStatus === "synced" ? " and synced securely" : ""}. Adaptive memory stays private to your F.O.R.M. data.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-border/30">
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
                   syncStatus === "local-only" ? "Local only — everything is safe on this device" : "Sync paused — saved locally"}
                </span>
              </div>
              {lastSynced && (
                <span className="text-[10px] text-muted-foreground/40">
                  {lastSynced.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border/60 shadow-xs p-4">
            <div className="flex items-start gap-3">
              <Trash2 size={17} className="text-danger mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Reset all data</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Clears history, streaks, preferences, and learned patterns</p>
              </div>
            </div>
            <motion.button
              type="button"
              className={cn(
                "mt-3 w-full rounded-xl py-2.5 text-xs font-medium transition-colors",
                confirmClear ? "bg-danger text-white" : "bg-danger-soft text-danger"
              )}
              whileTap={{ scale: 0.97 }}
              onClick={handleClear}
            >
              {confirmClear ? "Tap again to confirm reset" : "Reset data"}
            </motion.button>
          </div>
        </Sec>

        {/* ── About ─── */}
        <div className="rounded-2xl bg-card border border-border/60 shadow-xs p-5 text-center">
          <p className="text-base font-bold text-foreground tracking-tight">F.O.R.M.</p>
          <p className="text-[11px] text-muted-foreground mt-1">Focus. Optimize. Repeat. Master.</p>
          <p className="text-[10px] text-muted-foreground/40 mt-3">v1 · Made with Love for my Pixie</p>
        </div>
      </div>
    </AnimatedPage>
  );
}

function Sec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/70 mb-2.5 px-1">{label}</p>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function Row({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card border border-border/60 shadow-xs px-4 py-3.5">
      <div className="shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-foreground">{title}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
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
      className={cn("relative inline-flex h-[26px] w-[46px] shrink-0 items-center rounded-full transition-colors", on ? "bg-primary" : "bg-muted")}
      onClick={() => set(!on)}
    >
      <motion.span
        className="inline-block h-[20px] w-[20px] rounded-full bg-white shadow-sm"
        animate={{ x: on ? 22 : 3 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

function StylePicker({ label, desc, options, value, onChange }: {
  label: string; desc: string;
  options: { value: string; label: string; preview?: string }[];
  value: string; onChange: (v: string) => void;
}) {
  const selected = options.find((o) => o.value === value);
  return (
    <div className="rounded-2xl bg-card border border-border/60 shadow-xs p-4">
      <p className="text-[13px] font-medium text-foreground">{label}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5 mb-3">{desc}</p>
      <div className="flex gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={cn(
              "flex-1 rounded-xl py-2 text-[11px] font-medium text-center transition-colors",
              value === o.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {selected?.preview && (
        <p className="text-[10px] text-muted-foreground/60 text-center mt-2">{selected.preview}</p>
      )}
    </div>
  );
}
