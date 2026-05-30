"use client";

// StockProductCreatorUnitField.tsx
// Renders the Unit selector + the "auto-wired" pills row showing Base, Conversion,
// and Selling Mode — the most critical field that auto-wires everything else.

import React from "react";
import { Scale, CircleCheck } from "lucide-react";
import { StockUnitSelector } from "../../Shared/StockUnitSelector";
import { formatBaseUnits } from "../../../stock_utils/StockUtils";
import { MODE_LABEL } from "../../../stock_constants/StockSharedConstants";
import { useStockProductCreator } from "../../../stock_context/StockProductCreatorContext";

export function StockProductCreatorUnitField() {
  const { unitType, handleUnitChange, cfg } = useStockProductCreator();

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold flex items-center gap-1.5">
        <Scale className="h-3.5 w-3.5 text-[var(--stock-muted-text)]" />
        How is it measured / sold?
        <span className="text-[var(--stock-destructive-text)]">*</span>
      </label>
      <p className="text-xs text-[var(--stock-muted-text)]">
        ⚡ Select unit → selling mode, base unit, and conversions are auto-set. No manual math.
      </p>

      <StockUnitSelector
        value={unitType}
        onChange={handleUnitChange}
        triggerClassName="h-12 text-sm font-medium px-3"
      />

      {/* Auto-wired info pills */}
      {cfg && (
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--stock-preview-neutral-bg)] border border-[var(--stock-preview-neutral-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--stock-preview-neutral-text)]">
            <CircleCheck className="h-3 w-3" />
            Base: {cfg.baseUnit}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--stock-preview-neutral-bg)] border border-[var(--stock-preview-neutral-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--stock-preview-neutral-text)]">
            <CircleCheck className="h-3 w-3" />
            1 {unitType.toLowerCase()} = {formatBaseUnits(cfg.baseQuantity, cfg.baseUnit)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--stock-preview-neutral-bg)] border border-[var(--stock-preview-neutral-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--stock-preview-neutral-text)]">
            <CircleCheck className="h-3 w-3" />
            Mode: {MODE_LABEL[cfg.sellingMode]}
          </span>
        </div>
      )}
    </div>
  );
}
