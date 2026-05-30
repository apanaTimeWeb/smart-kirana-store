"use client";

// StockProductCreatorPriceFields.tsx
// Renders the 2-column Buy Price + Sell Price grid inside the creator dialog.

import React from "react";
import { IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { numberValue } from "../../../stock_utils/StockUtils";
import { useStockProductCreator } from "../../../stock_context/StockProductCreatorContext";

export function StockProductCreatorPriceFields() {
  const { buyPrice, setBuyPrice, sellPrice, setSellPrice } = useStockProductCreator();

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Buy Price */}
      <div className="space-y-2">
        <label className="text-sm font-semibold flex items-center gap-1.5">
          <IndianRupee className="h-3.5 w-3.5 text-[var(--stock-muted-text)]" />
          Buy Price (₹)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--stock-muted-text)] text-sm font-medium">₹</span>
          <Input
            type="number"
            min={0}
            value={buyPrice === "" ? "" : buyPrice}
            onChange={(e) => setBuyPrice(e.target.value === "" ? "" : numberValue(e.target.value))}
            placeholder="0"
            className="h-12 pl-7 text-base font-semibold text-[var(--stock-purchase-rate)]"
          />
        </div>
        <p className="text-[11px] text-[var(--stock-muted-text)]">Cost you pay to supplier</p>
      </div>

      {/* Sell Price */}
      <div className="space-y-2">
        <label className="text-sm font-semibold flex items-center gap-1.5">
          <IndianRupee className="h-3.5 w-3.5 text-[var(--stock-muted-text)]" />
          Sell Price (₹)
          <span className="text-[var(--stock-destructive-text)]">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--stock-muted-text)] text-sm font-medium">₹</span>
          <Input
            type="number"
            min={0}
            value={sellPrice === "" ? "" : sellPrice}
            onChange={(e) => setSellPrice(e.target.value === "" ? "" : numberValue(e.target.value))}
            placeholder="0"
            className="h-12 pl-7 text-base font-semibold text-[var(--stock-selling-price)]"
          />
        </div>
        <p className="text-[11px] text-[var(--stock-muted-text)]">Price customer pays</p>
      </div>
    </div>
  );
}
