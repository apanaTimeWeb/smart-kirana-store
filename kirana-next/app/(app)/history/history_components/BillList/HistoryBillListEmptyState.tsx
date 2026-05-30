"use client";

import React from "react";
import { FileText } from "lucide-react";

/**
 * HistoryBillListEmptyState
 *
 * Shown inside the bill list when no bills match the current search query
 * (or when no bills exist at all).
 *
 * Purely presentational — no props, no context reads.
 * To change the empty state message or icon, edit only this file.
 */
export function HistoryBillListEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-[var(--history-muted-text)] bg-[var(--history-card-bg)] rounded-lg border border-[var(--history-border)] border-dashed">
      <FileText className="h-10 w-10 mb-2 opacity-20" />
      <p>Koi bill nahi mila.</p>
    </div>
  );
}
