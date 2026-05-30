"use client";

import React from "react";
import { useBilling } from "../../context/BillingContext";

export function BillingProductQuickPicks() {
  const { quickProducts, handleProductTap } = useBilling();
  if (quickProducts.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {quickProducts.map((product) => (
        <button
          key={product.id}
          onClick={() => handleProductTap(product)}
          className="shrink-0 rounded-lg border border-[var(--billing-border)] bg-[var(--billing-card-bg)] px-3 py-2 text-left text-sm font-semibold shadow-sm hover:border-[var(--billing-primary-border)]"
        >
          <span className="text-[var(--billing-foreground-text)]">{product.productName}</span>
          <span className="ml-1 text-[var(--billing-muted-text)]">{product.variantName}</span>
        </button>
      ))}
    </div>
  );
}
