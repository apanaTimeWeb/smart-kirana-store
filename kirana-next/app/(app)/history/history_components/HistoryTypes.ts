import { Bill } from "@/lib/api/types";

// Re-export Bill type for convenience within this module
export type HistoryBill = Bill;

export const HISTORY_PAYMENT_MODE_STYLES: Record<string, string> = {
  khata: "text-[var(--history-warning-text)] border-[var(--history-warning-border)] bg-[var(--history-warning-bg)]",
  upi: "text-[var(--history-primary-text)] border-[var(--history-primary-border)] bg-[var(--history-primary-bg)]",
  cash: "text-[var(--history-positive-text)] border-[var(--history-positive-border)] bg-[var(--history-positive-bg)]",
};
