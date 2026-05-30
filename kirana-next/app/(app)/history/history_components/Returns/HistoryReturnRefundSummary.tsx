"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

interface HistoryReturnRefundSummaryProps {
  /** Currency symbol from store settings (e.g. "Rs") */
  currency: string;
  /** The original bill's final amount before any returns */
  finalAmount: number;
  /** Running refund total computed from current returnQtys selection */
  totalRefund: number;
}

/**
 * HistoryReturnRefundSummary
 *
 * Renders the financial summary at the bottom of the return dialog body:
 *   - "Original Total" — the bill's finalAmount
 *   - "Refund Amount" — highlighted block (only visible when totalRefund > 0)
 *
 * Purely presentational — all values come as props.
 * To change refund summary styling, edit only this file.
 */
export function HistoryReturnRefundSummary({
  currency,
  finalAmount,
  totalRefund,
}: HistoryReturnRefundSummaryProps) {
  const hasReturns = totalRefund > 0;

  return (
    <div className="pt-2">
      <div className="flex justify-between items-center text-sm mb-1">
        <span className="text-[var(--history-muted-text)]">Original Total:</span>
        <span>
          {currency} {finalAmount}
        </span>
      </div>
      {hasReturns && (
        <div className="flex justify-between items-center text-sm font-bold text-[var(--history-destructive-text)] mt-2 p-2 bg-[var(--history-destructive-bg)] rounded-md border border-[var(--history-destructive-border)]">
          <span className="flex items-center gap-1">
            <RotateCcw className="h-4 w-4" /> Refund Amount:
          </span>
          <span>
            {currency} {totalRefund.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
