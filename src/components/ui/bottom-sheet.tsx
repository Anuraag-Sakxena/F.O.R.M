"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
} as const;

const sheetVariants = {
  hidden: { y: "100%" },
  visible: { y: 0 },
} as const;

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  // Safety: ensure body scroll is never stuck after unmount
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
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-lg"
          >
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full bg-border mx-auto mt-3 mb-2" />

            {title && (
              <div className="px-5 pb-2 pt-1">
                <h2 className="text-sm font-semibold text-foreground">
                  {title}
                </h2>
              </div>
            )}

            {/* Content */}
            <div className="px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] max-h-[70dvh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
