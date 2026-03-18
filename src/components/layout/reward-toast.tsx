"use client";

import { useTracker } from "@/hooks/tracker-context";
import { SuccessToast } from "@/components/ui/success-toast";

export function RewardToast() {
  const { rewardToast, dismissRewardToast } = useTracker();

  return (
    <SuccessToast
      message={rewardToast ?? ""}
      visible={!!rewardToast}
      onDone={dismissRewardToast}
    />
  );
}
