"use client";

// StockEditVariantDialogPriceMarginSection.tsx
// Renders the 2-column Buy Price + Sell Price grid, followed by the
// inline margin / loss preview box — all within the edit dialog.

import React from "react";
import { IndianRupee, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { numberValue } from "./StockUtils";
import { useStockEditVariantDialog } from "./StockEditVariantDialogContext";

export function StockEditVariantDialogPriceMarginSection() {
  const { draft, patchDraft, buyPrice, sellPrice, isLoss, margin } = useStockEditVariantDialog();
  if (!draft) return null;

  return (
    <>
      {/* Buy + Sell Price Grid */}
      <div className="grid grid-cols-2 gap-4">
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
              value={draft.purchasePrice === 0 && !draft.purchasePrice ? "" : draft.purchasePrice}
              onChange={(e) => patchDraft({ purchasePrice: numberValue(e.target.value) })}
              placeholder="0"
              className="h-12 pl-7 text-base font-semibold text-[var(--stock-purchase-rate)]"
            />
          </div>
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
              value={draft.sellingPrice === 0 && !draft.sellingPrice ? "" : draft.sellingPrice}
              onChange={(e) => patchDraft({ sellingPrice: numberValue(e.target.value) })}
              placeholder="0"
              className="h-12 pl-7 text-base font-semibold text-[var(--stock-selling-price)]"
            />
          </div>
        </div>
      </div>

      {/* Live Margin / Loss Preview */}
      {sellPrice > 0 && (
        <div className={cn(
          "flex flex-col gap-2 rounded-lg px-4 py-3 border transition-colors",
          isLoss
            ? "bg-[var(--stock-preview-loss-bg)] border-[var(--stock-preview-loss-border)]"
            : "bg-[var(--stock-preview-ok-bg)] border-[var(--stock-preview-ok-border)]"
        )}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--stock-muted-text)] font-medium">
              Buy ₹{buyPrice} → Sell ₹{sellPrice}
            </span>
            {margin !== null && (
              <span className={cn(
                "text-xs font-bold",
                isLoss ? "text-[var(--stock-preview-loss-text)]" : "text-[var(--stock-preview-ok-text)]"
              )}>
                {isLoss ? "⚠️ Loss " : "↑ "}{margin}% margin
              </span>
            )}
          </div>
          {isLoss && (
            <p className="text-xs text-[var(--stock-preview-loss-text)] flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              Sell price is less than buy price.
            </p>
          )}
        </div>
      )}
    </>
  );
}
