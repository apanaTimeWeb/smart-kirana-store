"use client";

/**
 * SuppliersLedgerTable.tsx
 *
 * Renders the scrollable list of all transactions for the active supplier ledger.
 * Computes running balances via useMemo and shows an empty state when no transactions exist.
 *
 * RESPONSIBILITIES (exactly one):
 * → Manage the transaction list container, compute running balances, handle empty state.
 *
 * ROW RENDERING: Delegated to SuppliersLedgerTableRow.tsx (one file, one row).
 * COLUMN HEADERS: Rendered by SuppliersLedgerTableColumnHeaders.tsx (in parent dialog).
 */

import React, { useMemo } from "react";
import { BookOpen } from "lucide-react";
import { type LedgerRow } from "../../suppliers_types/SuppliersTypes";
import { useSuppliers } from "../../suppliers_context/SuppliersContext";
import { SuppliersLedgerTableRow } from "./SuppliersLedgerTableRow";

export function SuppliersLedgerTable() {
  const { ledgerDetail } = useSuppliers();

  // Compute the running balance for each transaction
  const rows = useMemo((): LedgerRow[] => {
    if (!ledgerDetail?.transactions) return [];
    let balance = 0;
    return ledgerDetail.transactions.map((tx: any) => {
      balance += tx.type === "credit" ? tx.amount : -tx.amount;
      return { ...tx, balance };
    });
  }, [ledgerDetail?.transactions]);

  if (rows.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--supplier-muted-text)]">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--supplier-border)]">
      {rows.map((tx) => (
        <SuppliersLedgerTableRow key={tx.id} tx={tx} />
      ))}
    </div>
  );
}
