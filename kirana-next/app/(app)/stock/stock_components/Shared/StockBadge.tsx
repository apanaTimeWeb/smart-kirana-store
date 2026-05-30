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
        out && "bg-[var(--stock-stock-out-bg)] text-[var(--stock-stock-out-text)] border-[var(--stock-stock-out-border)]",
        low && "bg-[var(--stock-badge-lowstock-bg)] text-[var(--stock-badge-lowstock-text)] border-[var(--stock-badge-lowstock-border)]",
        !out && !low && "bg-[var(--stock-stock-ok-bg)] text-[var(--stock-stock-ok-text)] border-[var(--stock-stock-ok-border)]"
      )}
    >
      {out ? "Out" : low ? "Low" : "OK"}
    </Badge>
  );
}
