"use client";

// StockEditVariantDialogNameExpiryRow.tsx
// Renders the 2-column top row of the edit dialog:
//   - Size Name input (required field, autofocused)
//   - Expiry Date input (optional)

import React from "react";
import { Package, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStockEditVariantDialog } from "./StockEditVariantDialogContext";

export function StockEditVariantDialogNameExpiryRow() {
  const { draft, patchDraft } = useStockEditVariantDialog();
  if (!draft) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Size Name */}
      <div className="space-y-2">
        <label className="text-sm font-semibold flex items-center gap-1.5">
          <Package className="h-3.5 w-3.5 text-[var(--stock-muted-text)]" />
          Size Name
          <span className="text-[var(--stock-destructive-text)]">*</span>
        </label>
        <Input
          autoFocus
          value={draft.variantName}
          onChange={(e) => patchDraft({ variantName: e.target.value })}
          placeholder="e.g. 500g Pouch, 1 Litre Bottle..."
          className="h-12 text-base font-medium"
        />
        <p className="text-[11px] text-[var(--stock-muted-text)]">Shown in billing and tables</p>
      </div>

      {/* Expiry Date */}
      <div className="space-y-2">
        <label className="text-sm font-semibold flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-[var(--stock-muted-text)]" />
          Expiry Date
        </label>
        <Input
          type="date"
          value={draft.expiryDate ?? ""}
          onChange={(e) => patchDraft({ expiryDate: e.target.value })}
          className="h-12 text-base"
        />
        <p className="text-[11px] text-[var(--stock-muted-text)]">Leave empty if not applicable</p>
      </div>
    </div>
  );
}
