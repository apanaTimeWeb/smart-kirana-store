"use client";

/**
 * SuppliersListTable.tsx
 *
 * Renders the full list of suppliers in a card container.
 * Shows a skeleton while loading, an empty state if no suppliers exist,
 * and a list of SuppliersListTableRow components when data is available.
 *
 * RESPONSIBILITIES (exactly one):
 * → Manage the list container, loading state, and empty state for the supplier list.
 *
 * ROW RENDERING: Delegated to SuppliersListTableRow.tsx (one file, one row).
 */

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuppliers } from "./SuppliersContext";
import { SuppliersListTableRow } from "./SuppliersListTableRow";

export function SuppliersListTable() {
  const { suppliers, isLoadingSuppliers, setLedgerId, deleteSupplier } =
    useSuppliers();

  if (isLoadingSuppliers) {
    return (
      <div className="rounded-2xl border border-[var(--supplier-border)] bg-[var(--supplier-card-bg)] overflow-hidden p-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--supplier-border)] bg-[var(--supplier-card-bg)] overflow-hidden">
      <div className="divide-y divide-[var(--supplier-border)]">
        {suppliers.map((supplier: any) => (
          <SuppliersListTableRow
            key={supplier.id}
            supplier={supplier}
            onRowClick={setLedgerId}
            onDelete={deleteSupplier}
          />
        ))}
      </div>
    </div>
  );
}
