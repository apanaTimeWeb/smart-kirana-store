"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";
import { HistoryReturnQtys } from "../../shared/HistoryTypes";
import { HISTORY_DEFAULT_UNIT } from "../../shared/HistorySharedConstants";

/**
 * Shape of a single bill line item as returned by the API.
 * Only the fields consumed by this component are declared here
 * to maintain minimal coupling to the full HistoryBill type.
 */
interface BillLineItem {
  productId: number;
  productName?: string;
  variantName?: string;
  quantity: number;
  returnedQuantity?: number;
  unitPrice: number;
  totalPrice: number;
  unit?: string;
  displayQuantity?: string;
}

interface HistoryBillItemReturnRowProps {
  /** The bill line item to render */
  item: BillLineItem;
  /** Currency symbol from store settings (e.g. "Rs") */
  currency: string;
  /**
   * Current return qty map. This row reads only its own productId key.
   * Passed from parent (HistoryBillDetailsDialog) to keep state centralised.
   */
  returnQtys: HistoryReturnQtys;
  /**
   * Called when the user changes the return qty input for this item.
   * Parent validates and clamps the value before updating returnQtys.
   */
  onQtyChange: (productId: number, val: string, max: number) => void;
}

/**
 * HistoryBillItemReturnRow
 *
 * Renders one item row inside the return dialog's scrollable list:
 *   - Product name + variant
 *   - Quantity + unit price (sub-text)
 *   - "X already returned" indicator (if partial return was done before)
 *   - Return Qty input   → if items are still returnable
 *   - "Fully Returned" badge → if all units were already returned
 *
 * No context reads — all data flows in via props.
 * One file = one row = one responsibility.
 */
export function HistoryBillItemReturnRow({
  item,
  currency,
  returnQtys,
  onQtyChange,
}: HistoryBillItemReturnRowProps) {
  const previousReturnQty = item.returnedQuantity ?? 0;
  const maxReturnable = item.quantity - previousReturnQty;
  const currentReturnVal = returnQtys[item.productId] ?? "";
  const displayQty = item.displayQuantity || `${item.quantity} ${item.unit || HISTORY_DEFAULT_UNIT}`;

  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--history-border)] last:border-0 border-dashed">
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
          {displayQty} x {currency} {item.unitPrice}
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
              onChange={(e) => onQtyChange(item.productId, e.target.value, maxReturnable)}
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
}
