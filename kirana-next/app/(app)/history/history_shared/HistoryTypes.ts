import { Bill } from "@/lib/api/types";

// Re-export Bill type for convenience within this module
export type HistoryBill = Bill;

/**
 * Shared type for the per-item return quantity map.
 * Key: productId (number), Value: qty string from input (empty string = not set).
 * Defined here once so all three components (Dialog, ReturnList, ItemRow) share the same shape.
 */
export type HistoryReturnQtys = Record<number, string>;


