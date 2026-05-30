"use client";

// StockPurchaseDialogProductSelector.tsx
// Renders the "Product variant" labeled dropdown inside the Purchase Entry dialog.
// Reads the full product list from StockContext and exposes a controlled Select.

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStock } from "./StockContext";

interface StockPurchaseDialogProductSelectorProps {
  variantId: string;
  onVariantChange: (id: string) => void;
}

export function StockPurchaseDialogProductSelector({
  variantId,
  onVariantChange,
}: StockPurchaseDialogProductSelectorProps) {
  const { allProducts } = useStock();

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">Product variant</label>
      <Select value={variantId} onValueChange={onVariantChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Product" />
        </SelectTrigger>
        <SelectContent>
          {allProducts.map((product) => (
            <SelectItem key={product.id} value={product.id.toString()}>
              {product.productName} - {product.variantName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
