import React from "react";
import { BookOpen } from "lucide-react";
import { ReportsConstants } from "../../reports_constants/ReportsSharedConstants";

/**
 * ReportsKhataEmptyState
 *
 * Responsibility (ONE): Renders the "Koi udhaar nahi, sab clear hai"
 * empty state illustration + message when the filtered khata list
 * has zero results.
 *
 * No "use client" needed — pure JSX, no hooks or event listeners.
 */
export function ReportsKhataEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-[var(--reports-muted-text)]">
      <BookOpen className="mb-2 h-8 w-8 opacity-20" />
      <p className="text-sm">{ReportsConstants.TEXTS.NO_UDHAAR}</p>
    </div>
  );
}
