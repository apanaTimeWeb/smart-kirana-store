"use client";

// StockEditVariantDialogStockExtrasSection.tsx
// Renders the "Stock & Extras" card and the "Quick Select" card inside the
// edit dialog. Contains: Current Stock, Low Stock Alert, MRP inputs, and
// the Quick Select / Fast Billing toggle.

import React from "react";
import { Box, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { numberValue, formatBaseUnits } from "../../../stock_utils/StockUtils";
import { useStockEditVariantDialog } from "../../../stock_context/StockEditVariantDialogContext";

export function StockEditVariantDialogStockExtrasSection() {
  const { draft, patchDraft } = useStockEditVariantDialog();
  if (!draft) return null;

  const unitStr = draft.unitType.toLowerCase();

  return (
    <>
      {/* Stock & Extras Card */}
      <div className="rounded-xl border bg-[var(--stock-card-bg)] p-4 space-y-4">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Box className="h-4 w-4 text-[var(--stock-muted-text)]" />
          Stock &amp; Extras
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Current Stock */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--stock-muted-text)]">
              Current Stock ({unitStr})
            </label>
            <Input
              type="number"
              value={draft.stockInBaseUnit / draft.baseQuantity}
              onChange={(e) => patchDraft({ stockInBaseUnit: numberValue(e.target.value) * draft.baseQuantity })}
              placeholder="0"
              className="h-9 text-sm"
            />
          </div>

          {/* Low Stock Alert */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--stock-muted-text)]">
              Low Stock Alert
            </label>
            <Input
              type="number"
              value={draft.lowStockThresholdInBaseUnit / draft.baseQuantity}
              onChange={(e) => patchDraft({ lowStockThresholdInBaseUnit: numberValue(e.target.value) * draft.baseQuantity })}
              placeholder="5"
              className="h-9 text-sm"
            />
          </div>

          {/* MRP */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--stock-muted-text)]">
              MRP ₹
            </label>
            <Input
              type="number"
              min={0}
              value={draft.mrp === 0 && !draft.mrp ? "" : draft.mrp}
              onChange={(e) => patchDraft({ mrp: numberValue(e.target.value) })}
              placeholder="0"
              className="h-9 text-sm"
            />
          </div>
        </div>
        <p className="text-[11px] text-[var(--stock-muted-text)] mt-2 border-t pt-2">
          Note: Stock changes automatically update Base Units. Current base inventory:{" "}
          <strong>{formatBaseUnits(draft.stockInBaseUnit, draft.baseUnit)}</strong>.
        </p>
      </div>

      {/* Quick Select Card */}
      <div className="rounded-xl border bg-[var(--stock-card-bg)] p-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <Checkbox
            checked={draft.quickSelect}
            onCheckedChange={(checked) => patchDraft({ quickSelect: Boolean(checked) })}
            className="mt-1"
          />
          <div className="space-y-1">
            <p className="text-sm font-semibold flex items-center gap-1.5 group-hover:text-[var(--stock-primary-color)] transition-colors">
              <Star className="h-3.5 w-3.5 text-[var(--stock-warning-text)]" />
              Fast Billing Me Dikhaye
            </p>
            <p className="text-xs text-[var(--stock-muted-text)]">
              Pin this variant to the Quick-Select panel on the billing screen for 2-click checkout.
            </p>
          </div>
        </label>
      </div>
    </>
  );
}
