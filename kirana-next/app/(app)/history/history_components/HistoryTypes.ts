import { Bill } from "@/lib/api/types";

// Re-export Bill type for convenience within this module
export type HistoryBill = Bill;

/**
 * Shared type for the per-item return quantity map.
 * Key: productId (number), Value: qty string from input (empty string = not set).
 * Defined here once so all three components (Dialog, ReturnList, ItemRow) share the same shape.
 */
export type HistoryReturnQtys = Record<number, string>;

/**
 * Default unit label shown when a bill item has no unit field set.
 * Change here to affect all item rows and print/WA receipts simultaneously.
 */
export const HISTORY_DEFAULT_UNIT = "pcs" as const;

/**
 * Payment mode badge styles keyed by paymentMode string from the API.
 * Uses CSS variables so all colors are controlled from history.css.
 */
export const HISTORY_PAYMENT_MODE_STYLES: Record<string, string> = {
  khata: "text-[var(--history-warning-text)] border-[var(--history-warning-border)] bg-[var(--history-warning-bg)]",
  upi: "text-[var(--history-primary-text)] border-[var(--history-primary-border)] bg-[var(--history-primary-bg)]",
  cash: "text-[var(--history-positive-text)] border-[var(--history-positive-border)] bg-[var(--history-positive-bg)]",
};
