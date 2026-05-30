import React from "react";
import { AlertTriangle } from "lucide-react";
import { ReportsConstants } from "../../constants/ReportsSharedConstants";

/**
 * ReportsStockEmptyState
 *
 * Responsibility (ONE): Renders the "Sab stock sahi level par hai"
 * empty state illustration + message when the filtered stock list
 * has zero results.
 *
 * No "use client" needed — pure JSX, no hooks or event listeners.
 */
export function ReportsStockEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-[var(--reports-muted-text)]">
      <AlertTriangle className="mb-2 h-8 w-8 opacity-20" />
      <p className="text-sm">{ReportsConstants.TEXTS.ALL_STOCK_GOOD}</p>
    </div>
  );
}
