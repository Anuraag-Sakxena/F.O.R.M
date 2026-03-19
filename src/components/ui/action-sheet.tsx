"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ActionSheetOption {
  label: string;
  icon?: React.ReactNode;
  destructive?: boolean;
  onPress: () => void;
}

interface ActionSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  options: ActionSheetOption[];
}

export function ActionSheet({ open, onClose, title, options }: ActionSheetProps) {
  const pendingAction = useRef<(() => void) | null>(null);

  const handleOption = useCallback((action: () => void) => {
    pendingAction.current = action;
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open && pendingAction.current) {
      const action = pendingAction.current;
      pendingAction.current = null;
      // Run the action then refresh to guarantee clean state
      setTimeout(() => {
        action();
        window.location.reload();
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="as-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            key="as-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 34 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg"
          >
            <div className="rounded-t-2xl bg-card shadow-lg border-t border-border/40 pb-[env(safe-area-inset-bottom)]">
              <div className="flex justify-center pt-2.5 pb-1">
                <div className="h-1 w-8 rounded-full bg-border" />
              </div>
              {title && (
                <p className="text-[11px] text-muted-foreground text-center px-5 pb-2">
                  {title}
                </p>
              )}
              <div className="px-3 pb-3 space-y-0.5">
                {options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleOption(opt.onPress)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors active:bg-muted ${
                      opt.destructive ? "text-danger" : "text-foreground"
                    }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground active:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
