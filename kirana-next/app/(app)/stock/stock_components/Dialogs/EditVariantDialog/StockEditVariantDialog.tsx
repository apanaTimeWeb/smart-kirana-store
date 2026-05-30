"use client";

// StockEditVariantDialog.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Entry point for the "Edit Pack / Size" dialog.
// This file is INTENTIONALLY thin (~35 lines) — it only:
//   1. Wraps children in StockEditVariantDialogProvider (local draft state context)
//   2. Renders the Dialog shell with header and scrollable body
//
// ALL draft logic lives in StockEditVariantDialogContext.tsx
// ALL field UI lives in StockEditVariantDialog*.tsx sub-components
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Package } from "lucide-react";
import { StockEditVariantDialogProvider, useStockEditVariantDialog } from "../../Contexts/StockEditVariantDialogContext";
import { StockEditVariantDialogNameExpiryRow } from "./StockEditVariantDialogNameExpiryRow";
import { StockEditVariantDialogUnitSection } from "./StockEditVariantDialogUnitSection";
import { StockEditVariantDialogPriceMarginSection } from "./StockEditVariantDialogPriceMarginSection";
import { StockEditVariantDialogStockExtrasSection } from "./StockEditVariantDialogStockExtrasSection";
import { StockEditVariantDialogFooter } from "./StockEditVariantDialogFooter";

// Inner component — reads from context to control dialog open state
function StockEditVariantDialogInner() {
  const { product, closeDialog } = useStockEditVariantDialog();

  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="max-w-2xl max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="bg-[var(--stock-card-bg)] px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--stock-primary-bg)] text-[var(--stock-primary-text)] shadow-sm">
              <Package className="h-4.5 w-4.5" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-lg font-bold">Edit Pack / Size</DialogTitle>
              <DialogDescription className="text-xs text-[var(--stock-muted-text)] mt-0.5">
                Update details for {product?.productName}. Unit changes will auto-wire base calculations.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <StockEditVariantDialogNameExpiryRow />
          <StockEditVariantDialogUnitSection />
          <StockEditVariantDialogPriceMarginSection />
          <StockEditVariantDialogStockExtrasSection />
        </div>

        {/* Fixed Footer */}
        <StockEditVariantDialogFooter />
      </DialogContent>
    </Dialog>
  );
}

// Exported component — wraps inner with the edit dialog context provider
export function StockEditVariantDialog() {
  return (
    <StockEditVariantDialogProvider>
      <StockEditVariantDialogInner />
    </StockEditVariantDialogProvider>
  );
}
