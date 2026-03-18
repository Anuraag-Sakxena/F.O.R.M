"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

interface SuccessToastProps {
  message: string;
  visible: boolean;
  onDone: () => void;
}

export function SuccessToast({ message, visible, onDone }: SuccessToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, [visible, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-card border border-border shadow-lg rounded-full px-5 py-2.5"
        >
          <Check size={16} className="text-success shrink-0" />
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
