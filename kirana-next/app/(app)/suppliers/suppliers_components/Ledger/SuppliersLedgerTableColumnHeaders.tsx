"use client";

/**
 * SuppliersLedgerTableColumnHeaders.tsx
 *
 * Renders the sticky column header row for the Suppliers ledger transaction table.
 * Handles both the desktop (4-column) and mobile (3-column) header layouts.
 *
 * RESPONSIBILITIES (exactly one):
 * → Render the static column label headers above the ledger transaction rows.
 *
 * PARENT: SuppliersLedgerDialog.tsx
 * STATE: Purely static — no props, no context, no state.
 */

import React from "react";

export function SuppliersLedgerTableColumnHeaders() {
  return (
    <>
      {/* ── Desktop Header (sm and above) ── */}
      <div className="hidden sm:grid grid-cols-[120px_1fr_130px_130px] bg-[var(--supplier-muted-bg)] sticky top-0 text-xs font-semibold text-[var(--supplier-muted-text)] border-b border-[var(--supplier-border)]">
        <div className="px-6 py-3.5">Date</div>
        <div className="px-6 py-3.5">Description</div>
        <div className="px-6 py-3.5 text-right">Amount</div>
        <div className="px-6 py-3.5 text-right">Balance</div>
      </div>

      {/* ── Mobile Header (below sm) ── */}
      <div className="sm:hidden grid grid-cols-[80px_1fr_90px] bg-[var(--supplier-muted-bg)] sticky top-0 text-xs font-semibold text-[var(--supplier-muted-text)] border-b border-[var(--supplier-border)]">
        <div className="px-3 py-3">Date</div>
        <div className="px-3 py-3">Details</div>
        <div className="px-3 py-3 text-right">Amt / Bal</div>
      </div>
    </>
  );
}
