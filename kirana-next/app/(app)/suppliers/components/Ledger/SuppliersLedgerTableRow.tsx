"use client";

/**
 * SuppliersLedgerTableRow.tsx
 *
 * Renders a single transaction row in the Suppliers ledger table.
 * Handles both desktop (4-column grid) and mobile (3-column compact grid) layouts.
 *
 * RESPONSIBILITIES (exactly one):
 * → Render the UI for ONE transaction entry in the ledger.
 *
 * PARENT: SuppliersLedgerTable.tsx
 * STATE: Pure presentational — receives all data via props, uses NO context.
 */

import React from "react";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type LedgerRow } from "../../types/SuppliersTypes";

interface SuppliersLedgerTableRowProps {
  tx: LedgerRow;
}

export function SuppliersLedgerTableRow({ tx }: SuppliersLedgerTableRowProps) {
  const isCredit = tx.type === "credit";

  const iconBgClass = isCredit
    ? "bg-[var(--supplier-tx-credit-icon-bg)] text-[var(--supplier-tx-credit-icon-text)]"
    : "bg-[var(--supplier-tx-payment-icon-bg)] text-[var(--supplier-tx-payment-icon-text)]";

  const amountColorClass = isCredit
    ? "text-[var(--supplier-tx-credit-amount)]"
    : "text-[var(--supplier-tx-payment-amount)]";

  const amountPrefix = isCredit ? "+" : "-";

  return (
    <div className="hover:bg-[var(--supplier-muted-bg-30)] transition-colors">
      {/* ── Desktop Row (sm and above) ── */}
      <div className="hidden sm:grid grid-cols-[120px_1fr_130px_130px] items-center px-6 py-4">
        <div className="text-sm text-[var(--supplier-muted-text)]">
          {format(new Date(tx.createdAt), "dd MMM yyyy")}
        </div>
        <div className="flex items-start gap-3 pr-4">
          <div
            className={cn(
              "mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0",
              iconBgClass
            )}
          >
            {isCredit ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
          </div>
          <p className="text-sm leading-tight">{tx.description}</p>
        </div>
        <div className="text-right font-semibold">
          <span className={amountColorClass}>
            {amountPrefix} ₹{tx.amount.toFixed(0)}
          </span>
        </div>
        <div className="text-right font-bold text-base">₹{tx.balance.toFixed(0)}</div>
      </div>

      {/* ── Mobile Row (below sm) ── */}
      <div className="sm:hidden grid grid-cols-[80px_1fr_90px] items-center px-3 py-3">
        <div className="text-xs text-[var(--supplier-muted-text)]">
          {format(new Date(tx.createdAt), "dd MMM")}
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
              iconBgClass
            )}
          >
            {isCredit ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          </div>
          <p className="text-xs truncate">{tx.description}</p>
        </div>
        <div className="text-right">
          <div className={cn("text-xs font-semibold", amountColorClass)}>
            {amountPrefix}₹{tx.amount.toFixed(0)}
          </div>
          <div className="text-xs font-bold">₹{tx.balance.toFixed(0)}</div>
        </div>
      </div>
    </div>
  );
}
