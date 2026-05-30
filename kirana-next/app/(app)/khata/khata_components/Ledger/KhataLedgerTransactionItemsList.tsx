// KhataLedgerTransactionItemsList.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Responsibility: Renders the expandable list of purchased bill items that
// appear beneath a credit-type transaction row in the Khata ledger table.
//
// This is shown when a credit transaction was created from a bill (Billing
// module → Khata payment) and the transaction carries an attached items array.
//
// Pure presentational component — no hooks, no state, no context.
// To change how purchased items are displayed in the ledger, touch ONLY this file.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { type BillItem } from "@/lib/api";

interface KhataLedgerTransactionItemsListProps {
  /** The list of bill items attached to a credit transaction. */
  items: BillItem[];
}

export function KhataLedgerTransactionItemsList({ items }: KhataLedgerTransactionItemsListProps) {
  if (items.length === 0) return null;

  return (
    <div className="bg-[var(--khata-muted-hover-bg)] px-4 sm:px-[140px] py-2 text-xs border-t border-dashed border-[var(--khata-border)]">
      <div className="space-y-1">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-[var(--khata-muted-text)]">
            <span>
              {item.productName}{" "}
              {item.variantName ? `(${item.variantName})` : ""} x{" "}
              {item.displayQuantity || item.quantity}
            </span>
            <span>₹{item.totalPrice.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
