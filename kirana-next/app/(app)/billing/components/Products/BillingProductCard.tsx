"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/api";
import { cn } from "@/lib/utils";
import { XCircle } from "lucide-react";
import { MODE_LABEL } from "../../constants/BillingSharedConstants";
import { rateUnit } from "../../utils/BillingSharedUtils";

interface BillingProductCardProps {
  product: Product;
  inCartBaseQty: number;
  onTap: (product: Product) => void;
  onRemoveTap?: (product: Product) => void;
}

export function BillingProductCard({ product, inCartBaseQty, onTap, onRemoveTap }: BillingProductCardProps) {
  const outOfStock =
    product.stockInBaseUnit <= 0 || inCartBaseQty >= product.stockInBaseUnit;
  const lowStock = product.currentStock <= product.lowStockThreshold;
  const inCart = inCartBaseQty > 0;

  return (
    <Card
      data-testid={`card-product-${product.id}`}
      onClick={() => !outOfStock && onTap(product)}
      className={cn(
        "cursor-pointer select-none transition-all active:scale-[0.98] relative overflow-hidden bg-[var(--billing-card-bg)] border-[var(--billing-border)]",
        outOfStock ? "cursor-not-allowed opacity-50" : "hover:border-[var(--billing-primary-border)] hover:shadow-sm",
        inCart && "ring-2 ring-[var(--billing-product-in-cart-border)] border-transparent bg-[var(--billing-product-in-cart-bg)]"
      )}
    >
      {inCart && (
        <div 
          className="absolute top-2 right-2 flex items-center justify-center bg-[var(--billing-background-bg)] rounded-full p-0.5 cursor-pointer hover:bg-[var(--billing-destructive-bg)]/10 z-10 shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            if (onRemoveTap) onRemoveTap(product);
          }}
        >
          <XCircle className="h-5 w-5 text-[var(--billing-destructive-text)]" />
        </div>
      )}
      <CardContent className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2 pr-5">
          <div className="min-w-0">
            <p className="line-clamp-1 text-sm font-bold text-[var(--billing-foreground-text)]">{product.productName}</p>
            <p className="line-clamp-1 text-xs text-[var(--billing-muted-text)]">{product.variantName}</p>
          </div>
          {product.quickSelect && (
            <Badge className="bg-[var(--billing-quick-bg)] text-[var(--billing-quick-text)] shrink-0">
              Top
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-extrabold text-[var(--billing-product-price)]">
            Rs {product.sellingPrice}
          </span>
          <Badge variant="outline" className="text-[10px] text-[var(--billing-foreground-text)] border-[var(--billing-border)]">
            {MODE_LABEL[product.sellingMode]}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[var(--billing-muted-text)]">/{rateUnit(product)}</span>
          <span
            className={cn(
              outOfStock
                ? "text-[var(--billing-stock-out)]"
                : lowStock
                ? "text-[var(--billing-stock-low)]"
                : "text-[var(--billing-stock-ok)]"
            )}
          >
            {outOfStock ? "Khatam" : `${product.currentStock} ${product.unit}`}
          </span>
        </div>

        {product.sellingMode === "khula" && (
          <div className="rounded-md bg-[var(--billing-khula-chip-bg)] px-2 py-1 text-center text-[11px] font-semibold text-[var(--billing-khula-chip-text)]">
            Preset quantity
          </div>
        )}
      </CardContent>
    </Card>
  );
}
