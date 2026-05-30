"use client";

/**
 * SuppliersListTableRow.tsx
 *
 * Renders a single row in the Suppliers list table.
 * Displays: supplier avatar (initial), name, phone, due amount (or "Clear"), delete button, and chevron.
 *
 * RESPONSIBILITIES (exactly one):
 * → Render the UI for ONE supplier entry in the list.
 *
 * PARENT: SuppliersListTable.tsx
 * STATE: Reads setLedgerId and deleteSupplier from SuppliersContext (via props, not context directly).
 */

import React from "react";
import { ChevronRight, Trash2 } from "lucide-react";

interface SuppliersListTableRowProps {
  supplier: {
    id: number;
    name: string;
    phone: string;
    totalDue: number;
  };
  onRowClick: (id: number) => void;
  onDelete: (id: number, name: string) => void;
}

export function SuppliersListTableRow({
  supplier,
  onRowClick,
  onDelete,
}: SuppliersListTableRowProps) {
  return (
    <div
      className="px-6 py-5 flex items-center justify-between hover:bg-[var(--supplier-muted-bg-60)] cursor-pointer transition-colors"
      onClick={() => onRowClick(supplier.id)}
    >
      {/* Left: Avatar + Name + Phone */}
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 bg-[var(--supplier-primary-bg-10)] text-[var(--supplier-primary-color)] rounded-full flex items-center justify-center font-bold text-lg">
          {supplier.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold">{supplier.name}</p>
          <p className="text-sm text-[var(--supplier-muted-text)]">
            {supplier.phone}
          </p>
        </div>
      </div>

      {/* Right: Due Amount + Delete + Chevron */}
      <div className="flex items-center gap-6">
        <div className="text-right">
          {supplier.totalDue > 0 ? (
            <p className="text-2xl font-bold text-[var(--supplier-list-due-text)]">
              ₹{supplier.totalDue}
            </p>
          ) : (
            <p className="text-[var(--supplier-list-clear-text)]">Clear</p>
          )}
        </div>
        <button
          aria-label={`Delete ${supplier.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(supplier.id, supplier.name);
          }}
        >
          <Trash2 className="h-4 w-4 text-[var(--supplier-muted-text)] hover:text-[var(--supplier-list-delete-hover)] transition-colors" />
        </button>
        <ChevronRight className="text-[var(--supplier-muted-text)]" />
      </div>
    </div>
  );
}
