"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * HistoryReturnInfoBanner
 *
 * A contextual info banner shown at the top of the return items list.
 * Explains to the user how the return process works (fill quantity → auto-adjust).
 *
 * Purely presentational — no props, no context reads.
 * To change the return instructions copy, edit only this file.
 */
export function HistoryReturnInfoBanner() {
  return (
    <div className="bg-[var(--history-primary-bg)] border border-[var(--history-primary-border)] rounded-lg p-3 flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-[var(--history-primary-text)] shrink-0 mt-0.5" />
      <p className="text-xs text-[var(--history-primary-text)]">
        Kisi item ko return karne ke liye uski &apos;Return Qty&apos; box me number daalein.
        Stock aur Khata (agar applicable hai) auto-adjust ho jayega.
      </p>
    </div>
  );
}
