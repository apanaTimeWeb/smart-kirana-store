import React from "react";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

export function StockBadge({ product }: { product: Product }) {
  const out = product.currentStock <= 0;
  const low = !out && product.currentStock <= product.lowStockThreshold;
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold",
        out && "bg-[var(--products-stock-out-bg)] text-[var(--products-stock-out-text)] border-[var(--products-stock-out-border)]",
        low && "bg-[var(--products-badge-lowstock-bg)] text-[var(--products-badge-lowstock-text)] border-[var(--products-badge-lowstock-border)]",
        !out && !low && "bg-[var(--products-stock-ok-bg)] text-[var(--products-stock-ok-text)] border-[var(--products-stock-ok-border)]"
      )}
    >
      {out ? "Out" : low ? "Low" : "OK"}
    </Badge>
  );
}
