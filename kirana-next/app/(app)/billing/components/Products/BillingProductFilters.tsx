"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { type BillingFilter, BILLING_FILTER_OPTIONS } from "../../constants/BillingSharedConstants";
import { useBilling } from "../../context/BillingContext";

export function BillingProductFilters() {
  const { filter, setFilter } = useBilling();
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {BILLING_FILTER_OPTIONS.map(({ id: value, label }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          className={cn(
            "shrink-0 rounded-md border px-3 py-1.5 text-xs font-bold transition-colors",
            filter === value
              ? "border-[var(--billing-primary-border)] bg-[var(--billing-primary-bg)] text-[var(--billing-primary-foreground)]"
              : "border-[var(--billing-border)] bg-[var(--billing-card-bg)] text-[var(--billing-muted-text)] hover:bg-[var(--billing-muted-bg)]"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
