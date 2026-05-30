"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Trash2 } from "lucide-react";
import { useSuppliers } from "./SuppliersContext";

export function SuppliersListTable() {
  const { suppliers, isLoadingSuppliers, setLedgerId, deleteSupplier } = useSuppliers();

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
          <div
            key={supplier.id}
            className="px-6 py-5 flex items-center justify-between hover:bg-[var(--supplier-muted-bg-60)] cursor-pointer transition-colors"
            onClick={() => setLedgerId(supplier.id)}
          >
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 bg-[var(--supplier-primary-bg-10)] text-[var(--supplier-primary-color)] rounded-full flex items-center justify-center font-bold text-lg">
                {supplier.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{supplier.name}</p>
                <p className="text-sm text-[var(--supplier-muted-text)]">{supplier.phone}</p>
              </div>
            </div>
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
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSupplier(supplier.id, supplier.name);
                }}
              >
                <Trash2 className="h-4 w-4 text-[var(--supplier-muted-text)] hover:text-[var(--supplier-list-delete-hover)] transition-colors" />
              </button>
              <ChevronRight className="text-[var(--supplier-muted-text)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
