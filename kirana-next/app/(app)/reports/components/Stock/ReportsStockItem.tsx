"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ReportsConstants } from "../../constants/ReportsSharedConstants";
import type { ReportsProduct } from "../../types/ReportsTypes";

interface ReportsStockItemProps {
  product: ReportsProduct;
}

export function ReportsStockItem({ product }: ReportsStockItemProps) {
  const isOutOfStock = product.currentStock === 0 || product.stockInBaseUnit <= 0;

  return (
    <div
      className="flex items-center justify-between px-5 py-3 hover:bg-[var(--reports-muted-hover-bg)]"
      data-testid={`row-lowstock-${product.id}`}
    >
      <div>
        <p className="text-sm font-semibold text-[var(--reports-foreground)]">{product.name}</p>
        <p className="text-xs text-[var(--reports-muted-text)]">{product.category}</p>
      </div>
      <Badge
        className={cn(
          "text-[10px] font-medium",
          isOutOfStock
            ? "bg-[var(--reports-badge-out-bg)] text-[var(--reports-badge-out-text)] border-[var(--reports-badge-out-border)] hover:bg-[var(--reports-badge-out-bg)] hover:text-[var(--reports-badge-out-text)]"
            : "bg-[var(--reports-badge-low-bg)] text-[var(--reports-badge-low-text)] border-[var(--reports-badge-low-border)] hover:bg-[var(--reports-badge-low-bg)] hover:text-[var(--reports-badge-low-text)]"
        )}
      >
        {isOutOfStock
          ? ReportsConstants.TEXTS.OUT_OF_STOCK
          : `${product.currentStock} ${product.unit} ${ReportsConstants.TEXTS.LEFT}`}
      </Badge>
    </div>
  );
}
