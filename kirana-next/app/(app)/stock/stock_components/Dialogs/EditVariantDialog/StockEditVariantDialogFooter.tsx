"use client";

// StockEditVariantDialogFooter.tsx
// Renders the fixed footer of the edit dialog:
//   - Validation errors banner (always shown if errors exist)
//   - Cancel and Save Changes buttons

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStockEditVariantDialog } from "../../../stock_context/StockEditVariantDialogContext";

export function StockEditVariantDialogFooter() {
  const { errors, isValid, isUpdating, handleSave, closeDialog } = useStockEditVariantDialog();

  return (
    <div className="border-t bg-[var(--stock-card-bg)] px-5 py-4 shrink-0">
      {/* Validation errors banner */}
      {!isValid && (
        <div className="mb-3 flex items-start gap-2 rounded-lg bg-[var(--stock-stock-out-bg)] border border-[var(--stock-stock-out-border)] px-3 py-2">
          <AlertTriangle className="h-4 w-4 text-[var(--stock-stock-out-text)] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            {errors.map((e, i) => (
              <p key={i} className="text-xs text-[var(--stock-stock-out-text)]">{e}</p>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="ghost" onClick={closeDialog} className="w-24">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isUpdating || !isValid}
          className="w-32 font-bold"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
