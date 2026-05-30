"use client";

// KhataLedgerTable.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Responsibility: Renders the transactions table — desktop 4-column header
// and mobile 3-column header — and maps each KhataLedgerRow to a
// KhataLedgerTableRow component. Also handles the empty-state (no transactions).
//
// Pure presentational component — no hooks, no state, no context.
// To change the table layout or column structure, touch ONLY this file.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { BookOpen } from "lucide-react";
import { KhataLedgerRow as LedgerRowType } from "@/app/(app)/khata/types/KhataTypes";
import { KhataConstants } from "@/app/(app)/khata/constants/KhataConstants";
import { KhataLedgerTableRow } from "@/app/(app)/khata/components/Ledger/KhataLedgerTableRow";

interface KhataLedgerTableProps {
  rows: LedgerRowType[];
}

export function KhataLedgerTable({ rows }: KhataLedgerTableProps) {
  if (rows.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--khata-muted-text)]">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>{KhataConstants.LABELS.NO_TRANSACTIONS}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--khata-border)]">
      {/* ── Desktop Header ─────────────────────────────────────────── */}
      <div className="hidden sm:grid grid-cols-[120px_1fr_130px_130px] bg-[var(--khata-muted-bg)] sticky top-0 text-xs font-semibold text-[var(--khata-muted-text)] border-b border-[var(--khata-border)]">
        <div className="px-6 py-3.5">{KhataConstants.LABELS.DATE}</div>
        <div className="px-6 py-3.5">{KhataConstants.LABELS.DESCRIPTION}</div>
        <div className="px-6 py-3.5 text-right">{KhataConstants.LABELS.AMOUNT}</div>
        <div className="px-6 py-3.5 text-right">{KhataConstants.LABELS.BALANCE}</div>
      </div>

      {/* ── Mobile Header ──────────────────────────────────────────── */}
      <div className="sm:hidden grid grid-cols-[80px_1fr_90px] bg-[var(--khata-muted-bg)] sticky top-0 text-xs font-semibold text-[var(--khata-muted-text)] border-b border-[var(--khata-border)]">
        <div className="px-3 py-3">{KhataConstants.LABELS.DATE}</div>
        <div className="px-3 py-3">{KhataConstants.LABELS.DETAILS}</div>
        <div className="px-3 py-3 text-right">{KhataConstants.LABELS.AMT_BAL_MOBILE}</div>
      </div>

      {rows.map((tx) => (
        <KhataLedgerTableRow key={tx.id} tx={tx} />
      ))}
    </div>
  );
}
