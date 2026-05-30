"use client";

// StockProductCreatorExtraVariantsSection.tsx
// Renders the "Extra Variants / Packs" section inside the creator dialog.
// Displays the section header with an "Add Pack" button and maps
// StockExtraVariantRow for each additional pack the user has added.

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockExtraVariantRow } from "./StockExtraVariantRow";
import { useStockProductCreator } from "./StockProductCreatorContext";

export function StockProductCreatorExtraVariantsSection() {
  const { extraVariants, addExtraVariant, updateExtraVariant, removeExtraVariant } = useStockProductCreator();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4 text-[var(--stock-muted-text)]" />
          Extra Variants / Packs
          <span className="text-[11px] font-normal text-[var(--stock-muted-text)]">
            (Same product, different sizes)
          </span>
        </h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs border-dashed border-2"
          onClick={addExtraVariant}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Pack
        </Button>
      </div>

      {extraVariants.length === 0 && (
        <p className="text-xs text-[var(--stock-muted-text)] bg-[var(--stock-muted-bg-30)] rounded-lg px-4 py-3 border border-dashed">
          e.g. Add &quot;500g Packet&quot; and &quot;1kg Packet&quot; as extra packs for the same product.
          They will share stock if they use the same base unit.
        </p>
      )}

      {extraVariants.map((v, i) => (
        <StockExtraVariantRow
          key={v.rowId}
          variant={v}
          index={i}
          onUpdate={(patch) => updateExtraVariant(v.rowId, patch)}
          onRemove={() => removeExtraVariant(v.rowId)}
        />
      ))}
    </div>
  );
}
