"use client";

// StockProductCreatorFooter.tsx
// Renders the fixed footer of the creator dialog:
//   - Validation errors banner (shown only when errors exist and user has started typing)
//   - Variant count summary
//   - Cancel and Save Product buttons

import React from "react";
import { AlertTriangle, CircleCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStockProductCreator } from "../../../stock_context/StockProductCreatorContext";

export function StockProductCreatorFooter() {
  const {
    name, sellPrice,
    errors, isValid,
    extraVariants,
    isCreating,
    handleSubmit,
    handleOpenChange,
  } = useStockProductCreator();

  const showErrors = !isValid && (name.trim() !== "" || sellPrice !== "");

  return (
    <div className="border-t bg-[var(--stock-card-bg)] px-5 py-4 shrink-0">
      {/* Validation errors banner */}
      {showErrors && (
        <div className="mb-3 flex items-start gap-2 rounded-lg bg-[var(--stock-stock-out-bg)] border border-[var(--stock-stock-out-border)] px-3 py-2">
          <AlertTriangle className="h-4 w-4 text-[var(--stock-stock-out-text)] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            {errors.map((e, i) => (
              <p key={i} className="text-xs text-[var(--stock-stock-out-text)]">{e}</p>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        {/* Variant count summary */}
        <div className="text-xs text-[var(--stock-muted-text)] hidden md:block">
          {extraVariants.length > 0
            ? `1 primary + ${extraVariants.length} extra variant${extraVariants.length > 1 ? "s" : ""}`
            : "1 variant will be created"}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="flex-1 md:flex-none"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isCreating || !isValid}
            className="flex-1 md:flex-none h-11 px-8 font-bold shadow-sm"
          >
            {isCreating ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4" />
                Save Product
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
