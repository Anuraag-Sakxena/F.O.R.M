"use client";

import { AnimatePresence, motion } from "framer-motion";

interface CompletionCelebrationProps {
  visible: boolean;
  onDismiss: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
} as const;

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
} as const;

const emojiVariants = {
  hidden: { scale: 0.8 },
  visible: {
    scale: [1, 1.1, 1] as number[],
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
      times: [0, 0.5, 1] as number[],
    },
  },
};

export function CompletionCelebration({
  visible,
  onDismiss,
}: CompletionCelebrationProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="celebration-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.25 }}
          onClick={onDismiss}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm"
        >
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-3xl shadow-lg p-8 mx-6 text-center"
          >
            <motion.span
              variants={emojiVariants}
              initial="hidden"
              animate="visible"
              className="block text-5xl mb-4"
            >
              ✨
            </motion.span>

            <h2 className="text-lg font-semibold text-foreground">
              Daily flow complete
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Everything important got your attention today.
            </p>

            <button
              onClick={onDismiss}
              className="mt-6 rounded-full bg-primary text-primary-foreground px-6 py-2 text-sm font-medium active:scale-95 transition-transform"
            >
              Nice
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
