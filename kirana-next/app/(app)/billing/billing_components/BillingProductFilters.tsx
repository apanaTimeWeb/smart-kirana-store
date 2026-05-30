"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { BillingFilter } from "./BillingTypes";

const FILTER_OPTIONS = [
  ["all", "All"],
  ["khula", "Khula"],
  ["fixed", "Fixed"],
  ["variant", "Variant"],
  ["wholesale", "Bora"],
  ["low", "Low"],
  ["in", "In Stock"],
] as const;

interface BillingProductFiltersProps {
  filter: BillingFilter;
  setFilter: (value: BillingFilter) => void;
}

export function BillingProductFilters({ filter, setFilter }: BillingProductFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {FILTER_OPTIONS.map(([value, label]) => (
        <button
          key={value}
          onClick={() => setFilter(value as BillingFilter)}
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
