"use client";

// StockCategoryTabBar.tsx
// Horizontal scrollable category filter bar below the search bar.
// Clicking a category filters the stock list to that category only.

import React, { useRef } from "react";
import { CATEGORY_MASTER } from "../../stock_constants/CategoryMaster";
import { useStock } from "../../stock_context/StockContext";
import { cn } from "@/lib/utils";

const ALL_OPTION = { id: "all", icon: "🏪", nameHindi: "Sab", name: "All" };

export function StockCategoryTabBar() {
  const { categoryFilter, setCategoryFilter } = useStock();
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs = [ALL_OPTION, ...CATEGORY_MASTER];

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto pb-1 px-0 scrollbar-none"
      style={{ scrollbarWidth: "none" }}
    >
      {tabs.map((cat) => {
        const isActive = categoryFilter === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95"
            )}
            style={{
              backgroundColor: isActive
                ? "var(--stock-creator-save-btn-bg)"
                : "var(--stock-creator-input-bg)",
              borderColor: isActive
                ? "var(--stock-creator-save-btn-bg)"
                : "var(--stock-creator-input-border)",
              color: isActive
                ? "var(--stock-creator-save-btn-text)"
                : "var(--stock-creator-label-text)",
            }}
          >
            <span className="text-sm leading-none">{cat.icon}</span>
            <span>{cat.nameHindi}</span>
          </button>
        );
      })}
    </div>
  );
}
