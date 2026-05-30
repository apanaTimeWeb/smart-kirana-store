"use client";

import React from "react";
import { Boxes, ShoppingBag, PackagePlus, Warehouse } from "lucide-react";
import { useStock } from "./StockContext";

export function StockStatsGrid() {
  const { stats } = useStock();

  const items = [
    { label: "Variants", value: stats.total, icon: Boxes },
    { label: "Khula Items", value: stats.khula, icon: ShoppingBag },
    { label: "Quick Billing", value: stats.quick, icon: PackagePlus },
    { label: "Low/Out", value: stats.low, icon: Warehouse },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border bg-card p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
            <item.icon className="h-4 w-4 text-[var(--stock-stat-icon)]" />
          </div>
          <p className="mt-2 text-2xl font-extrabold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
