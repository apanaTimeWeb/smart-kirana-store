// KhataCustomerListSkeleton.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Responsibility: Renders animated skeleton placeholders while the customer
// list data is being fetched from the API.
//
// Pure presentational component — no hooks, no state, no context.
// To change the loading appearance, touch ONLY this file.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function KhataCustomerListSkeleton() {
  return (
    <div className="p-8 space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between px-2"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}
