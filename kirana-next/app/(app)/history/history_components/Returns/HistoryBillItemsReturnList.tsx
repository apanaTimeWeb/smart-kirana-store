"use client";

import React from "react";
import { useHistoryContext } from "../../history_context/HistoryContext";
import { HistoryReturnQtys } from "../../history_shared/HistoryTypes";
import { HistorySearchFilter } from "../Common/HistorySearchFilter";
import { HistoryReturnInfoBanner } from "./HistoryReturnInfoBanner";
import { HistoryBillItemReturnRow } from "./HistoryBillItemReturnRow";
import { HistoryReturnRefundSummary } from "./HistoryReturnRefundSummary";

interface HistoryBillItemsReturnListProps {
  /** Per-item return quantities keyed by productId — owned by HistoryBillDetailsDialog */
  returnQtys: HistoryReturnQtys;
  /** Called when the user changes a return qty input — parent validates + clamps */
  onQtyChange: (productId: number, val: string, max: number) => void;
  /** Current item search query inside the dialog */
  searchQuery: string;
  /** Called when item search query changes */
  onSearchChange: (value: string) => void;
  /** Running refund total computed from returnQtys in parent dialog */
  totalRefund: number;
}

/**
 * HistoryBillItemsReturnList
 *
 * Slim orchestrator for the scrollable body of the bill details dialog.
 * Single responsibility: compose the three sub-components in the correct order.
 *
 *   ┌─ Scrollable body ──────────────────────────────────────────────┐
 *   │  <HistoryReturnInfoBanner />        ← static instruction text  │
 *   │  <HistorySearchFilter />            ← filter items by name     │
 *   │  <HistoryBillItemReturnRow />  × N  ← one row per item         │
 *   │  <HistoryReturnRefundSummary />     ← totals at the bottom     │
 *   └────────────────────────────────────────────────────────────────┘
 *
 * selectedBill and currency are read directly from HistoryContext.
 * returnQtys and handlers come from the parent HistoryBillDetailsDialog.
 */
export function HistoryBillItemsReturnList({
  returnQtys,
  onQtyChange,
  searchQuery,
  onSearchChange,
  totalRefund,
}: HistoryBillItemsReturnListProps) {
  const { selectedBill, currency } = useHistoryContext();

  if (!selectedBill) return null;

  const filteredItems = selectedBill.items.filter(
    (item) =>
      !searchQuery ||
      item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.variantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
      {/* Step 1: Explain return process */}
      <HistoryReturnInfoBanner />

      {/* Step 2: Item list with inline search */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--history-border)] pb-2 gap-2">
          <h3 className="font-semibold text-sm whitespace-nowrap">Purchased Items</h3>
          <HistorySearchFilter
            placeholder="Search items..."
            value={searchQuery}
            onChange={onSearchChange}
            className="relative max-w-[200px] w-full"
            inputClassName="h-8 pl-8 text-xs"
          />
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-4 text-xs text-[var(--history-muted-text)]">
            Koi item nahi mila
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <HistoryBillItemReturnRow
              key={idx}
              item={item}
              currency={currency}
              returnQtys={returnQtys}
              onQtyChange={onQtyChange}
            />
          ))
        )}
      </div>

      {/* Step 3: Refund totals summary */}
      <HistoryReturnRefundSummary
        currency={currency}
        finalAmount={selectedBill.finalAmount}
        totalRefund={totalRefund}
      />
    </div>
  );
}
