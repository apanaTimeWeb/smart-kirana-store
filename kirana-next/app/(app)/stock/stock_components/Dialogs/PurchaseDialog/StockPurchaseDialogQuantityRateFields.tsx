"use client";

// StockPurchaseDialogQuantityRateFields.tsx
// Renders the 2-column Quantity + New Purchase Rate row inside the Purchase Entry dialog.

import React from "react";
import { Input } from "@/components/ui/input";
import { numberValue } from "../../../stock_utils/StockUtils";

interface StockPurchaseDialogQuantityRateFieldsProps {
  quantity: number;
  purchasePrice: string;
  onQuantityChange: (val: number) => void;
  onPurchasePriceChange: (val: string) => void;
}

export function StockPurchaseDialogQuantityRateFields({
  quantity,
  purchasePrice,
  onQuantityChange,
  onPurchasePriceChange,
}: StockPurchaseDialogQuantityRateFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="grid gap-2">
        <label className="text-sm font-medium">Qty</label>
        <Input
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => onQuantityChange(numberValue(e.target.value, 0))}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">New purchase rate</label>
        <Input
          type="number"
          min="0"
          value={purchasePrice}
          onChange={(e) => onPurchasePriceChange(e.target.value)}
          placeholder="optional"
        />
      </div>
    </div>
  );
}
