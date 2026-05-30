"use client";

import React from "react";
import { useStock } from "./StockContext";
import { StockMobileCard } from "./StockMobileCard";
import { StockPagination } from "./StockPagination";

export function StockMobileList() {
  const { paginatedProducts } = useStock();

  return (
    <div className="grid gap-2 md:hidden">
      {paginatedProducts.length === 0 && (
        <div className="rounded-lg border bg-[var(--stock-card-bg)] p-8 text-center text-sm text-[var(--stock-muted-text)]">
          Koi product nahi mila
        </div>
      )}
      {paginatedProducts.map((product) => (
        <StockMobileCard key={product.id} product={product} />
      ))}
      <StockPagination className="px-2 py-3 mt-2" compact={true} />
    </div>
  );
}
