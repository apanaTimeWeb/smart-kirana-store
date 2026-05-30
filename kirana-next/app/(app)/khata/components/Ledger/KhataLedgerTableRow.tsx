"use client";

// KhataLedgerTableRow.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Responsibility: Renders one transaction row in the Khata ledger table.
// Shows two layouts: Desktop (4-column grid) and Mobile (3-column grid).
// If the transaction has attached bill items, delegates rendering to
// KhataLedgerTransactionItemsList.
//
// Pure presentational component — no hooks, no state, no context.
// To change how a single transaction row looks, touch ONLY this file.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { KhataLedgerRow } from "@/app/(app)/khata/types/KhataTypes";
import { KhataLedgerTransactionItemsList } from "@/app/(app)/khata/components/Ledger/KhataLedgerTransactionItemsList";

interface KhataLedgerTableRowProps {
  tx: KhataLedgerRow;
}

export function KhataLedgerTableRow({ tx }: KhataLedgerTableRowProps) {
  return (
    <div className="hover:bg-[var(--khata-muted-hover-bg)]">
      {/* ── Desktop Row ──────────────────────────────────────────── */}
      <div className="hidden sm:grid grid-cols-[120px_1fr_130px_130px] items-center px-6 py-4">
        <div className="text-sm text-[var(--khata-muted-text)]">
          {format(new Date(tx.createdAt), "dd MMM yyyy")}
        </div>
        <div className="flex items-start gap-3 pr-4">
          <div
            className={cn(
              "mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0",
              tx.type === "credit"
                ? "bg-[var(--khata-tx-credit-icon-bg)] text-[var(--khata-tx-credit-icon-text)]"
                : "bg-[var(--khata-tx-payment-icon-bg)] text-[var(--khata-tx-payment-icon-text)]"
            )}
          >
            {tx.type === "credit" ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
          </div>
          <p className="text-sm leading-tight text-[var(--khata-foreground)]">{tx.description}</p>
        </div>
        <div className="text-right font-semibold">
          <span
            className={
              tx.type === "credit"
                ? "text-[var(--khata-tx-credit-amount)]"
                : "text-[var(--khata-tx-payment-amount)]"
            }
          >
            {tx.type === "credit" ? "+" : "-"} ₹{tx.amount.toFixed(0)}
          </span>
        </div>
        <div className="text-right font-bold text-base text-[var(--khata-foreground)]">
          ₹{tx.balance.toFixed(0)}
        </div>
      </div>

      {/* ── Mobile Row ───────────────────────────────────────────── */}
      <div className="sm:hidden grid grid-cols-[80px_1fr_90px] items-center px-3 py-3">
        <div className="text-xs text-[var(--khata-muted-text)]">
          {format(new Date(tx.createdAt), "dd MMM")}
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
              tx.type === "credit"
                ? "bg-[var(--khata-tx-credit-icon-bg)] text-[var(--khata-tx-credit-icon-text)]"
                : "bg-[var(--khata-tx-payment-icon-bg)] text-[var(--khata-tx-payment-icon-text)]"
            )}
          >
            {tx.type === "credit" ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          </div>
          <p className="text-xs truncate text-[var(--khata-foreground)]">{tx.description}</p>
        </div>
        <div className="text-right">
          <div
            className={cn(
              "text-xs font-semibold",
              tx.type === "credit"
                ? "text-[var(--khata-tx-credit-amount)]"
                : "text-[var(--khata-tx-payment-amount)]"
            )}
          >
            {tx.type === "credit" ? "+" : "-"}₹{tx.amount.toFixed(0)}
          </div>
          <div className="text-xs font-bold text-[var(--khata-foreground)]">
            ₹{tx.balance.toFixed(0)}
          </div>
        </div>
      </div>

      {/* ── Purchased Items Sub-List (delegated to its own component) ── */}
      {tx.items && tx.items.length > 0 && (
        <KhataLedgerTransactionItemsList items={tx.items} />
      )}
    </div>
  );
}
