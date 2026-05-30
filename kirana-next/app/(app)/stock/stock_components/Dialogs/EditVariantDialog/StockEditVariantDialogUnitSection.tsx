"use client";

// StockEditVariantDialogUnitSection.tsx
// Renders the unit selector + auto-wired info pills inside the edit dialog.
// Identical behaviour to StockProductCreatorUnitField but reads from
// StockEditVariantDialogContext instead.

import React from "react";
import { Scale, CircleCheck } from "lucide-react";
import { StockUnitSelector } from "../../Shared/StockUnitSelector";
import { formatBaseUnits } from "../../../stock_utils/StockUtils";
import { MODE_LABEL } from "../../../stock_constants/StockSharedConstants";
import { useStockEditVariantDialog } from "../../../stock_context/StockEditVariantDialogContext";

export function StockEditVariantDialogUnitSection() {
  const { draft, cfg, handleUnitChange } = useStockEditVariantDialog();
  if (!draft) return null;

  const unitStr = draft.unitType.toLowerCase();

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold flex items-center gap-1.5">
        <Scale className="h-3.5 w-3.5 text-[var(--stock-muted-text)]" />
        How is it measured / sold?
      </label>
      <StockUnitSelector
        value={draft.unitType}
        onChange={handleUnitChange}
        triggerClassName="h-12 text-sm font-medium px-3"
      />

      {/* Auto-wired info pills */}
      {cfg && (
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--stock-preview-neutral-bg)] border border-[var(--stock-preview-neutral-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--stock-preview-neutral-text)]">
            <CircleCheck className="h-3 w-3" />
            Base: {draft.baseUnit}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--stock-preview-neutral-bg)] border border-[var(--stock-preview-neutral-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--stock-preview-neutral-text)]">
            <CircleCheck className="h-3 w-3" />
            1 {unitStr} = {formatBaseUnits(draft.baseQuantity, draft.baseUnit)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--stock-preview-neutral-bg)] border border-[var(--stock-preview-neutral-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--stock-preview-neutral-text)]">
            <CircleCheck className="h-3 w-3" />
            Mode: {MODE_LABEL[draft.sellingMode]}
          </span>
        </div>
      )}
    </div>
  );
}
