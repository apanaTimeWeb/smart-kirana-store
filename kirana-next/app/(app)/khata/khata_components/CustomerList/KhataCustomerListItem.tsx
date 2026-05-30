"use client";

// KhataCustomerListItem.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Responsibility: Renders a single row in the customer list — avatar, name,
// phone, due amount (or "Clear"), delete button, and chevron arrow.
//
// Clicking the row opens the Ledger Dialog via KhataContext.
// The delete action is delegated UP to KhataCustomerListContainer which owns
// the mutation logic, keeping this component purely presentational.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Trash2, ChevronRight } from "lucide-react";
import { type Customer } from "@/app/(app)/khata/khata_types/KhataTypes";
import { useKhata } from "@/app/(app)/khata/khata_context/KhataContext";
import { KhataConstants } from "@/app/(app)/khata/khata_constants/KhataConstants";

interface KhataCustomerListItemProps {
  /** The full Customer object from the API / KhataTypes. */
  customer: Customer;
  /** Delete handler owned by the parent container (KhataCustomerListContainer). */
  onDelete: (id: number, name: string) => void;
}

export function KhataCustomerListItem({ customer, onDelete }: KhataCustomerListItemProps) {
  const { setSelectedLedgerId } = useKhata();

  return (
    <div
      className="px-6 py-5 flex items-center justify-between hover:bg-[var(--khata-muted-hover-bg)] cursor-pointer"
      onClick={() => setSelectedLedgerId(customer.id)}
    >
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 bg-[var(--khata-customer-avatar-bg)] text-[var(--khata-customer-avatar-text)] rounded-full flex items-center justify-center font-bold text-lg">
          {customer.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-[var(--khata-foreground)]">{customer.name}</p>
          <p className="text-sm text-[var(--khata-muted-text)]">{customer.phone}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          {customer.totalDue > 0 ? (
            <p className="text-2xl font-bold text-[var(--khata-list-due-text)]">
              ₹{customer.totalDue}
            </p>
          ) : (
            <p className="text-[var(--khata-list-clear-text)]">{KhataConstants.LABELS.CLEAR_DUE}</p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(customer.id, customer.name);
          }}
        >
          <Trash2 className="h-4 w-4 text-[var(--khata-muted-text)] hover:text-[var(--khata-list-delete-hover)]" />
        </button>
        <ChevronRight className="text-[var(--khata-muted-text)]" />
      </div>
    </div>
  );
}
