"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { AlertCircle, RotateCcw } from "lucide-react";
import { useHistoryContext } from "./HistoryContext";
import { HistorySearchFilter } from "./HistorySearchFilter";

interface HistoryBillItemsReturnListProps {
  /** Per-item return quantities keyed by productId */
  returnQtys: Record<number, string>;
  /** Called when user changes a return qty input */
  onQtyChange: (productId: number, val: string, max: number) => void;
  /** Current item search query inside the dialog */
  searchQuery: string;
  /** Called when item search query changes */
  onSearchChange: (value: string) => void;
  /** Running refund total computed from returnQtys in parent */
  totalRefund: number;
}

/**
 * HistoryBillItemsReturnList
 *
 * Renders the scrollable body section of the bill details dialog:
 *   - Info banner explaining the return process
 *   - Searchable list of purchased items with per-item return qty inputs
 *   - "Fully Returned" badge for items already fully returned
 *   - Running refund amount summary at the bottom
 *
 * returnQtys and handlers come from the parent HistoryBillDetailsDialog (local state).
 * selectedBill and currency are read from HistoryContext directly.
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

  const hasReturns = totalRefund > 0;

  const filteredItems = selectedBill.items.filter(
    (item) =>
      !searchQuery ||
      item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.variantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
      {/* Info banner */}
      <div className="bg-[var(--history-primary-bg)] border border-[var(--history-primary-border)] rounded-lg p-3 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-[var(--history-primary-text)] shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--history-primary-text)]">
          Kisi item ko return karne ke liye uski &apos;Return Qty&apos; box me number daalein.
          Stock aur Khata (agar applicable hai) auto-adjust ho jayega.
        </p>
      </div>

      {/* Items list with search */}
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
          filteredItems.map((item, idx) => {
            const previousReturnQty = item.returnedQuantity ?? 0;
            const maxReturnable = item.quantity - previousReturnQty;
            const currentReturnVal = returnQtys[item.productId] ?? "";

            return (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-[var(--history-border)] last:border-0 border-dashed"
              >
                {/* Item info */}
                <div className="flex-1 min-w-0 pr-3">
                  <p
                    className="font-medium text-sm truncate"
                    title={item.productName || item.variantName}
                  >
                    {item.productName}{" "}
                    {item.variantName && (
                      <span className="text-[var(--history-muted-text)] text-xs">
                        ({item.variantName})
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[var(--history-muted-text)] mt-0.5">
                    {item.displayQuantity || `${item.quantity} ${item.unit || "pcs"}`} x {currency}{" "}
                    {item.unitPrice}
                  </p>
                  {previousReturnQty > 0 && (
                    <p className="text-[10px] text-[var(--history-destructive-text)] mt-0.5 font-medium flex items-center gap-1">
                      <RotateCcw className="h-3 w-3" />
                      {previousReturnQty} already returned
                    </p>
                  )}
                </div>

                {/* Price + return input */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="font-semibold text-sm">
                    {currency} {item.totalPrice}
                  </div>
                  {maxReturnable > 0 ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-[var(--history-muted-text)]">Return Qty:</span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-16 h-7 text-center text-xs px-1"
                        placeholder={`Max ${maxReturnable}`}
                        value={currentReturnVal}
                        onChange={(e) =>
                          onQtyChange(item.productId, e.target.value, maxReturnable)
                        }
                      />
                    </div>
                  ) : (
                    <div className="text-[10px] text-[var(--history-muted-text)] bg-[var(--history-muted-bg)] px-2 py-0.5 rounded-sm mt-1">
                      Fully Returned
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Refund summary */}
      <div className="pt-2">
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-[var(--history-muted-text)]">Original Total:</span>
          <span>
            {currency} {selectedBill.finalAmount}
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
    </div>
  );
}
