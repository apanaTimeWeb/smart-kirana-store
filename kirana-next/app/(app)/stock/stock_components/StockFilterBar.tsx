"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useStock } from "./StockContext";
import { STOCK_FILTER_OPTIONS } from "./StockConstants";
import { ProductFilter } from "./StockTypes";

export function StockFilterBar() {
  const { filter, handleFilterChange } = useStock();
  
  return (
    <div className="flex flex-wrap gap-2">
      {STOCK_FILTER_OPTIONS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => handleFilterChange(id as ProductFilter)}
          className={cn(
            "rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
            filter === id ? "border-primary bg-[var(--stock-primary-bg)] text-[var(--stock-primary-text)]" : "bg-[var(--stock-card-bg)] text-[var(--stock-muted-text)] hover:bg-[var(--stock-muted-bg-60)]"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
