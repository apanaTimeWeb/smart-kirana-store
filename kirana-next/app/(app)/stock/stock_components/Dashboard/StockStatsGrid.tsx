"use client";

import React from "react";
import { useStock } from "../../stock_context/StockContext";
import { STOCK_STAT_ITEMS } from "../../stock_constants/StockSharedConstants";

// StockStatsGrid.tsx
// Renders the 4 summary stat cards at the top of the Stock page.
// Stat card definitions (label, icon, data key) live in STOCK_STAT_ITEMS in
// StockConstants.ts — tomorrow replace the constant with an API fetch without
// touching this component.

export function StockStatsGrid() {
  const { stats } = useStock();

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {STOCK_STAT_ITEMS.map((item) => (
        <div key={item.label} className="rounded-lg border bg-[var(--stock-card-bg)] p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-[var(--stock-muted-text)]">{item.label}</p>
            <item.icon className="h-4 w-4 text-[var(--stock-stat-icon)]" />
          </div>
          <p className="mt-2 text-2xl font-extrabold">{stats[item.key]}</p>
        </div>
      ))}
    </div>
  );
}
