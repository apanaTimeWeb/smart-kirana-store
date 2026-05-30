"use client";

import React from "react";
import { useSuppliers } from "../../context/SuppliersContext";

export function SuppliersLedgerHeader() {
  const { ledgerDetail } = useSuppliers();

  if (!ledgerDetail) return null;

  return (
    <div className="rounded-xl border bg-gradient-to-br from-[var(--supplier-header-bg-from)] to-[var(--supplier-header-bg-to)] border-[var(--supplier-header-border)] p-5 mb-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[var(--supplier-header-avatar-bg)] text-[var(--supplier-header-avatar-text)] flex items-center justify-center text-2xl font-bold">
            {ledgerDetail.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-xl">{ledgerDetail.name}</p>
            <p className="text-[var(--supplier-muted-text)]">{ledgerDetail.phone}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-[var(--supplier-muted-text)]">Total Due</p>
          <p className="text-4xl font-bold text-[var(--supplier-header-due-amount)]">
            ₹{ledgerDetail.totalDue.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
