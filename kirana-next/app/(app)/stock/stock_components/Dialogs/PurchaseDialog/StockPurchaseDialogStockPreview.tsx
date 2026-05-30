"use client";

// StockPurchaseDialogStockPreview.tsx
// Renders the stock preview box inside the Purchase Entry dialog.
// Shows: quantity × variant name, base units to be added, and current stock.
// Only rendered when a product variant is selected.

import React from "react";
import { Product } from "@/lib/api";
import { formatBaseUnits } from "../../../stock_utils/StockUtils";

interface StockPurchaseDialogStockPreviewProps {
  selectedProduct: Product;
  quantity: number;
}

export function StockPurchaseDialogStockPreview({
  selectedProduct,
  quantity,
}: StockPurchaseDialogStockPreviewProps) {
  const addedBase = selectedProduct.baseQuantity * quantity;

  return (
    <div className="rounded-lg border bg-[var(--stock-purchase-preview-bg)] p-4">
      <p className="text-sm font-semibold">
        {quantity} x {selectedProduct.variantName}
      </p>
      <p className="mt-1 text-2xl font-extrabold text-[var(--stock-purchase-preview-text)]">
        + {formatBaseUnits(addedBase, selectedProduct.baseUnit)}
      </p>
      <p className="text-xs text-[var(--stock-muted-text)]">
        Stock base me add hoga. Current: {selectedProduct.currentStock} {selectedProduct.unit}
      </p>
    </div>
  );
}
