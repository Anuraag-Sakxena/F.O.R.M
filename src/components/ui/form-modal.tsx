"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  submitDisabled?: boolean;
}

export function FormModal({
  open, onClose, title, children, onSubmit, submitLabel = "Save", submitDisabled,
}: FormModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="fm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="fm-content"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg"
          >
            <div className="rounded-t-3xl bg-card shadow-lg border-t border-border/40">
              <div className="flex justify-center pt-2.5 pb-1">
                <div className="h-1 w-8 rounded-full bg-border" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3">
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <button type="button" onClick={onClose} className="p-1 text-muted-foreground rounded-full active:bg-muted">
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 pb-4 max-h-[60dvh] overflow-y-auto">
                {children}
              </div>

              {/* Submit */}
              {onSubmit && (
                <div className="px-5 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={submitDisabled}
                    className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-sm font-medium disabled:opacity-40 active:scale-[0.98] transition-transform"
                  >
                    {submitLabel}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Reusable form input
export function FormInput({
  label, value, onChange, placeholder, multiline,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  const cls = "w-full rounded-xl bg-muted/50 border border-border/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30";
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}
