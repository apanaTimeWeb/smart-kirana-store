"use client";

import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { HISTORY_PAYMENT_MODE_STYLES } from "./HistoryTypes";
import { useHistoryContext } from "./HistoryContext";

/**
 * HistoryBillDetailsHeader
 *
 * Renders the sticky header section of the bill details dialog:
 *   - Bill ID and payment mode badge (Cash / UPI / Khata)
 *   - Formatted date/time and customer name
 *
 * Reads selectedBill directly from HistoryContext — no props needed.
 * If selectedBill is null (dialog closed), renders nothing.
 */
export function HistoryBillDetailsHeader() {
  const { selectedBill } = useHistoryContext();

  if (!selectedBill) return null;

  return (
    <DialogHeader className="p-4 md:p-5 border-b border-[var(--history-border)] bg-[var(--history-muted-bg)] shrink-0">
      <DialogTitle className="flex justify-between items-center">
        <span>Bill #{selectedBill.id} Details</span>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
            HISTORY_PAYMENT_MODE_STYLES[selectedBill.paymentMode] ||
            HISTORY_PAYMENT_MODE_STYLES.cash
          }`}
        >
          {selectedBill.paymentMode.toUpperCase()}
        </span>
      </DialogTitle>
      <div className="text-xs text-[var(--history-muted-text)] mt-1">
        {format(new Date(selectedBill.createdAt), "dd MMM yyyy, hh:mm a")}
        {selectedBill.customerName && ` • 👤 ${selectedBill.customerName}`}
      </div>
    </DialogHeader>
  );
}
