import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * ReportsKhataSkeletonList
 *
 * Responsibility (ONE): Renders 3 animated skeleton rows while the
 * pending khata API data is loading.
 *
 * No "use client" needed — pure JSX, no hooks or event listeners.
 */
export function ReportsKhataSkeletonList() {
  return (
    <div className="space-y-2 p-5">
      {[1, 2, 3].map((item) => (
        <Skeleton key={item} className="h-10 w-full" />
      ))}
    </div>
  );
}
